const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {});

User.prototype.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = User;

sequelize.sync();
