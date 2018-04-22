module.exports = (program) => {
  program
    .command('new')
    .alias('n')
    .argument('[name]', 'The NestJS application name.')
    .argument('[description]', 'The NestJS application description.')
    .argument('[version]', 'The NesJS application version.')
    .argument('[author]', 'The NestJS application author.')
    .option('--dry-run', 'Allow to test changes before execute command.')
    .option('--collection <collection>', 'Allow to use your custom schematics collection.')
    .option('--schematic <schematic>', 'The schematic to run from you custom collection.')
    .action(require('../actions/new'));
};
