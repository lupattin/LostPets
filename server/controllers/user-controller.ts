import { User, Auth } from "../models/models";
import * as jwt from "jsonwebtoken";
import * as crypto from "crypto";

const SECRET = "asdasdasd123123";

export var getSHA256ofString = function (text) {
    return crypto.createHash("sha256").update(text).digest("hex");
  };

export async function createUser(email, name, password ) {
    const [user, created] = await User.findOrCreate({
        where: { email },
        defaults: {
          email,
          name,
        },
      });
      
      const [auth, authCreated] = await Auth.findOrCreate({
        where: { user_id: user.get("id") },
        defaults: {
          name,
          email,
          password: getSHA256ofString(password),
          user_id: user.get("id"),
        },
      });

    return {user, created, auth, authCreated}
}

export async function signUp(email, password) {
    const user = await Auth.findOne({
      where: { email, password: getSHA256ofString(password) },
    });
  
    if (user) {
      const token = jwt.sign({ id: user.get("id") }, SECRET);
      return { token, user };
    } else {
       return { Error: "Email o Password incorrect" };
    }
  }

export async function userById(userId) {
  const user = await User.findOne({
    where: { id: userId },
  });
  return user
}