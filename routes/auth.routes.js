const express = require("express");
const router = express.Router();

const passport = require("passport");
const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");

const SALT_ROUNDS = 10;

const User = require("../models/User.model");

router.post("/signup", (req, res, next) => {
  const { name, email, password, phone, business, address } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: "Provide name, email and password" });
    return;
  }

  // make sure passwords are strong:
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(400).json({
      errorMessage:
        "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  bcryptjs
    .genSalt(SALT_ROUNDS)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      console.log("INSIDE BCRYPT");
      return User.create({
        username: name,
        email,
        password: hashedPassword,
        phone,
        business,
        address,
      });
    })
    .then((userFromDB) => {
      console.log("Newly created user is: ", userFromDB);
      res.json(userFromDB);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(400).json({ errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(400).json({
          errorMessage: "Email needs to be unique.",
        });
      } else {
        next(error);
      }
    });
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, theUser, failureDetails) => {
    if (err) {
      res.status(500).json({ message: "Something went wrong authenticating user" });
      return;
    }

    if (!theUser) {
      res.status(401).json(failureDetails);
      return;
    }

    req.login(theUser, (err) => {
      if (err) {
        res.status(500).json({ message: "Session save went bad." });
        return;
      }
      res.json(theUser);
    });
  })(req, res, next);
});

router.post("/logout", (req, res, next) => {
  req.logout(); // req.logout() is defined by passport
  res.status(200).json({ message: "Log out success!" });
});

router.get("/loggedin", (req, res, next) => {
  // req.isAuthenticated() is defined by passport
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }
  res.status(403).json({ message: "Unauthorized" });
});

module.exports = router;
