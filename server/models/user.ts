import {Model, DataTypes} from "sequelize"
import {sequelize} from "../db/index"

export interface AuthData{
  name:string,
  email: string
}

export const User = sequelize.define("user",{
  name:  DataTypes.STRING,
  email: DataTypes.STRING
})
/* export class User extends Model {}

User.init(
  {
    name:  DataTypes.STRING,
    email: DataTypes.STRING
    
  }, {
    sequelize, 
    modelName: 'user' 
  }); */