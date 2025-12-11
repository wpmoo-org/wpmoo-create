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
    // Locate the starter templates within the WPMoo framework
    const wpmooFrameworkPath = await findWpmooFrameworkPath(process.cwd());
    if (!wpmooFrameworkPath) {
        console.error(chalk.red('✗ Could not find local WPMoo framework (wpmoo-org/wpmoo). Aborting template setup.'));
        process.exit(1);
    }
    const templateBaseDir = path.join(__dirname, 'templates');
    console.log(chalk.blue(`  - Using templates from: ${templateBaseDir}`));

    const placeholders = {
        'PROJECT_TYPE': projectType.toLowerCase(),
        'PROJECT_NAME': projectName,
        'PROJECT_DESCRIPTION': projectDescription,
        'PROJECT_AUTHOR_NAME': authorName,
        'PROJECT_AUTHOR_EMAIL': authorEmail,
        'PROJECT_NAMESPACE': projectNamespace, // For PHP templates
        'PROJECT_NAMESPACE_WITH_SLASH': JSON.stringify(projectNamespace + '\\').slice(1, -1), // For composer.json
        'PROJECT_TEXT_DOMAIN': textDomain,
        'PROJECT_MAIN_FILE_NAME': mainFileName || '',
        'INITIAL_THEME': "amber", // Default to amber
        'PROJECT_SLUG': projectSlug,
        'PROJECT_FUNCTION_NAME': snakeCase(projectName),
        'PROJECT_ACTIVATE_FUNCTION_NAME': `activate_${snakeCase(projectName)}`,
        'PROJECT_DEACTIVATE_FUNCTION_NAME': `deactivate_${snakeCase(projectName)}`,
    };

    const localFrameworkPath = await findWpmooFrameworkPath(process.cwd());

    if (!localFrameworkPath) {

        console.error(chalk.red('✗ Could not find local WPMoo framework (wpmoo-org/wpmoo). Aborting.'));

        process.exit(1);

    }



    console.log(chalk.blue('\nCopying base files from WPMoo framework...'));

    const wpmooFrameworkBaseDir = localFrameworkPath;
    const starterFilesManifestPath = path.join(wpmooFrameworkBaseDir, 'starter-files.json');

    let starterFiles = { files: [], directories: [] };
    if (await fs.pathExists(starterFilesManifestPath)) {
        starterFiles = await fs.readJson(starterFilesManifestPath);
        console.log(chalk.blue('  - Using starter-files.json from WPMoo framework for initial copy.'));
    } else {
        console.log(chalk.yellow('  - Warning: starter-files.json not found in WPMoo framework. Using default essential files.'));
    }

    // Combine starter files with other essential project files/directories
    const combinedItemsToCopy = [
        ...starterFiles.files,
        ...starterFiles.directories,
        'LICENSE',
        'package.json',
        'readme.txt',
        'CODE_OF_CONDUCT.md',
        'resources', // Copy entire resources directory
        'languages', // Copy entire languages directory
        'wpmoo-config', // Copy entire wpmoo-config directory
    ];

    // Remove duplicates
    const uniqueItemsToCopy = [...new Set(combinedItemsToCopy)];

    // Copy selected files/directories from WPMoo framework
    for (const item of uniqueItemsToCopy) {
        const sourcePath = path.join(wpmooFrameworkBaseDir, item);
        const destPath = path.join(targetDir, item);
        if (await fs.pathExists(sourcePath)) {
            const stats = await fs.stat(sourcePath);
            if (stats.isDirectory()) {
                await fs.ensureDir(destPath); // Ensure directory exists before copying contents
                // Recursively copy and process, but exclude .gitkeep files from empty directories
                const itemsInDir = await fs.readdir(sourcePath);
                for (const subItem of itemsInDir) {
                    if (subItem === '.gitkeep') continue;
                    const subSourcePath = path.join(sourcePath, subItem);
                    const subDestPath = path.join(destPath, subItem);
                    const subStats = await fs.stat(subSourcePath);
                    if (subStats.isDirectory()) {
                        await copyAndProcessDirectory(subSourcePath, subDestPath, placeholders);
                    } else {
                        await copyAndProcessFile(subSourcePath, subDestPath, placeholders);
                    }
                }
            } else {
                await copyAndProcessFile(sourcePath, destPath, placeholders);
            }
        } else {
            console.log(chalk.yellow(`    - Warning: '${item}' not found in WPMoo framework, skipping.`));
        }
    }

    // Copy composer.json from wpmoo-create templates
    await copyAndProcessFile(path.join(templateBaseDir, 'composer.json'), path.join(targetDir, 'composer.json'), placeholders);

    // Copy README.md from wpmoo-create templates (contains specific instructions for new projects)
    await copyAndProcessFile(path.join(templateBaseDir, 'README.md'), path.join(targetDir, 'README.md'), placeholders);

    // Copy main plugin file from wpmoo-create template
    if (projectType === 'Plugin') {
        await copyAndProcessFile(path.join(templateBaseDir, 'plugin', 'plugin.php'), path.join(targetDir, mainFileName), placeholders);
    } else if (projectType === 'Theme') {
        // TODO: Implement theme specific templates from wpmoo-create
        console.log(chalk.yellow('  - Theme creation is not fully implemented yet. Minimal theme structure copied.'));
        await copyAndProcessFile(path.join(templateBaseDir, 'theme', 'style.css'), path.join(targetDir, 'style.css'), placeholders);
        await copyAndProcessFile(path.join(templateBaseDir, 'theme', 'functions.php'), path.join(targetDir, 'functions.php'), placeholders);
    }
    // Generate minimal src directory from wpmoo-create templates
    const srcSource = path.join(templateBaseDir, 'plugin', 'src');
    const srcDest = path.join(targetDir, 'src');
    await copyAndProcessDirectory(srcSource, srcDest, placeholders);



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

        const manifestPath = path.join(wpmooVendorDir, 'starter-files.json');
        let itemsToCopy = [];

        if (fs.existsSync(manifestPath)) {
            console.log('  - Found starter-files.json manifest. Using it to copy files.');
            const manifest = await fs.readJson(manifestPath);
            const files = manifest.files || [];
            const directories = manifest.directories || [];
            itemsToCopy = [...files, ...directories];
        } else {
            console.log('  - starter-files.json not found. Falling back to hardcoded list.');
            itemsToCopy = ['.editorconfig', '.prettierrc.json', '.stylelintrc.json', 'phpcs.xml', '.gitattributes', '.githooks', '.github'];
        }

        for (const item of itemsToCopy) {
            const sourceItem = path.join(wpmooVendorDir, item);
            if (fs.existsSync(sourceItem)) {
                await fs.copy(sourceItem, path.join(targetDir, item));
            } else {
                console.log(chalk.yellow(`    - Warning: Could not find '${item}' to copy.`));
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
            path.join(sourceResourcesDir, 'scss', 'main.scss'),
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
        // New placeholder convention: use the uppercase KEY itself, matched with word boundaries.
        // Example: PROJECT_TYPE, PROJECT_NAME
        const regex = new RegExp(`\\b${key}\\b`, 'g'); // Use word boundaries to match exact key
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
        const destPath = path.join(destDir, item); // No .tpl removal needed
        const stat = await fs.stat(sourcePath);

        if (stat.isDirectory()) {
            await copyAndProcessDirectory(sourcePath, destPath, placeholders);
        } else {
            await copyAndProcessFile(sourcePath, destPath, placeholders);
        }
    }
}

/**
 * Searches up the directory tree to find the root of the WPMoo framework.
 * @param {string} startDir The directory to start searching from.
 * @returns {Promise<string|null>} The full path to the framework directory, or null if not found.
 */
async function findWpmooFrameworkPath(startDir) {
    let currentDir = startDir;
    // Ascend until the root directory is reached
    while (currentDir !== path.parse(currentDir).root) {
        const potentialPath = path.join(currentDir, 'wpmoo-org', 'wpmoo');
        if (await fs.pathExists(potentialPath)) {
            return potentialPath;
        }
        currentDir = path.dirname(currentDir);
    }
    return null; // Return null if the framework path is not found
}


run().catch((error) => {
    console.error(chalk.red('An error occurred:'), error);
    process.exit(1);
});
