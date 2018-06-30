import path from 'path'
import test from 'ava'
import setup from './setup'
import MixInitializer from '../src/MixInitializer'

setup.mockConsole()

test.beforeEach(setup.commonBeforeEach)
test.afterEach(setup.commonAfterEach)

test(`'default' template: download from laravel-mix-templates organization `, t => {
  new MixInitializer({
    destination: setup.stubsDir,
    template: 'default',
    installDependencies: false
  })

  t.is(setup.downloadGitRepoSpy.firstCall.args[0], 'laravel-mix-templates/default')
})

test(`'foobar' template: download from laravel-mix-templates organization `, t => {
  new MixInitializer({
    destination: setup.stubsDir,
    template: 'foobar',
    installDependencies: false
  })

  t.is(setup.downloadGitRepoSpy.firstCall.args[0], 'laravel-mix-templates/foobar')
})

test(`always use relative temporary path for downloading git repos`, t => {
  new MixInitializer({
    destination: setup.stubsDir,
    template: 'foobar',
    installDependencies: false
  })

  t.is(path.resolve(setup.downloadGitRepoSpy.firstCall.args[1]), path.join(__dirname, './../templates/temp/foobar'))
})
