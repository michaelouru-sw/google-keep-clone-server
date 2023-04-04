const express = require("express");
const session = require("express-session");
const routes = require("./routes");
const passport = require("passport");
const User = require("./models/User");
const LocalStrategy = require("passport-local");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const sessionSecret = process.env.SESSION_SECRET;
const DB_STRING = process.env.DB_STRING;
const cors = require("cors");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

// Connect to MongoDB database
mongoose.connect(DB_STRING);

// Set up Middleware
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport Local Strategy
passport.use(new LocalStrategy(User.authenticate()));
passport.use(User.createStrategy());

// Serialize and deserialize user
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(routes);

// Start the server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
