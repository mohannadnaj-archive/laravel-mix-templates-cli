class Template {
  constructor (_path, destination = './') {
    if (!File.exists(_path)) {
      console.log('No templates found on: %s', _path)
      process.exit()
    }
    this.templateFiles = new FileCollection(_path)
    this.destinationFiles = new FileCollection(destination)
    this.destination = destination
    this.path = _path
  }

  getDestConflicts (joinString = null) {
    var conflicts = this.templateFiles.filesToArray().filter((templateFile) => {
      return this.destinationFiles.filesToArray().indexOf(templateFile) !== -1
    })

    if (joinString) { return conflicts.join(joinString) }

    return conflicts
  }

  hasDestConflicts () {
    return this.getDestConflicts().length !== 0
  }

  copy () {
    return fs.copy(this.path, this.destination)
  }
}

module.exports = Template
