module.exports = {
  init: 'laravel-mix-cli v' + require('../package').version,
  startCopying: 'Initializing laravel-mix project',
  conflictConfirmation: 'The files: %s already exists in the destination folder, do you want to override it? [y/n]',
  success: 'Mix project initiated successfully',
  createDirectoryError: 'Error in creating directory: [%s]',
  commandRunning: 'Running "%s"',
  downloadTemplateError: 'Error downloading the template at: [laravel-mix-templates/%s], checking if there is a cached version..',
  cacheIsFound: 'a cached version of the template [%s] is found.',
  successTemplateDownload: 'Template  [laravel-mix-templates/${this.templateName}] downloaded successfully',
  templateNotFound: 'Couldn\'t find the template [%s]',
  exit: 'Exiting..'
}
