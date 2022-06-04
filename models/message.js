'use strict'

module.exports = function (sequelize, DataTypes) {
  const Message = sequelize.define('message', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    text: {
      type: DataTypes.STRING(300),
      allowNull: false
    }
  }, {
    paranoid: true
  })
  Message.associate = function (models) {
    // associations can be defined here
  }
  return Message
}
