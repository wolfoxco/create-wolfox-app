const rm = require('rimraf').sync
const fs = require('fs-extra')

const createFolder = (folderName, force) => {
  try {
    if (force) {
      rm(folderName)
    }
  } catch (error) {
    // Nothing's happening here, and that's completely what we want.
  }
  return fs.mkdirSync(folderName)
}

const copyFolder = directoryName => templateDirectory => {
  return fs.copySync(`${templateDirectory}/${directoryName}`, directoryName)
}

const initStaticFile = fileName => filePath => {
  const staticFile = fs.readFileSync(`${filePath}/${fileName}`, 'utf8')
  return fs.writeFileSync(`${process.cwd()}/${fileName}`, staticFile)
}

const inFolder = (folderName, execution) => {
  process.chdir(folderName)
  const res = execution()
  process.chdir('../')
  return res
}

module.exports = {
  createFolder,
  copyFolder,
  initStaticFile,
  inFolder
}
