const router = require("express").Router();
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/User");
const Note = require("../models/Note");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const DB_STRING = process.env.DB_STRING;
const client = new MongoClient(DB_STRING);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/*
 *  - - - - - - --  - - - - - - --
 *  - - - - GET Requests - - - - -
 *  - - - - - - - - - - - - - - --
 */
router.get("/api/notes/:username", (req, res) => {
  const username = req.params.username;
  User.findOne({ username: username })
    .then((user) => {
      Note.find({ user: user._id })
        .then((notes) => res.json({ success: true, message: "Success", notes }))
        .catch((err) => res.json({ success: false, message: err }));
    })
    .catch((err) => {
      console.log(err);
    });
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

router.post("/api/register", async (req, res) => {
  console.log(req.body);
  await User.register(
    new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
    }),
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
  const email = req.body.email;
  const title = req.body.title;
  const body = req.body.body;

  async function saveNote() {
    const foundUser = await User.findOne({ username: email });
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
    client.close;
  }
  saveNote();
});
/*
 *  - - - - - - --  - - - - - - --
 *  - - - - DELETE Requests - - - - -
 *  - - - - - - - - - - - - - - --
 */
router.delete("/api/note/:id", (req, res) => {
  const noteId = req.params.id;
  Note.deleteOne({ _id: noteId }).then((err) => {
    if (err) {
      console.log(err);
    } else {
      res.json({ success: true, message: "Note Successfully deleted." });
    }
  });
});

/*
 *  - - - - - - --  - - - - - - --
 *  - - - - PATCH Requests - - - - -
 *  - - - - - - - - - - - - - - --
 */
router.patch("/api/submit-note", (req, res) => {});

module.exports = router;
