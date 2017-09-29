let program = require('commander')

require('commander')
  .version(require('../../package').version)
  .usage('<command> [options]')
  .command('init', 'generate a new project')
  .alias('new')

program.parse(process.argv)
