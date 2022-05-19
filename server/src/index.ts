import { User, Auth, Pet } from "../models/models";
import * as cors from "cors";
import { sequelize } from "../db/index";
import { sendMail } from "../lib/sendgrid";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import { index } from "../lib/algolia";
import { cloudinary } from "../lib/claudinary";

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

var getSHA256ofString = function (text) {
  return crypto.createHash("sha256").update(text).digest("hex");
};
/* sequelize.sync({ force: true }) */
const SECRET = "asdasdasd123123";

function authMiddleware(req, res, next) {
  const token = req.headers.authorization.split(`"`)[1];

  try {
    const data = jwt.verify(token, SECRET);
    req._user = data;
    next();
  } catch (error) {
    res.status(401).send("token invalid");
  }
}

/* Sign Up */
app.post("/auth", async (req, res) => {
  const { email, name } = req.body;
  const [user, created] = await User.findOrCreate({
    where: { email: req.body.email },
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
      password: getSHA256ofString(req.body.password),
      user_id: user.get("id"),
    },
  });
  res.json({
    user,
    created,
    auth,
    authCreated,
  });
});
/* Sign In */
app.post("/auth/token", async (req, res) => {
  const { email, password } = req.body;
  const user = await Auth.findOne({
    where: { email, password: getSHA256ofString(password) },
  });

  if (user) {
    const token = jwt.sign({ id: user.get("id") }, SECRET);
    res.json({ token, user });
  } else {
    res.status(400).json({ Error: "Email o Password incorrect" });
  }
});
/* Update Data */

app.patch("/user", authMiddleware, async (req, res) => {
  const { name, email, newpassword } = req.body;
  const user = await Auth.update(
    {
      name,
      email,
      password: getSHA256ofString(newpassword),
    },
    {
      where: {
        email,
      },
      returning: true,
    }
  );
  res.send(user);
});
/* New Pet */
app.post("/pet", authMiddleware, async (req, res) => {
  const { name, street, level, city, _geoloc, userId, image } = req.body;

  const imagen = await cloudinary.uploader.upload(image, {
    resource_type: "image",
    discard_original_filename: true,
    width: 1000,
  });

  const pet = await Pet.create({
    name,
    street,
    level,
    city,
    lng: _geoloc.lng,
    lat: _geoloc.lat,
    image: imagen.secure_url,
    userId,
  });

  const algoliaDuplicate = await index.saveObject({
    objectID: pet.get("id"),
    name,
    street,
    level,
    city,
    _geoloc,
    userId,
    image: imagen.secure_url,
  });
  res.status(200).json({ resp: "ok" });
});
/* Update de una mascota */
app.patch("/pet", authMiddleware, async (req, res) => {
  const { id, name, street, level, city, _geoloc, userId, image } = req.body;

  const lng = parseFloat(_geoloc.lng);
  const lat = parseFloat(_geoloc.lat);

  const imagen = await cloudinary.uploader.upload(image, {
    resource_type: "image",
    discard_original_filename: true,
    width: 1000,
  });

  const pet = await Pet.update(
    {
      name,
      street,
      level,
      city,
      lng: _geoloc.lng,
      lat: _geoloc.lat,
      image: imagen.secure_url,
      userId,
    },
    {
      where: {
        id,
      },
    }
  );

  const algoliaDuplicate = await index.partialUpdateObject({
    objectID: id,
    name,
    street,
    level,
    city,
    _geoloc: { lng: lng, lat: lat },
    userId,
    image: imagen.secure_url,
  });
  res.status(200).json({ resp: "ok" });
});

/* search pets in a direction */
app.get("/pets-near-direction", async (req, res) => {
  const { lat, lng } = req.query;
  const { hits } = await index.search("", {
    aroundLatLng: [lat, lng].join(","),
    aroundRadius: 10000,
  });
  res.status(200).send(hits);
});
/* search pets by user */
app.get("/pets-by-user", async (req, res) => {
  const userId = req.query.userId;
  const allPets = await Pet.findAll({
    where: { userId },
  });
  res.status(200).send(allPets);
});
/* get user email */
app.get("/user-by-id", async (req, res) => {
  const userId = req.query.userId;
  const user = await User.findOne({
    where: { id: userId },
  });
  res.status(200).send(user);
});
/* Send mail for the found pet to the owner */
app.post("/report-pet", authMiddleware, async (req, res) => {
  const { to, petname, username, phone, where } = req.body;
  const send = await sendMail(to, petname, username, phone, where);
  res.json({ resp: "ok" });
});
/* Ruta para heroku para SPA*/
app.get("/cosascreadas", async (req, res) => {
  const allProducts = await User.findAll();
  res.status(200).send(allProducts);
});
app.get("*", (req, res) => {
  res.send(__dirname + "/dist/index.html");
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
