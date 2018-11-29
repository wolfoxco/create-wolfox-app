#!/usr/bin/env node

const program = require('commander')
const fs = require('fs-extra')
const path = require('path')
const execSync = require('child_process').execSync
const rm = require('rimraf').sync
const exec = command => execSync(command, { stdio: 'inherit' })

const waitParsing = () => new Promise(resolve => {
  program
    .arguments('<name>')
    .usage('<name> [options]')
    .option('-b, --backend-only', 'Build only backend project')
    .option('-f, --frontend-only', 'Build only frontend project')
    .option('--overwrite', 'Overwrite any existing folder')
    .action((name, options) => {
      resolve({ name, options })
    })
  program.parse(process.argv)
})

const solver = ({ name, options }) => {
  if (options.backendOnly && options.frontendOnly) {
    program.help()
  }
  if (!options.backendOnly) {
    createBackendFolder(name, options)
  }
  if (!options.frontendOnly) {
    createFrontendFolder(name, options)
  }
}

const backendPackages = {
  main: [
    "@frenchpastries/arrange",
    "@frenchpastries/assemble",
    "@frenchpastries/millefeuille",
    "dotenv",
    "pg"
  ],
  dev: [
    "eslint",
    "nodemon"
  ]
}

const frontendPackages = {
  main: [
    "hyperapp",
    "hyperapp-style"
  ],
  dev: [
    "@babel/core",
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-transform-react-jsx",
    "@babel/preset-env",
    "babel-eslint",
    "babel-loader",
    "clean-webpack-plugin",
    "eslint",
    "eslint-plugin-react",
    "file-loader",
    "html-webpack-plugin",
    "hyperapp-redux-devtools",
    "webpack",
    "webpack-cli",
    "webpack-dev-server",
    "webpack-merge"
  ]
}

const createFolder = (folderName, overwrite) => {
  try { if (overwrite) { rm(folderName) } } catch (error) {} // eslint-disable-line
  return fs.mkdirSync(folderName)
}

const copyFolder = (templateDirectory, directoryName) => {
  fs.copySync(`${templateDirectory}/${directoryName}`, directoryName)
}

const initSrc = templateDirectory => copyFolder(templateDirectory, 'src')
const initConfig = templateDirectory => copyFolder(templateDirectory, 'config')
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

const inFolder = (folderName, execution) => {
  process.chdir(folderName)
  const res = execution()
  process.chdir('../')
  return res
}

const initStaticFile = (filePath, fileName) => {
  const staticFile = fs.readFileSync(`${filePath}/${fileName}`, 'utf8')
  return fs.writeFileSync(`${process.cwd()}/${fileName}`, staticFile)
}

const initEslint = filePath => initStaticFile(filePath, '.eslintrc.json')

const createBackendFolder = (name, options) => {
  const folderName = `${name}-back`
  const templateDirectory = path.resolve(__dirname, '..', 'templates', 'backend')

  createFolder(folderName, options.overwrite)
  inFolder(folderName, () => {
    initSrc(templateDirectory)
    initGit()
    initPackageJSON(backendPackages, templateDirectory)
    initEslint(templateDirectory)
  })
}

const initBabel = filePath => initStaticFile(filePath, '.babelrc')

const createFrontendFolder = (name, options) => {
  const folderName = `${name}-front`
  const templateDirectory = path.resolve(__dirname, '..', 'templates', 'frontend')

  createFolder(folderName, options.overwrite)
  inFolder(folderName, () => {
    initSrc(templateDirectory)
    initConfig(templateDirectory)
    initGit()
    initPackageJSON(frontendPackages, templateDirectory)
    initEslint(templateDirectory)
    initBabel(templateDirectory)
  })
}

waitParsing()
  .then(solver)
  .catch(console.error)
