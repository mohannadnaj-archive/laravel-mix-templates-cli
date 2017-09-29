class Helper {
  static isNo (message) {
    return message.toLowerCase().substr(0, 1) === 'n'
  }

  /**
  * Install the given dependencies using npm or yarn.
  *
  * @param {array} dependencies
  * modified from: laravel-mix/src/Verify.js
  */
  static installDependenciesAt (destination) {
    if (destination !== './') {
      destination = destination + '/'
    }

    let commandPrefix = destination === './' ? '' : `cd ${destination} && `

    let command = `${commandPrefix}npm install`

    if (File.exists(`${destination}yarn.lock`)) {
      command = `${commandPrefix}yarn install`
    }
    console.log(util.format(Messages.commandRunning, command))
    var execProcess = exec(command, execOutput)
    execProcess.stdout.pipe(process.stdout)
  }
}

let execOutput = (error, stdout, stderr) => {
  if (error) {
    console.error('exec error:', error)
  }
}

module.exports = Helper
