module.exports.backend = {
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

module.exports.frontend = {
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
