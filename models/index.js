const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')

const logger = require('../lib/logger')

const basename = path.basename(module.filename)
const NODE_ENV = process.env.NODE_ENV || 'development'

const baseConfig = {
  logging: (m) => logger.debug(m)
}

const envConfig = require(path.join(__dirname, '/../config/config.js'))[NODE_ENV]
const config = { ...baseConfig, ...envConfig }

const db = {}
let sequelize = null

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
  sequelize = new Sequelize(config.database, config.username, config.password,
    config)
}

fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .forEach(function (file) {
    const model = sequelize.import(path.join(__dirname, file))
    const camelCaseName = model.name[0].toUpperCase() + model.name.substr(1)
    db[camelCaseName] = model
  })

Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
