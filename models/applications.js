'use strict'

module.exports = function (sequelize, DataTypes) {
  const Application = sequelize.define('application', {
    token: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(24),
      allowNull: false,
      unique: true
    },
    chats_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    }
  }, {
    paranoid: true
  })
  Application.associate = function (models) {
    models.Application.hasMany(models.Chat) // foreign key for application on chat model
  }
  return Application
}
