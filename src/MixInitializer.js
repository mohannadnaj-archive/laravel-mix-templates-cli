const _ = require('lodash')
const path = require('path')
const util = require('util')
const File = require('./File')
const fs = require('fs-extra')
const Helper = require('./Helper')
const program = require('commander')
const promptly = require('promptly')
const Messages = require('./Messages')
const Template = require('./Template')
const exec = require('child_process').exec
const download = require('download-git-repo')
const FileCollection = require('./FileCollection')

class MixInitializer {
  constructor (options) {
    this.templateName = options.template
    this.installDependencies = options.installDependencies
    this.destination = options.destination
    this.temporaryTemplatePath = path.resolve(`${__dirname}/../templates/temp/${this.templateName}`)
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
        if(this.exitIfNoTemplate())
          return ;

        console.log(util.format(Messages.cacheIsFound, this.templateName))
        return this.createTemplate()
      }
      console.log(util.format(Messages.successTemplateDownload, this.templateName))

      if (File.exists(this.templatePath)) {
        fs.removeSync(this.templatePath)
      }

      this.moveTemplate()
    })
  }

  moveTemplate () {
    fs.copySync(this.temporaryTemplatePath, this.templatePath, { overwrite: true })
    this.createTemplate()
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
          return process.exit()
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
      return true
    }
    return false
  }
}
module.exports = MixInitializer
