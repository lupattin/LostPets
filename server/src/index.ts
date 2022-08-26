import { sendMail } from "../lib/sendgrid";
import * as cors from "cors";
import { createUser } from "../controllers/user-controller";
import { signUp } from "../controllers/user-controller";
import { updateAuth } from "../controllers/auth-controller";
import { authMiddleware } from "../controllers/auth-controller";
import { createPet } from "../controllers/pet-controller";
import { updatePet } from "../controllers/pet-controller";
import { petsByDirection } from "../controllers/pet-controller";
import { petsByUser } from "../controllers/pet-controller";
import { userById } from "../controllers/user-controller";
import { eliminateOnePet } from "../controllers/pet-controller";
const express = require("express");

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(express.static("dist"));


/* Sign Up */
app.post("/auth", async (req, res) => {
  const { email, name, password } = req.body;

  const result = await createUser(email, name, password);

  res.json(result);
});
/* Sign In */
app.post("/auth/token", async (req, res) => {
  const { email, password } = req.body;

  const result = await signUp(email, password);

  res.json(result);
});
/* Update Data */

app.patch("/user", authMiddleware, async (req, res) => {
  const { name, email, emailToSearch, newpassword } = req.body;

  const result = await updateAuth(name, email, emailToSearch, newpassword);

  res.json(result);
});
/* New Pet */
app.post("/pet", authMiddleware, async (req, res) => {
  const { name, street, level, city, _geoloc, userId, image } = req.body;

  const result = await createPet(
    name,
    street,
    level,
    city,
    _geoloc,
    userId,
    image
  );

  if (result == "ok") {
    res.status(200).json({ resp: "ok" });
  } else {
    res.status(200).json({ resp: "error" });
  }
});
/* Update de una mascota */
app.patch("/pet", authMiddleware, async (req, res) => {
  const { id, name, street, level, city, _geoloc, userId, image } = req.body;

  const result = await updatePet(
    id,
    name,
    street,
    level,
    city,
    _geoloc,
    userId,
    image
  );
  if (result == "ok") {
    res.status(200).json({ resp: "ok" });
  } else {
    res.status(200).json({ resp: "error" });
  }
});
/* Eliminate one pet */
app.delete("/pet", authMiddleware,async (req, res) => {
  const petId = req.body.id
  console.log(petId);
  
  const result = await eliminateOnePet(petId)
  if (result == "ok") {
    res.status(200).json({ resp: "ok" });
  } else {
    res.status(200).json({ resp: result });
  }
})
/* search pets in a direction */
app.get("/pets-near-direction", async (req, res) => {
  const { lat, lng } = req.query;
  const results = await petsByDirection(lat, lng)
  res.status(200).send(results); 
});
/* search pets by user */
app.get("/pets-by-user", async (req, res) => {
  const userId = req.query.userId;
  const result = await petsByUser(userId) 
  res.status(200).send(result);
});
/* get user email */
app.get("/user-by-id", async (req, res) => {
  const userId = req.query.userId;
  const result = await userById(userId)
  res.status(200).send(result);
});
/* Send mail for the found pet to the owner */
app.post("/report-pet", authMiddleware, async (req, res) => {
  const { to, petname, username, phone, where } = req.body;
  const send = await sendMail(to, petname, username, phone, where);
  res.json({ resp: send });
});
/* Ruta para heroku para SPA*/

app.get("*", (req, res) => {
  res.send(__dirname + "/dist/index.html");
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
