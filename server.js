const express = require("express");
const session = require("express-session");
const hbs = require("express-handlebars");
const mangoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("./models/User");
const bodyparser = require("body-parser");
const cors = require("cors");

const mongoUrl = require("./config").mongoURI;
const app = express();

// CORS Middleware
app.use(cors());
//Body parser middleware
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

const routes = require("./routes/routes");

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// middleware
app.engine("hbs", hbs.engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.use(express.static(__dirname + "/public"));
app.use(
  session({
    secret: "verygoodsceret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// passport.js
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user, id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  new localStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false, { message: "Incorrect username" });

      bcrypt.compare(password, user.password, (err, user) => {
        if (err) return done(err);
        if (res === false)
          return done(null, false, { message: "Incorrect password" });

        return done(null, user);
      });
    });
  })
);

app.use("/", routes);

app.listen(4000, () => {
  console.log("port running 4000");
});
