class FileCollection {
  constructor (path) {
    this.path = path
    this.files = []
    this.setFiles()
  }

  setFiles () {
    let files = fs.readdirSync(this.path)

    files.forEach((item) => {
      this.files.push(new File(`${this.path}/${item}`, this.path))
    })
  }

  filesToArray (property = 'filePath') {
    return _.map(this.files, property)
  }

  forEach (callback) {
    return this.files.forEach(callback)
  }
}

module.exports = FileCollection
