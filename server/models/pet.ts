import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db/index";

export interface PetData {
  name: string;
  street: string;
  level: number;
  city: string;
  lng: string;
  lat: string;
  image: string;
}

export const Pet = sequelize.define("Pet", {
  name: DataTypes.STRING,
  street: DataTypes.STRING,
  level: DataTypes.INTEGER,
  city: DataTypes.STRING,
  lng: DataTypes.STRING,
  lat: DataTypes.STRING,
  image: DataTypes.STRING,
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
