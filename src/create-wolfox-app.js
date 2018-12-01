#!/usr/bin/env node

const program = require('commander')
const fs = require('fs-extra')
const path = require('path')
const execSync = require('child_process').execSync
const chalk = require('chalk')
const readlineSync = require('readline-sync')

const packages = require('./packages')
const utils = require('./utils')
const message = require('./message')

const execVerbose = verbose => command => execSync(command, { stdio: verbose ? 'inherit' : 'ignore' })

let exec = execVerbose(false)

const waitParsing = () => new Promise(resolve => {
  program
    .arguments('<name>')
    .usage('<name> [options]')
    .option('-b, --backend-only', 'Build only backend project')
    .option('-f, --frontend-only', 'Build only frontend project')
    .option('--overwrite', 'Overwrite any existing folder')
    .option('-v, --verbose', 'Make program verbose')
    .action((name, options) => resolve({ name, options }))
  program.parse(process.argv)
})

const overwriteQuestion = name => `You're about to overwrite your folders ${name}-back and ${name}-front if they exists. Are you sure you want to do it? [yN] `

const askQuestion = name => {
  const redText = chalk.bold.red(overwriteQuestion(name))
  return readlineSync.question(redText, {
    limit: [ 'y', 'n' ],
    defaultInput: 'n'
  })
}

const createProjects = (name, options) => {
  if (options.verbose) {
    exec = execVerbose(true)
  }
  if (!options.backendOnly) {
    createBackendProject(name, options)
  }
  if (!options.frontendOnly) {
    createFrontendProject(name, options)
  }
  message.congrats('Projects initialized! Start right now!')
}

const resolveAction = ({ name, options }) => {
  if (options.backendOnly && options.frontendOnly) {
    program.help()
  }
  if (options.overwrite) {
    const answer = askQuestion(name)
    if (answer === 'n' || answer === 'N') {
      process.exit()
    }
  }
  createProjects(name, options)
}

const initEslint = utils.initStaticFile('.eslintrc.json')
const initBabel  = utils.initStaticFile('.babelrc')
const initSrc    = utils.copyFolder('src')
const initConfig = utils.copyFolder('config')
const initGit = () => exec('git init')

const fixPackageJSON = templateDirectory => {
  const packageJSONPath = path.resolve('.', 'package.json')
  const packageJSONCreated = JSON.parse(fs.readFileSync(packageJSONPath, 'utf8'))
  const packageJSONTemplate = JSON.parse(fs.readFileSync(`${templateDirectory}/package.json`, 'utf8'))
  const finalPackage = {
    name: packageJSONCreated.name,
    version: packageJSONCreated.version,
    author: packageJSONCreated.author,
    private: true,
    scripts: packageJSONTemplate.scripts,
    dependencies: packageJSONCreated.dependencies,
    devDependencies: packageJSONCreated.devDependencies
  }
  fs.writeFileSync(packageJSONPath, JSON.stringify(finalPackage, null, 2))
}

const initPackageJSON = (packages, templateDirectory) => {
  exec('yarn init --yes')
  exec(`yarn add ${packages.main.join(' ')}`)
  exec(`yarn add --dev ${packages.dev.join(' ')}`)
  fixPackageJSON(templateDirectory)
}

const createBackendProject = (name, options) => {
  const folderName = `${name}-back`
  const templateDirectory = path.resolve(__dirname, '..', 'templates', 'backend')

  message.info(`Generating backend ${folderName} project. This can take a while depending on your internet connection.`)

  const goOn = utils.createFolder(folderName, options.overwrite)
  if (goOn) {
    message.info(`Folder ${folderName} has been created. Populating it.`)
    utils.inFolder(folderName, () => {
      message.info('Source folder initialization...')
      initSrc(templateDirectory)
      message.info(`Source folder initialized.`)
      message.info('Git initialization...')
      initGit()
      message.info(`Git initialized.`)
      message.info('package.json initialization...')
      initPackageJSON(packages.backend, templateDirectory)
      message.info(`package.json initialized.`)
      message.info('Eslint initialization...')
      initEslint(templateDirectory)
      message.info(`Eslint initialized.`)
    })
  } else {
    message.warning(`Folder ${folderName}  already exists. Skipping generation.`)
  }
}

const createFrontendProject = (name, options) => {
  const folderName = `${name}-front`
  const templateDirectory = path.resolve(__dirname, '..', 'templates', 'frontend')

  message.info(`Generating frontend ${folderName} project. This can take a while depending on your internet connection.`)

  const goOn = utils.createFolder(folderName, options.overwrite)
  if (goOn) {
    message.info(`Folder ${folderName} has been created. Populating it.`)
    utils.inFolder(folderName, () => {
      message.info('Source folder initialization...')
      initSrc(templateDirectory)
      message.info(`Source folder initialized.`)
      message.info('Webpack initialization...')
      initConfig(templateDirectory)
      message.info(`Webpack initialized.`)
      message.info('Git initialization...')
      initGit()
      message.info(`Git initialized.`)
      message.info('package.json initialization...')
      initPackageJSON(packages.frontend, templateDirectory)
      message.info(`package.json initialized.`)
      message.info('Eslint initialization...')
      initEslint(templateDirectory)
      message.info(`Eslint initialized.`)
      message.info('Babel and Hyperapp initialization...')
      initBabel(templateDirectory)
      message.info(`Babel and Hyperapp initialized.`)
    })
  } else {
    message.warning(`Folder ${folderName} already exists. Skipping generation.`)
  }
}

waitParsing()
  .then(resolveAction)
  .catch(() => {})
