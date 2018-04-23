const inquirer = require('inquirer');
const chalk = require('chalk');
const { strings } = require('@angular-devkit/core');
const { Collection, CollectionFactory, SchematicOption } = require('../lib/schematics')
const { PackageManager, PackageManagerFactory } = require('../lib/package-managers');
const { emojis, messages } = require('../lib/ui');
const { getQuestions } = requore('../lib/prompt');

const SCHEMATICS_NEST_COLLECTION = `The NestJS team is happy that you use its schematics collection ${ emojis.HEART_EYES }`;
const SCHEMATICS_USER_COLLECTION = `You decide to use your own schematics collection ${ emojis.CRYING }`;

const OPTION_INVALID_SCHEMATIC = (options) => `You must specify a schematic to execute from your collection : ${ options.collection }`;
const OPTION_INVALID_COLLECTION = (options) => `You must specify a collection to execute schematic : ${ options.schematic }`;

module.exports = (args, opts, logger) => {
  if (opts[ 'dryRun' ] === undefined) {

  } else {
    const collection = dryRun(opts)(logger);
    logger.info(collection);
  }
};

function standard() {
  // create collection
  // ask for missing inputs
  // parse options
  // execute schematic
  // ask for package manager
  // install packages
}

function dryRun(opts) {
  return common(opts);
}

function common(opts) {
  // create collection
  return createCollection(opts);
  // ask for missing inputs
  // parse args and options
  // execute schematic
}

function createCollection(options) {
  return (logger) => {
    validate(options)(logger);
    if (options.collection === undefined) {
      logger.info(chalk.green(SCHEMATICS_NEST_COLLECTION));
      return CollectionFactory.create(Collection.NESTJS, logger);
    } else {
      logger.info(chalk.green(SCHEMATICS_USER_COLLECTION));
      return CollectionFactory.create(options.collection, logger);
    }
  }
}

function validate(options) {
  return (logger) => {
    if (options.collection !== undefined && options.schematic === undefined) {
      logger.error(chalk.red(OPTION_INVALID_SCHEMATIC(options)));
      process.exit(1);
    }
    if (options.schematic !== undefined && options.collection === undefined) {
      logger.error(chalk.red(OPTION_INVALID_COLLECTION(options)));
      process.exit(1);
    }
  }
}

function runNestSchematicsProcess(args, options, logger) {
  return askForMissingInformation(args, logger)
    .then(() => executeSchematic(args, options, logger))
    .then(() => {
      if (!options[ 'dryRun' ]) {
        return selectPackageManager();
      }
    })
    .then((packageManager) => installPackages(packageManager, strings.dasherize(args.name), logger));
}

function askForMissingInformation(args) {
  logger.info(chalk.green(messages.PROJECT_INFORMATION_START));
  const prompt = inquirer.createPromptModule();
  const questions = getQuestions(args);
  return (logger) => {
    return prompt(questions)
      .then((answers) => {
        args.name = args.name !== undefined ? args.name : answers.name;
        args.description = args.description !== undefined ? args.description : answers.description;
        args.version = args.version !== undefined ? args.version : answers.version;
        args.author = args.author !== undefined ? args.author : answers.author;
        logger.info(chalk.green(messages.PROJECT_INFORMATION_COLLECTED));
      });
  };
}

function executeSchematic(args, options, logger) {
  const collection = CollectionFactory.create(Collection.NESTJS, logger);
  const schematicOptions = Parser.parse(args, options);
  return collection.execute('application', schematicOptions);
}

class Parser {
  static parse(args, options) {
    const schematicOptions = [];
    Object.keys(args).forEach((key) => {
      schematicOptions.push(new SchematicOption(key, args[ key ]));
    });
    Object.keys(options).forEach((key) => {
      schematicOptions.push(new SchematicOption(key, options[ key ] !== undefined));
    });
    return schematicOptions;
  }
}

function parse(args) {
  const options = [];
  for (const key in args) {
    options.push(new SchematicOption(key, args[ key ]));
  }
  return (opts) => {
    for (const key in opts) {
      if (key !== 'collection' && key !== 'schematic') {
        options.push(new SchematicOption(strings.dasherize(key), opts[ key ] !== undefined));
      }
    }
    return options;
  };
}


function selectPackageManager() {
  const prompt = inquirer.createPromptModule();
  const questions = [{
    type: 'list',
    name: 'package-manager',
    message: messages.PACKAGE_MANAGER_QUESTION,
    choices: [ PackageManager.NPM, PackageManager.YARN ]
  }];
  return prompt(questions).then((answers) => answers[ 'package-manager' ]);
}

function installPackages(packageManager, directory, logger) {
  if (packageManager !== undefined && packageManager !== null && packageManager !== '') {
    return PackageManagerFactory.create(packageManager, logger).install(directory);
  } else {
    logger.info(chalk.green(messages.DRY_RUN_MODE));
  }
}
