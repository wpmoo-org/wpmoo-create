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

async function run() {
    console.log(chalk.blue('>>> Welcome to the WPMoo project creator! <<<'));
    console.log('');

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'projectType',
            message: 'Are you creating a Theme or a Plugin?',
            choices: ['Plugin', 'Theme'],
        },
        {
            type: 'input',
            name: 'projectName',
            message: (answers) => `Enter your ${answers.projectType} Name:`,
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
        },
        {
            type: 'list',
            name: 'initialTheme',
            message: 'Select initial WPMoo theme for development:',
            choices: ['amber', 'azure', 'blue', 'cyan', 'fuchsia', 'green', 'grey', 'indigo', 'jade', 'lime', 'orange', 'pink', 'pumpkin', 'purple', 'red', 'sand', 'slate', 'violet', 'yellow', 'zinc'],
            default: 'amber',
        },
    ]);

    const { projectType, projectName, projectDescription, authorName, authorEmail, projectNamespace, textDomain, mainFileName, initialTheme } = answers;
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
    console.log(`  Initial Theme: ${chalk.bold(initialTheme)}`);
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

    // Copy common templates
    await copyAndProcessFile(path.join(templateBaseDir, 'composer.json'), path.join(targetDir, 'composer.json'), answers, authorName, authorEmail);
    await copyAndProcessFile(path.join(templateBaseDir, 'wpmoo-config.yml'), path.join(targetDir, 'wpmoo-config.yml'), answers, authorName, authorEmail, projectSlug, initialTheme);
    await copyAndProcessFile(path.join(templateBaseDir, 'gitignore'), path.join(targetDir, '.gitignore'), answers, authorName, authorEmail);
    await copyAndProcessFile(path.join(templateBaseDir, 'README.md'), path.join(targetDir, 'README.md'), answers, authorName, authorEmail, projectSlug, projectType);

    if (projectType === 'Plugin') {
        // Copy plugin specific templates
        await fs.ensureDir(path.join(targetDir, 'src')); // Create src dir for plugin code
        await copyAndProcessFile(path.join(templateBaseDir, 'plugin', 'plugin.php'), path.join(targetDir, mainFileName), answers, authorName, authorEmail);
        await copyAndProcessFile(path.join(templateBaseDir, 'plugin', 'src', 'HelloWorld.php'), path.join(targetDir, 'src', 'HelloWorld.php'), answers, authorName, authorEmail);
    } else if (projectType === 'Theme') {
        // Copy theme specific templates
        await copyAndProcessFile(path.join(templateBaseDir, 'theme', 'style.css'), path.join(targetDir, 'style.css'), answers, authorName, authorEmail);
        await copyAndProcessFile(path.join(templateBaseDir, 'theme', 'functions.php'), path.join(targetDir, 'functions.php'), answers, authorName, authorEmail);
    }
    
    // Run composer install
    console.log(chalk.blue('\nRunning composer install... This may take a moment.'));
    try {
        execSync('composer install', { cwd: targetDir, stdio: 'inherit' });
        console.log(chalk.green('✓ Composer dependencies installed.'));
    } catch (error) {
        console.error(chalk.red('✗ Composer install failed:'), error.message);
        process.exit(1);
    }


    console.log(chalk.bold.green('\nProject setup complete!'));
    console.log(chalk.bold.blue('Next steps:'));
    console.log(`  cd ${projectSlug}`);
    console.log('  php moo dev');
    console.log(chalk.gray('  (To deploy for production, run: php moo dist)'));

}

// Helper function to copy and process template files
async function copyAndProcessFile(sourcePath, destPath, answers, authorName, authorEmail, projectSlug = '', initialTheme = '', projectType = '') {
    let content = await fs.readFile(sourcePath, 'utf8');

    content = content
        .replace(/{{PROJECT_NAME}}/g, answers.projectName)
        .replace(/{{PROJECT_DESCRIPTION}}/g, answers.projectDescription)
        .replace(/{{AUTHOR_NAME}}/g, authorName)
        .replace(/{{AUTHOR_EMAIL}}/g, authorEmail)
        .replace(/{{NAMESPACE}}/g, answers.projectNamespace)
        .replace(/{{TEXT_DOMAIN}}/g, answers.textDomain);
    
    // Specific replacements that might not be available in all templates
    if (projectSlug) {
        content = content.replace(/{{PROJECT_SLUG}}/g, projectSlug);
    }
    if (initialTheme) {
        content = content.replace(/{{INITIAL_THEME}}/g, initialTheme);
    }
    if (projectType) {
        content = content.replace(/{{PROJECT_TYPE}}/g, projectType.toLowerCase());
    }
    if (answers.mainFileName) {
        content = content.replace(/{{MAIN_FILE_NAME}}/g, answers.mainFileName);
    }

    await fs.writeFile(destPath, content);
}

run().catch((error) => {
    console.error(chalk.red('An error occurred:'), error);
    process.exit(1);
});