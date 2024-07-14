const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('auth_service', 'user', 'password', {
  host: 'postgres_auth',
  dialect: 'postgres'
});

module.exports = sequelize;
