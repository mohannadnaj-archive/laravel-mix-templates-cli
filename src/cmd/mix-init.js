require('../index')
const MixInitializer = require('../MixInitializer')

let chosenTemplate = 'default'

program
  .version(require('../../package').version)
  .option('-i, --install', 'install npm/yarn dependencies after initiating the project')
  .option('-d, --dir <dir>', 'create this project in new directory')
  .command('*')
  .action((template) => {
    chosenTemplate = template
  })

program.parse(process.argv)

new MixInitializer({
  destination: program.dir,
  template: chosenTemplate,
  installDependencies: program.install
})
