"use strict";
exports.__esModule = true;
exports.Auth = void 0;
var sequelize_1 = require("sequelize");
var index_1 = require("../db/index");
exports.Auth = index_1.sequelize.define("Auth", {
    name: sequelize_1.DataTypes.STRING,
    email: sequelize_1.DataTypes.STRING,
    password: sequelize_1.DataTypes.STRING,
    user_id: sequelize_1.DataTypes.INTEGER
});
/* export class Auth extends Model {}

Auth.init(
  {
    name: DataTypes.STRING,
    email:  DataTypes.STRING,
    password: DataTypes.STRING,
    user_id: DataTypes.INTEGER
    
  }, {
    sequelize,
    modelName: 'Auth'
  }); */ 
