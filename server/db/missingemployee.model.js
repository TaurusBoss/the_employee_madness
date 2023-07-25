// https://mongoosejs.com/
const mongoose = require("mongoose");

const { Schema } = mongoose;

const MissingEmployeeSchema = new Schema({
  name: String,
  level: String,
  position: String,
  created: {
    type: Date,
    default: Date.now,
  },
  fname: String,
  lname: String,
  midname: String,
  missing: Boolean
}, { _id : false});

module.exports = mongoose.model("missing", MissingEmployeeSchema);