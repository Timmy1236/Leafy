const Sequelize = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  xp: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  level: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  commandsCount: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
});

module.exports = User;