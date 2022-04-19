const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

function isLoggedOut(req, res, next) {
  if (!req.isAuthenticated()) return next();
  res.redirect("/");
}

router.get("/", isLoggedIn, (req, res) => {
  res.render("index", { title: "Home" });
});

router.get("/login", isLoggedOut, (req, res) => {
  res.render("login", { title: "Login" });
});

router.get("/setup", async (req, res) => {
  const exist = await User.findOne({ username: "admin" });

  if (exist) {
    res.redirect("/login");
    return;
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash("pass", salt, (err, hash) => {
      if (err) return next(err);

      const newAdmin = new User({
        username: "admin",
        password: hash,
      });

      newAdmin.save();

      res.redirect("login");
    });
  });
});

module.exports = router;
