class MixInitializer {
  constructor (options) {
    this.templateName = options.template
    this.installDependencies = options.installDependencies
    this.destination = options.destination || './'
    this.temporaryTemplatePath = `${__dirname}/../templates/temp/${this.templateName}`
    this.templatePath = `${__dirname}/../templates/${this.templateName}`
    this.init()
  }

  startCopy () {
    console.log(Messages.startCopying)
    this.template.copy()
    console.log(Messages.success)
    if (this.installDependencies) {
      Helper.installDependenciesAt(this.destination)
    }
  }

  init () {
    this.createDirIfNotExist(this.destination)
    console.log(Messages.init)

    download(`laravel-mix-templates/${this.templateName}`, this.temporaryTemplatePath, (err) => {
      if (err) {
        console.log(util.format(Messages.downloadTemplateError, this.templateName))
        this.exitIfNoTemplate()

        console.log(util.format(Messages.cacheIsFound, this.templateName))
        return this.createTemplate()
      }
      console.log(util.format(Messages.successTemplateDownload, this.templateName))

      if (File.exists(this.templatePath)) {
        fs.remove(this.templatePath).then(() => { this.moveTemplate() })
      } else {
        this.moveTemplate()
      }
    })
  }

  moveTemplate () {
    fs.move(this.temporaryTemplatePath, this.templatePath)
    .then(() => {
      this.createTemplate()
    })
    .catch(err => {
      console.error(err)
    })
  }

  templateExists () {
    return File.exists(this.templatePath)
  }

  createTemplate () {
    this.template = new Template(this.templatePath, this.destination)

    if (!this.template.hasDestConflicts()) {
      this.startCopy()
    } else {
      this.promptForConflictThen((input) => {
        if (Helper.isNo(input)) {
          process.exit()
        }
        this.startCopy()
      })
    }
  }

  createDirIfNotExist (dir) {
    fs.ensureDir(dir, (err) => {
      if (!err) return

      console.log(util.format(Messages.createDirectoryError, dir), err)
    })
  }

  promptForConflictThen (callback) {
    promptly
    .prompt(util.format(Messages.conflictConfirmation, this.template.getDestConflicts(', ')))
      .then(callback)
  }

  exitIfNoTemplate () {
    if (!this.templateExists()) {
      console.error(util.format(Messages.templateNotFound, this.templateName))
      console.error(Messages.exit)
      process.exit()
    }
  }
}
module.exports = MixInitializer
