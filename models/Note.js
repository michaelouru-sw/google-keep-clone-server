const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");
const DB_STRING = process.env.DB_STRING;

mongoose.set("strictQuery", true);
mongoose.connect(DB_STRING, {
  useNewUrlParser: true,
});

const noteSchema = new mongoose.Schema({
  title: String,
  body: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
