"use strict";
exports.__esModule = true;
exports.Pet = void 0;
var sequelize_1 = require("sequelize");
var index_1 = require("../db/index");
exports.Pet = index_1.sequelize.define("Pet", {
    name: sequelize_1.DataTypes.STRING,
    street: sequelize_1.DataTypes.STRING,
    level: sequelize_1.DataTypes.INTEGER,
    city: sequelize_1.DataTypes.STRING,
    lng: sequelize_1.DataTypes.STRING,
    lat: sequelize_1.DataTypes.STRING,
    image: sequelize_1.DataTypes.STRING
});
/* export class Pet extends Model {}

Pet.init(
  {
    name:  DataTypes.STRING,
    street: DataTypes.STRING,
    level: DataTypes.INTEGER,
    city: DataTypes.STRING,
    lng: DataTypes.STRING,
    lat: DataTypes.STRING,
    image: DataTypes.STRING
    
  }, {
    sequelize,
    modelName: 'Pet'
  }); */
