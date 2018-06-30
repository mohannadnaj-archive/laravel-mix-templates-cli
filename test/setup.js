const mock = require('mock-require')
const path = require('path')
const sinon = require('sinon')
const fs = require('fs-extra')

let setupApi = {}
setupApi = {
  stubsDir: 'stubs',
  downloadGitRepoSpy: null,
  sinonSandbox: null,
  shouldMockConsole: false,
  shouldMockPromptly: false,
  shouldSpyMixInitializer: false,
  consoleStub: null,
  mixInitializerSpy: null,
  childProcessMock: null,
  promptlyStub: null,
  cleanStubs () {
    let cleanDirectories = ['templates', 'stubs']
    cleanDirectories.forEach((dir) => {
      fs.readdirSync(path.join(__dirname, `../${dir}`))
      .forEach((file) => {
        if (file != '.gitignore') { fs.removeSync(path.join(__dirname, `../${dir}`, file)) }
      })
    })
  },
  commonBeforeEach (t) {
    setupApi.sinonSandbox = sinon.createSandbox()
    setupApi.downloadGitRepoSpy = setupApi.sinonSandbox.spy()
    setupApi.childProcessMock = setupApi.sinonSandbox.spy(() => {
      return {
        stdout: {
          pipe: () => {}
        }
      }
    })

    if (setupApi.shouldMockConsole) { setupApi.consoleStub = setupApi.sinonSandbox.stub(console) }

    if (setupApi.shouldSpyMixInitializer) {
      let MixInitializerSpy = setupApi.sinonSandbox.spy()
      mock('../src/MixInitializer', MixInitializerSpy)
      setupApi.mixInitializerSpy = MixInitializerSpy
    }
  },
  commonAfterEach (t) {
    setupApi.sinonSandbox.restore()
  },
  mockConsole () {
    setupApi.shouldMockConsole = true
  },
  mockPromptly () {
    delete require.cache[require.resolve('promptly')]
    let realPromptlyStub = setupApi.sinonSandbox.stub({
      then: () => {}
    })
    let promptlyStub = () => {
      return realPromptlyStub
    }

    setupApi.promptlyStub = realPromptlyStub

    mock('promptly', {
      prompt: promptlyStub
    })
    setupApi.shouldMockPromptly = true
  },
  command (line) {
    delete require.cache[require.resolve('commander')]
    delete require.cache[require.resolve('../src/MixInitializer')]
    process.argv = line.split(' ')
    mock.reRequire('../src/cmd/mix-init.js')
  },
  spyMixInitiliazer () {
    setupApi.shouldSpyMixInitializer = true
  }
}

mock('download-git-repo', (...args) => { return setupApi.downloadGitRepoSpy(...args) })
mock('child_process', {exec: (...args) => { return setupApi.childProcessMock(...args) }})

module.exports = setupApi
