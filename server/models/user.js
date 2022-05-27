"use strict";
exports.__esModule = true;
exports.User = void 0;
var sequelize_1 = require("sequelize");
var index_1 = require("../db/index");
exports.User = index_1.sequelize.define("user", {
    name: sequelize_1.DataTypes.STRING,
    email: sequelize_1.DataTypes.STRING
});
/* export class User extends Model {}

User.init(
  {
    name:  DataTypes.STRING,
    email: DataTypes.STRING
    
  }, {
    sequelize,
    modelName: 'user'
  }); */ 
