import {Model, DataTypes} from "sequelize"
import {sequelize} from "../db/index"

export interface AuthData{
  name:string,
  email: string,
  password:string,
  user_id:number
}

export const Auth = sequelize.define("Auth",{
    name: DataTypes.STRING,
    email:  DataTypes.STRING,
    password: DataTypes.STRING,
    user_id: DataTypes.INTEGER
})

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