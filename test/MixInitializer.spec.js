import path from 'path'
import test from 'ava'
import setup from './setup'
const fs = require('fs-extra')

setup.mockConsole()

test.beforeEach(() => {
  setup.cleanStubs()
  setup.commonBeforeEach()
})

test.afterEach(setup.commonAfterEach)

test.after(setup.cleanStubs)

test(`'mix init -d stubs': real copy 'default' template files`, t => {
  // arrange
  setup.command(`mix init -d stubs`)
  fs.ensureFileSync(path.join(path.resolve(__dirname + '/../templates/temp/default'), 'foobar.mix'), err => { if (err) throw err })

  // act
  setup.downloadGitRepoSpy.firstCall.args[2]()

  // assert
  t.true(fs.existsSync(path.join(path.resolve(__dirname + '/../templates/default'), 'foobar.mix')))
  t.true(fs.existsSync(path.join(path.resolve(__dirname + '/../stubs'), 'foobar.mix')))
})

test(`'mix init -d stubs -i': copy 'default' template files, and 'cd default', and 'npm install' `, t => {
  // arrange
  setup.command(`mix init -d stubs -i`)
  fs.ensureFileSync(path.join(path.resolve(__dirname + '/../templates/temp/default'), 'foobar.mix'), err => { if (err) throw err })

  // act
  setup.downloadGitRepoSpy.firstCall.args[2]()

  // assert
  t.true(fs.existsSync(path.join(path.resolve(__dirname + '/../templates/default'), 'foobar.mix')))
  t.true(fs.existsSync(path.join(path.resolve(__dirname + '/../stubs'), 'foobar.mix')))

  t.is(setup.childProcessMock.firstCall.args[0], 'cd stubs/ && npm install')
})

test(`'mix init -d stubs -i': copy 'default' template files, and 'cd default', and 'yarn install' if yarn.lock file exists`, t => {
  // arrange
  setup.command(`mix init -d stubs -i`)
  fs.ensureFileSync(path.join(path.resolve(__dirname + '/../templates/temp/default'), 'foobar.mix'), err => { if (err) throw err })
  fs.ensureFileSync(path.join(path.resolve(__dirname + '/../stubs'), 'yarn.lock'), err => { if (err) throw err })

  // act
  setup.downloadGitRepoSpy.firstCall.args[2]()

  // assert
  t.true(fs.existsSync(path.join(path.resolve(__dirname + '/../templates/default'), 'foobar.mix')))
  t.true(fs.existsSync(path.join(path.resolve(__dirname + '/../stubs'), 'foobar.mix')))

  t.is(setup.childProcessMock.firstCall.args[0], 'cd stubs/ && yarn install')
})

test(`'mix init foobar -d stubs': it will use cache if there is an error downloading 'foobar' template files`, t => {
  // arrange
  fs.ensureFileSync(path.join(path.resolve(__dirname + '/../templates/foobar'), 'foobar.mix'), err => { if (err) throw err })

  setup.command(`mix init foobar -d stubs`)
  fs.ensureFileSync(path.join(path.resolve(__dirname + '/../templates/temp/foobar'), 'foobar.mix'), err => { if (err) throw err })

  // act
  setup.downloadGitRepoSpy.firstCall.args[2](true) // the true argument indicates error

  // assert
  t.true(fs.existsSync(path.join(path.resolve(__dirname + '/../templates/foobar'), 'foobar.mix')))
  t.true(fs.existsSync(path.join(path.resolve(__dirname + '/../stubs'), 'foobar.mix')))
  t.is(setup.consoleStub.log.thirdCall.args[0], 'a cached version of the template [foobar] is found.')
})

test(`'mix init foobar -d stubs': warn if there is error downloading 'foobar' template and there is no cache`, t => {
  // arrange
  let processExitFunc = setup.sinonSandbox.stub(process,'exit')
  setup.command(`mix init foobar -d stubs`)

  // act
  setup.downloadGitRepoSpy.firstCall.args[2](true) // the true argument indicates error

  // assert
  t.true(processExitFunc.called)
})

test(`'mix init foobar -d stubs' prompt for conflicts in exists working directory`, t => {
  setup.mockPromptly()

  // arrange
  fs.ensureFileSync(path.join(path.resolve(__dirname + '/../stubs/'), 'foobar.mix'), err => { if (err) throw err })

  setup.command(`mix init foobar -d stubs`)
  fs.ensureFileSync(path.join(path.resolve(__dirname + '/../templates/temp/foobar'), 'foobar.mix'), err => { if (err) throw err })

  // act
  setup.downloadGitRepoSpy.firstCall.args[2]()

  t.true(setup.promptlyStub.then.called)
})

test(`'mix init foobar -d stubs' prompt for conflicts in exists working directory: prcoeed copying`, t => {
  setup.mockPromptly()

  // arrange
  fs.ensureFileSync(path.join(path.resolve(__dirname + '/../stubs/'), 'foobar.mix'), err => { if (err) throw err })

  setup.command(`mix init foobar -d stubs`)
  fs.ensureFileSync(path.join(path.resolve(__dirname + '/../templates/temp/foobar'), 'foobar.mix'), err => { if (err) throw err })
  fs.ensureFileSync(path.join(path.resolve(__dirname + '/../templates/temp/foobar'), 'anotherFile.mix'), err => { if (err) throw err })

  // act
  setup.downloadGitRepoSpy.firstCall.args[2]()

  setup.promptlyStub.then.firstCall.args[0]('Y')

  t.true(fs.existsSync(path.join(path.resolve(__dirname + '/../stubs'), 'foobar.mix')))
  t.true(fs.existsSync(path.join(path.resolve(__dirname + '/../stubs'), 'anotherFile.mix')))
})

test(`'mix init foobar -d stubs' prompt for conflicts in exists working directory: don't copy`, t => {
  setup.mockPromptly()

  let processExitFunc = setup.sinonSandbox.stub(process,'exit')
  // arrange
  fs.ensureFileSync(path.join(path.resolve(__dirname + '/../stubs/'), 'foobar.mix'), err => { if (err) throw err })

  setup.command(`mix init foobar -d stubs`)
  fs.ensureFileSync(path.join(path.resolve(__dirname + '/../templates/temp/foobar'), 'foobar.mix'), err => { if (err) throw err })
  fs.ensureFileSync(path.join(path.resolve(__dirname + '/../templates/temp/foobar'), 'anotherFile.mix'), err => { if (err) throw err })

  // act
  setup.downloadGitRepoSpy.firstCall.args[2]()

  setup.promptlyStub.then.firstCall.args[0]('N')

  t.false(fs.existsSync(path.join(path.resolve(__dirname + '/../stubs'), 'anotherFile.mix')))
  t.true(processExitFunc.called)
})
