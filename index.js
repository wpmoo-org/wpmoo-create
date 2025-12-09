#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Helper functions
const slugify = (str) => str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
const pascalCase = (str) => str.replace(/\w+/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).replace(/\s/g, '');
const snakeCase = (str) => slugify(str).replace(/-/g, '_');

async function run() {
    console.log(chalk.blue('>>> Welcome to the WPMoo project creator! <<<'));
    console.log('');

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'projectType',
            message: 'Are you creating a Theme or a Plugin?',
            choices: ['Plugin', 'Theme'],
            default: 'Plugin',
        },
        {
            type: 'input',
            name: 'projectName',
            message: (answers) => `Enter your ${answers.projectType} Name`,
            validate: (input) => input ? true : 'Project name cannot be empty.',
        },
        {
            type: 'input',
            name: 'projectDescription',
            message: 'Enter a short description:',
        },
        {
            type: 'input',
            name: 'authorName',
            message: 'Enter Author Name:',
        },
        {
            type: 'input',
            name: 'authorEmail',
            message: 'Enter Author Email:',
            validate: (input) => /.+@.+/.test(input) ? true : 'Please enter a valid email address.',
        },
        {
            type: 'input',
            name: 'projectNamespace',
            message: 'Enter the PHP Namespace:',
            default: (answers) => pascalCase(answers.projectName),
            validate: (input) => input ? true : 'Namespace cannot be empty.',
        },
        {
            type: 'input',
            name: 'textDomain',
            message: 'Enter the Text Domain:',
            default: (answers) => slugify(answers.projectName),
            validate: (input) => input ? true : 'Text Domain cannot be empty.',
        },
        {
            type: 'input',
            name: 'mainFileName',
            message: 'Enter the main plugin file name (e.g., your-plugin.php):',
            default: (answers) => `${slugify(answers.projectName)}.php`,
            when: (answers) => answers.projectType === 'Plugin',
            validate: (input) => input ? true : 'Main plugin file name cannot be empty.',
        }
    ]);

    const { projectType, projectName, projectDescription, authorName, authorEmail, projectNamespace, textDomain, mainFileName } = answers;
    const projectSlug = slugify(projectName);
    const targetDir = path.resolve(process.cwd(), projectSlug);

    console.log('');
    console.log(chalk.cyan('--- Project Summary ---'));
    console.log(`  Project Type: ${chalk.bold(projectType)}`);
    console.log(`  Project Name: ${chalk.bold(projectName)}`);
    console.log(`  Directory:    ${chalk.bold(projectSlug)}`);
    console.log(`  Namespace:    ${chalk.bold(projectNamespace)}`);
    console.log(`  Text Domain:  ${chalk.bold(textDomain)}`);
    console.log(`  Author:       ${chalk.bold(authorName)} <${chalk.bold(authorEmail)}>`);
    if (projectType === 'Plugin') {
        console.log(`  Main File:    ${chalk.bold(mainFileName)}`);
    }
    console.log('-----------------------');

    const { proceed } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'proceed',
            message: 'Do you want to create this project?',
            default: true,
        },
    ]);

    if (!proceed) {
        console.log(chalk.yellow('Project creation cancelled.'));
        process.exit(0);
    }

    console.log(chalk.green(`\nCreating ${projectType.toLowerCase()} project in ${chalk.bold(targetDir)}...`));

    // Create project directory
    await fs.ensureDir(targetDir);

    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const templateBaseDir = path.join(__dirname, 'templates');

    const placeholders = {
        'PROJECT_TYPE': projectType.toLowerCase(),
        'PROJECT_NAME': projectName,
        'PROJECT_DESCRIPTION': projectDescription,
        'AUTHOR_NAME': authorName,
        'AUTHOR_EMAIL': authorEmail,
        'NAMESPACE': projectNamespace,
        'TEXT_DOMAIN': textDomain,
        'MAIN_FILE_NAME': mainFileName || '',
        'INITIAL_THEME': "amber", // Default to amber
        'PROJECT_SLUG': projectSlug,
        'PROJECT_FUNCTION_NAME': snakeCase(projectName),
    };

    // Copy common templates
    await copyAndProcessFile(path.join(templateBaseDir, 'composer.json'), path.join(targetDir, 'composer.json'), placeholders);
    await copyAndProcessFile(path.join(templateBaseDir, 'package.json'), path.join(targetDir, 'package.json'), placeholders);
    
    // Copy wpmoo-config directory
    await fs.ensureDir(path.join(targetDir, 'wpmoo-config'));
    await copyAndProcessFile(path.join(templateBaseDir, 'wpmoo-config', 'wpmoo-settings.yml'), path.join(targetDir, 'wpmoo-config', 'wpmoo-settings.yml'), placeholders);
    await copyAndProcessFile(path.join(templateBaseDir, 'wpmoo-config', 'deploy.yml'), path.join(targetDir, 'wpmoo-config', 'deploy.yml'), placeholders);

    await copyAndProcessFile(path.join(templateBaseDir, 'gitignore'), path.join(targetDir, '.gitignore'), placeholders);
    await copyAndProcessFile(path.join(templateBaseDir, 'README.md'), path.join(targetDir, 'README.md'), placeholders);

    if (projectType === 'Plugin') {
        // Copy plugin specific templates
        await copyAndProcessFile(path.join(templateBaseDir, 'plugin', 'plugin.php.tpl'), path.join(targetDir, mainFileName), placeholders);
        
        // Recursive copy and process src directory
        const srcSource = path.join(templateBaseDir, 'plugin', 'src');
        const srcDest = path.join(targetDir, 'src');
        await copyAndProcessDirectory(srcSource, srcDest, placeholders);
        
        // Copy templates directory if it exists
        const templatesSource = path.join(templateBaseDir, 'plugin', 'templates');
        const templatesDest = path.join(targetDir, 'templates');
        if (await fs.pathExists(templatesSource)) {
             await copyAndProcessDirectory(templatesSource, templatesDest, placeholders);
        }

    } else if (projectType === 'Theme') {
        // Copy theme specific templates
        await copyAndProcessFile(path.join(templateBaseDir, 'theme', 'style.css'), path.join(targetDir, 'style.css'), placeholders);
        await copyAndProcessFile(path.join(templateBaseDir, 'theme', 'functions.php.tpl'), path.join(targetDir, 'functions.php'), placeholders);
    }

    // Check for local WPMoo framework development directory
    // Assumes wpmoo-create is running alongside wpmoo-org/wpmoo
    const localFrameworkPath = path.resolve(process.cwd(), 'wpmoo-org', 'wpmoo');
    
    if (await fs.pathExists(localFrameworkPath)) {
        console.log(chalk.blue('\nDetected local WPMoo framework at ' + localFrameworkPath));
        console.log('  - Configuring composer to use local framework...');
        
        const composerJsonPath = path.join(targetDir, 'composer.json');
        const composerJson = await fs.readJson(composerJsonPath);
        
        composerJson.repositories = composerJson.repositories || [];
        composerJson.repositories.push({
            type: "path",
            url: path.relative(targetDir, localFrameworkPath),
            options: {
                symlink: true
            }
        });
        
        // Use dev-main version for local development
        if (composerJson.require && composerJson.require['wpmoo/wpmoo']) {
             composerJson.require['wpmoo/wpmoo'] = 'dev-dev';
        }
        
        await fs.writeJson(composerJsonPath, composerJson, { spaces: 2 });
    }

    // Run composer install
    console.log(chalk.blue('\nRunning composer install... This may take a moment.'));
    try {
        execSync('composer install --dev', { cwd: targetDir, stdio: 'inherit' });
        console.log(chalk.green('✓ Composer dependencies installed.'));
    } catch (error) {
        console.error(chalk.red('✗ Composer install failed:'), error.message);
        process.exit(1);
    }

    // Run npm install
    console.log(chalk.blue('\nRunning npm install... This may take a moment.'));
    try {
        execSync('npm install', { cwd: targetDir, stdio: 'inherit' });
        console.log(chalk.green('✓ Node dependencies installed.'));
    } catch (error) {
        console.error(chalk.red('✗ NPM install failed:'), error.message);
        // We don't exit here, as the project is still usable, just dev tools might be missing
    }

    // --- Post-install setup ---
    console.log(chalk.blue('\nRunning post-install setup...'));
    try {
        const vendorDir = path.join(targetDir, 'vendor');
        const wpmooVendorDir = path.join(vendorDir, 'wpmoo', 'wpmoo'); // Correct path for Packagist install

        // 1. Copy dev config files and dirs
        console.log('  - Copying WPMoo development config files and directories...');
        const devItemsToCopy = ['.editorconfig', '.prettierrc.json', '.stylelintrc.json', 'phpcs.xml', '.gitattributes', '.githooks', '.github'];
        for (const item of devItemsToCopy) {
            const sourceItem = path.join(wpmooVendorDir, item);
            if (fs.existsSync(sourceItem)) {
                await fs.copy(sourceItem, path.join(targetDir, item));
            }
        }

        // 2. Create asset structure from templates (from create-wpmoo templates, not framework)
        console.log('  - Creating minimal asset structure...');
        const sourceResourcesDir = path.join(templateBaseDir, 'resources');
        const destResourcesDir = path.join(targetDir, 'resources');
        await fs.copy(sourceResourcesDir, destResourcesDir);

        console.log('  - Copying SCSS Config files from WPMoo framework...');
        const sourceSassConfigDir = path.join(wpmooVendorDir, 'resources', 'scss', 'config');
        const destSassConfigDir = path.join(targetDir, 'resources', 'scss', 'config');
        await fs.copy(sourceSassConfigDir, destSassConfigDir);
        // Do not copy framework directory, it stays in vendor

        // Post-process the SCSS files that need placeholder replacement
        await copyAndProcessFile(
            path.join(destResourcesDir, 'scss', 'main.scss'),
            path.join(destResourcesDir, 'scss', 'main.scss'),
            placeholders
        );

        console.log(chalk.green('✓ Post-install setup complete.'));

    } catch (error) {
        console.error(chalk.red('✗ Post-install setup failed:'), error.message);
        process.exit(1);
    }


    console.log(chalk.bold.green('\nProject setup complete!'));
    console.log(chalk.bold.blue('Next steps:'));
    console.log(`  cd ${projectSlug}`);
    console.log('  php moo dev');
    console.log(chalk.gray('  (To update the framework, run: php moo update)'));
    console.log(chalk.gray('  (To deploy for production, run: php moo dist)'));

}

// Helper function to copy and process template files
async function copyAndProcessFile(sourcePath, destPath, placeholders) {
    let content = await fs.readFile(sourcePath, 'utf8');

    for (const [key, value] of Object.entries(placeholders)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        content = content.replace(regex, value);
    }

    await fs.writeFile(destPath, content);
}

// Helper function to recursively copy and process a directory
async function copyAndProcessDirectory(sourceDir, destDir, placeholders) {
    await fs.ensureDir(destDir);
    const items = await fs.readdir(sourceDir);

    for (const item of items) {
        const sourcePath = path.join(sourceDir, item);
        let destItemName = item;
        if (destItemName.endsWith('.tpl')) {
            destItemName = destItemName.substring(0, destItemName.length - 4);
        }
        const destPath = path.join(destDir, destItemName);
        const stat = await fs.stat(sourcePath);

        if (stat.isDirectory()) {
            await copyAndProcessDirectory(sourcePath, destPath, placeholders);
        } else {
            await copyAndProcessFile(sourcePath, destPath, placeholders);
        }
    }
}

run().catch((error) => {
    console.error(chalk.red('An error occurred:'), error);
    process.exit(1);
});
