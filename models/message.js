'use strict'

module.exports = function (sequelize, DataTypes) {
  const Message = sequelize.define('message', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    message_number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    chat_number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    application_token: {
      type: DataTypes.UUID,
      allowNull: false
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    paranoid: true,
    indexes: [{
      fields: ['application_token', 'chat_number']
    }],
  })

  return Message
}
