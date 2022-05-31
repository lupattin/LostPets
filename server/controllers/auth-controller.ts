import { Auth } from "../models/models";
import { getSHA256ofString } from "./user-controller";
import * as jwt from "jsonwebtoken";

const SECRET = "asdasdasd123123";

export async function updateAuth(name, email, emailToSearch, newpassword) {
  console.log(name, email, emailToSearch, newpassword);
  
  const user = await Auth.update(
    {
      name,
      email,
      password: getSHA256ofString(newpassword),
    },
    {
      where: {
        email: emailToSearch,
      },
      returning: true,
    }
  );
  return user
}

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization.split(`"`)[1];

  try {
    const data = jwt.verify(token, SECRET);
    req._user = data;
    next();
  } catch (error) {
    res.status(401).send("token invalid");
  }
}