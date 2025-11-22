const Sequelize = require('sequelize');
const sequelize = require('../database');

const Server = sequelize.define('server', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  welcomeChannel: {
    type: Sequelize.STRING,
    allowNull: true
  }
});

module.exports = Server;