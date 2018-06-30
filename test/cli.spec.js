import test from 'ava'
import setup from './setup'
const mock = require('mock-require')

setup.spyMixInitiliazer()

test.beforeEach(setup.commonBeforeEach)

test.afterEach(setup.commonAfterEach)

test(`'mix init' only uses the default template, without installation, for current directory`, t => {
  setup.command('mix init')
  t.deepEqual(setup.mixInitializerSpy.firstCall.args[0], {
    template: 'default',
    installDependencies: false,
    destination: './'
  })
})

test(`'mix init -d tmp': default template, without installation, 'tmp' directory`, t => {
  setup.command('mix init -d tmp')
  t.deepEqual(setup.mixInitializerSpy.firstCall.args[0], {
    template: 'default',
    installDependencies: false,
    destination: 'tmp'
  })
})

test(`'mix init -i': default template, with installation, for current directory`, t => {
  setup.command('mix init -i')
  t.deepEqual(setup.mixInitializerSpy.firstCall.args[0], {
    template: 'default',
    installDependencies: true,
    destination: './'
  })
})

test(`'mix init foo -i': foo template, with installation, for current directory`, t => {
  setup.command('mix init foo -i')
  t.deepEqual(setup.mixInitializerSpy.firstCall.args[0], {
    template: 'foo',
    installDependencies: true,
    destination: './'
  })
})

test(`'mix init bar -d foo': bar template, without installation, 'foo' directory`, t => {
  setup.command('mix init bar -d foo')
  t.deepEqual(setup.mixInitializerSpy.firstCall.args[0], {
    template: 'bar',
    installDependencies: false,
    destination: 'foo'
  })
})

test(`'mix init foobar -d baz -i': foobar template, with installation, 'baz' directory`, t => {
  setup.command('mix init foobar -d baz -i')
  t.deepEqual(setup.mixInitializerSpy.firstCall.args[0], {
    template: 'foobar',
    installDependencies: true,
    destination: 'baz'
  })
})
