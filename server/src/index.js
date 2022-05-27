"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var models_1 = require("../models/models");
var cors = require("cors");
var sendgrid_1 = require("../lib/sendgrid");
var crypto = require("crypto");
var jwt = require("jsonwebtoken");
var algolia_1 = require("../lib/algolia");
var claudinary_1 = require("../lib/claudinary");
var express = require("express");
var app = express();
app.use(cors());
var port = process.env.PORT || 3000;
app.use(express.json({
    limit: "50mb"
}));
app.use(express.static("dist"));
var getSHA256ofString = function (text) {
    return crypto.createHash("sha256").update(text).digest("hex");
};
/* sequelize.sync({ force: true }) */
var SECRET = "asdasdasd123123";
function authMiddleware(req, res, next) {
    var token = req.headers.authorization.split("\"")[1];
    try {
        var data = jwt.verify(token, SECRET);
        req._user = data;
        next();
    }
    catch (error) {
        res.status(401).send("token invalid");
    }
}
/* Sign Up */
app.post("/auth", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, name, _b, user, created, _c, auth, authCreated;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = req.body, email = _a.email, name = _a.name;
                return [4 /*yield*/, models_1.User.findOrCreate({
                        where: { email: req.body.email },
                        defaults: {
                            email: email,
                            name: name
                        }
                    })];
            case 1:
                _b = _d.sent(), user = _b[0], created = _b[1];
                return [4 /*yield*/, models_1.Auth.findOrCreate({
                        where: { user_id: user.get("id") },
                        defaults: {
                            name: name,
                            email: email,
                            password: getSHA256ofString(req.body.password),
                            user_id: user.get("id")
                        }
                    })];
            case 2:
                _c = _d.sent(), auth = _c[0], authCreated = _c[1];
                res.json({
                    user: user,
                    created: created,
                    auth: auth,
                    authCreated: authCreated
                });
                return [2 /*return*/];
        }
    });
}); });
/* Sign In */
app.post("/auth/token", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, models_1.Auth.findOne({
                        where: { email: email, password: getSHA256ofString(password) }
                    })];
            case 1:
                user = _b.sent();
                if (user) {
                    token = jwt.sign({ id: user.get("id") }, SECRET);
                    res.json({ token: token, user: user });
                }
                else {
                    res.status(400).json({ Error: "Email o Password incorrect" });
                }
                return [2 /*return*/];
        }
    });
}); });
/* Update Data */
app.patch("/user", authMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, email, emailToSearch, newpassword, user;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name = _a.name, email = _a.email, emailToSearch = _a.emailToSearch, newpassword = _a.newpassword;
                return [4 /*yield*/, models_1.Auth.update({
                        name: name,
                        email: email,
                        password: getSHA256ofString(newpassword)
                    }, {
                        where: {
                            email: emailToSearch
                        },
                        returning: true
                    })];
            case 1:
                user = _b.sent();
                res.send(user);
                return [2 /*return*/];
        }
    });
}); });
/* New Pet */
app.post("/pet", authMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, street, level, city, _geoloc, userId, image, imagen, pet, algoliaDuplicate;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name = _a.name, street = _a.street, level = _a.level, city = _a.city, _geoloc = _a._geoloc, userId = _a.userId, image = _a.image;
                return [4 /*yield*/, claudinary_1.cloudinary.uploader.upload(image, {
                        resource_type: "image",
                        discard_original_filename: true,
                        width: 1000
                    })];
            case 1:
                imagen = _b.sent();
                return [4 /*yield*/, models_1.Pet.create({
                        name: name,
                        street: street,
                        level: level,
                        city: city,
                        lng: _geoloc.lng,
                        lat: _geoloc.lat,
                        image: imagen.secure_url,
                        userId: userId
                    })];
            case 2:
                pet = _b.sent();
                return [4 /*yield*/, algolia_1.index.saveObject({
                        objectID: pet.get("id"),
                        name: name,
                        street: street,
                        level: level,
                        city: city,
                        _geoloc: _geoloc,
                        userId: userId,
                        image: imagen.secure_url
                    })];
            case 3:
                algoliaDuplicate = _b.sent();
                res.status(200).json({ resp: "ok" });
                return [2 /*return*/];
        }
    });
}); });
/* Update de una mascota */
app.patch("/pet", authMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, name, street, level, city, _geoloc, userId, image, lng, lat, imagen, pet, algoliaDuplicate;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, id = _a.id, name = _a.name, street = _a.street, level = _a.level, city = _a.city, _geoloc = _a._geoloc, userId = _a.userId, image = _a.image;
                lng = parseFloat(_geoloc.lng);
                lat = parseFloat(_geoloc.lat);
                return [4 /*yield*/, claudinary_1.cloudinary.uploader.upload(image, {
                        resource_type: "image",
                        discard_original_filename: true,
                        width: 1000
                    })];
            case 1:
                imagen = _b.sent();
                return [4 /*yield*/, models_1.Pet.update({
                        name: name,
                        street: street,
                        level: level,
                        city: city,
                        lng: _geoloc.lng,
                        lat: _geoloc.lat,
                        image: imagen.secure_url,
                        userId: userId
                    }, {
                        where: {
                            id: id
                        }
                    })];
            case 2:
                pet = _b.sent();
                return [4 /*yield*/, algolia_1.index.partialUpdateObject({
                        objectID: id,
                        name: name,
                        street: street,
                        level: level,
                        city: city,
                        _geoloc: { lng: lng, lat: lat },
                        userId: userId,
                        image: imagen.secure_url
                    })];
            case 3:
                algoliaDuplicate = _b.sent();
                res.status(200).json({ resp: "ok" });
                return [2 /*return*/];
        }
    });
}); });
/* search pets in a direction */
app.get("/pets-near-direction", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, lat, lng, hits;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.query, lat = _a.lat, lng = _a.lng;
                return [4 /*yield*/, algolia_1.index.search("", {
                        aroundLatLng: [lat, lng].join(","),
                        aroundRadius: 10000
                    })];
            case 1:
                hits = (_b.sent()).hits;
                res.status(200).send(hits);
                return [2 /*return*/];
        }
    });
}); });
/* search pets by user */
app.get("/pets-by-user", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, allPets;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.query.userId;
                return [4 /*yield*/, models_1.Pet.findAll({
                        where: { userId: userId }
                    })];
            case 1:
                allPets = _a.sent();
                res.status(200).send(allPets);
                return [2 /*return*/];
        }
    });
}); });
/* get user email */
app.get("/user-by-id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.query.userId;
                return [4 /*yield*/, models_1.User.findOne({
                        where: { id: userId }
                    })];
            case 1:
                user = _a.sent();
                res.status(200).send(user);
                return [2 /*return*/];
        }
    });
}); });
/* Send mail for the found pet to the owner */
app.post("/report-pet", authMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, to, petname, username, phone, where, send;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, to = _a.to, petname = _a.petname, username = _a.username, phone = _a.phone, where = _a.where;
                return [4 /*yield*/, (0, sendgrid_1.sendMail)(to, petname, username, phone, where)];
            case 1:
                send = _b.sent();
                res.json({ resp: send });
                return [2 /*return*/];
        }
    });
}); });
/* Ruta para heroku para SPA*/
app.get("/cosascreadas", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var allProducts;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, models_1.User.findAll()];
            case 1:
                allProducts = _a.sent();
                res.status(200).send(allProducts);
                return [2 /*return*/];
        }
    });
}); });
app.get("*", function (req, res) {
    res.send(__dirname + "/dist/index.html");
});
app.listen(port, function () {
    console.log("Example app listening at http://localhost:".concat(port));
});
