const router = require("express").Router();
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/User");

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/*
 *  - - - - - - --  - - - - - - --
 *  - - - - GET Requests - - - - -
 *  - - - - - - - - - - - - - - --
 */
router.get("/");

/*
 *  - - - - - - --  - - - - - - --
 *  - - - - POST Requests - - - - -
 *  - - - - - - - - - - - - - - --
 */
router.post("/api/login", passport.authenticate("local"), (req, res) => {
  res.json({
    success: true,
    message: "You have been successfully logged in",
  });
});

router.post("/api/register", function (req, res) {
  User.register(
    new User({ email: req.body.email, username: req.body.username }),
    req.body.password,
    function (err, user) {
      if (err) {
        res.json({
          success: false,
          message: "Your account could not be saved. Error: " + err,
        });
      } else {
        req.login(user, (er) => {
          if (er) {
            res.json({ success: false, message: er });
          } else {
            res.json({
              success: true,
              message: "Your account has been saved",
              user,
            });
          }
        });
      }
    }
  );
});

/*
 *  - - - - - - --  - - - - - - --
 *  - - - - DELETE Requests - - - - -
 *  - - - - - - - - - - - - - - --
 */
router.delete("/");

/*
 *  - - - - - - --  - - - - - - --
 *  - - - - PATCH Requests - - - - -
 *  - - - - - - - - - - - - - - --
 */
router.patch("/");

module.exports = router;
