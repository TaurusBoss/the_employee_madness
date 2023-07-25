// https://mongoosejs.com/
const mongoose = require("mongoose");

const { Schema } = mongoose;

const EmployeeSchema = new Schema({
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
});

module.exports = mongoose.model("Employee", EmployeeSchema);
