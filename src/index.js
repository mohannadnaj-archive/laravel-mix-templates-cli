global._ = require('lodash')
global.path = require('path')
global.util = require('util')
global.File = require('./File')
global.fs = require('fs-extra')
global.Helper = require('./Helper')
global.program = require('commander')
global.promptly = require('promptly')
global.Messages = require('./Messages')
global.Template = require('./Template')
global.exec = require('child_process').exec
global.download = require('download-git-repo')
global.FileCollection = require('./FileCollection')