#!/usr/bin/env node

const program = require('commander')
const fs = require('fs-extra')
const path = require('path')
const execSync = require('child_process').execSync
const chalk = require('chalk')
const readlineSync = require('readline-sync')

const packages = require('./packages')
const utils = require('./utils')

const exec = command => execSync(command, { stdio: 'inherit' })

const waitParsing = () => new Promise(resolve => {
  program
    .arguments('<name>')
    .usage('<name> [options]')
    .option('-b, --backend-only', 'Build only backend project')
    .option('-f, --frontend-only', 'Build only frontend project')
    .option('--overwrite', 'Overwrite any existing folder')
    .action((name, options) => resolve({ name, options }))
  program.parse(process.argv)
})

const overwriteQuestion = name => `
You're about to overwrite your folders
${name}-back and ${name}-front if they exists.
Are you sure you want to do it? [yN] `.replace(/\n/g, '')

const askQuestion = name => {
  const redText = chalk.bold.red(overwriteQuestion(name))
  return readlineSync.question(redText, {
    limit: [ 'y', 'n' ],
    defaultInput: 'n'
  })
}

const createProjects = (name, options) => {
  if (!options.backendOnly) {
    createBackendProject(name, options)
  }
  if (!options.frontendOnly) {
    createFrontendProject(name, options)
  }
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

  const goOn = utils.createFolder(folderName, options.overwrite)
  if (goOn) {
    utils.inFolder(folderName, () => {
      initSrc(templateDirectory)
      initGit()
      initPackageJSON(packages.backend, templateDirectory)
      initEslint(templateDirectory)
    })
  } else {
    console.log(chalk.red(`Folder ${folderName}  already exists. Skipping generation.`))
  }
}

const createFrontendProject = (name, options) => {
  const folderName = `${name}-front`
  const templateDirectory = path.resolve(__dirname, '..', 'templates', 'frontend')

  const goOn = utils.createFolder(folderName, options.overwrite)
  if (goOn) {
    utils.inFolder(folderName, () => {
      initSrc(templateDirectory)
      initConfig(templateDirectory)
      initGit()
      initPackageJSON(packages.frontend, templateDirectory)
      initEslint(templateDirectory)
      initBabel(templateDirectory)
    })
  } else {
    console.log(chalk.red(`Folder ${folderName} already exists. Skipping generation.`))
  }
}

waitParsing()
  .then(resolveAction)
  .catch(() => {})
