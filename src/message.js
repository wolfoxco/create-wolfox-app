const chalk = require('chalk')

const info = content => console.log(chalk.green(content))
const congrats = content => console.log(chalk.bold.blue(content))
const warning = content => console.log(chalk.yellow(content))
const error = content => console.log(chalk.bold.red(content))

module.exports = {
  info,
  congrats,
  error,
  warning
}
