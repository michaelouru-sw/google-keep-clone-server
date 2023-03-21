const router = require("express").Router();
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/User");
const Note = require("../models/Note");

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/*
 *  - - - - - - --  - - - - - - --
 *  - - - - GET Requests - - - - -
 *  - - - - - - - - - - - - - - --
 */
router.get("/api/notes", (req, res) => {
  const username = req.body.username;
  const foundUser = User.findOne({ username: username });

  Note.find({ user: foundUser._id })
    .then((notes) => res.json({ success: true, message: "Success", notes }))
    .catch((err) => res.json({ success: false, message: err }));
});

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
router.post("/api/newnote", (req, res) => {
  const email = req.body.username;
  const title = req.body.title;
  const body = req.body.body;
  console.log(email);

  async function saveNote() {
    const foundUser = await User.findOne({ username: email });
    console.log(foundUser);
    const newNote = new Note({
      title: title,
      body: body,
      user: foundUser._id,
    });
    await newNote
      .save()
      .then((note) =>
        res.json({ success: true, message: "Successfully saved note" })
      )
      .catch((err) => {
        res.json({ success: false, message: err });
      });
    mongoose.connection.close();
  }
  saveNote();
});
/*
 *  - - - - - - --  - - - - - - --
 *  - - - - DELETE Requests - - - - -
 *  - - - - - - - - - - - - - - --
 */
router.delete("/api/note");

/*
 *  - - - - - - --  - - - - - - --
 *  - - - - PATCH Requests - - - - -
 *  - - - - - - - - - - - - - - --
 */
router.patch("/api/submit-note", (req, res) => {});

module.exports = router;
