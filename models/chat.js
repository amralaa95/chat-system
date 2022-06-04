'use strict'

module.exports = function (sequelize, DataTypes) {
  const Chat = sequelize.define('chat', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    messages_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    }
  }, {
    paranoid: true
  })
  Chat.associate = function (models) {
    models.Chat.hasMany(models.Message)
  }
  return Chat
}
