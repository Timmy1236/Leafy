const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  storage: 'db/database.sqlite',
  logging: false,
});

module.exports = sequelize;