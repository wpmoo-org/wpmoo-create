#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';

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
      name: 'projectNamespace',
      message: 'Enter the PHP Namespace:',
      default: (answers) => answers.projectName.replace(/\w+/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).replace(/\s/g, ''),
      validate: (input) => input ? true : 'Namespace cannot be empty.',
    },
    {
        type: 'input',
        name: 'textDomain',
        message: 'Enter the Text Domain:',
        default: (answers) => answers.projectName.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, ''),
        validate: (input) => input ? true : 'Text Domain cannot be empty.',
    },
  ]);

  console.log(chalk.green('Project details:'), answers);
}

run().catch((error) => {
  console.error(chalk.red('An error occurred:'), error);
  process.exit(1);
});
