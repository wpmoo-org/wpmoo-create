#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

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
            name: 'author',
            message: 'Enter Author Name <email@example.com>:',
            validate: (input) => /.+ <.+@.+>/.test(input) ? true : 'Please use the format "Name <email@example.com>".',
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
    ]);

    const { projectName, projectDescription, author, projectNamespace, textDomain } = answers;
    const projectSlug = slugify(projectName);
    const targetDir = path.resolve(process.cwd(), projectSlug);

    // Parse author name and email
    const authorMatch = author.match(/(.+) <(.+)>/);
    const authorName = authorMatch[1];
    const authorEmail = authorMatch[2];

    console.log('');
    console.log(chalk.cyan('--- Project Summary ---'));
    console.log(`  Project Name: ${chalk.bold(projectName)}`);
    console.log(`  Directory:    ${chalk.bold(projectSlug)}`);
    console.log(`  Namespace:    ${chalk.bold(projectNamespace)}`);
    console.log(`  Text Domain:  ${chalk.bold(textDomain)}`);
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

    console.log(chalk.green(`\nCreating project in ${targetDir}...`));

    // Create project directory
    await fs.ensureDir(targetDir);

    // --- Create composer.json ---
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const composerTemplatePath = path.join(__dirname, 'templates', 'composer.json');
    let composerContent = await fs.readFile(composerTemplatePath, 'utf8');

    composerContent = composerContent
        .replace(/{{TEXT_DOMAIN}}/g, textDomain)
        .replace(/{{PROJECT_DESCRIPTION}}/g, projectDescription)
        .replace(/{{AUTHOR_NAME}}/g, authorName)
        .replace(/{{AUTHOR_EMAIL}}/g, authorEmail)
        .replace(/{{NAMESPACE}}/g, projectNamespace);

    await fs.writeFile(path.join(targetDir, 'composer.json'), composerContent);

    console.log(chalk.green('✓ Created composer.json'));
    console.log(chalk.bold.blue('\nProject setup complete! Next steps:'));
    console.log(`  cd ${projectSlug}`);
    console.log('  composer install');
    console.log('  php moo dev');

}

run().catch((error) => {
    console.error(chalk.red('An error occurred:'), error);
    process.exit(1);
});