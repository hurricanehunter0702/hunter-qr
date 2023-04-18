const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const memberSchema = new Schema({
  email: {type:String, unique: true},
  password: {type:String, required: true},
  firstname: {type:String, required: true},
  lastname: {type:String, required: true},
  organization: String,
});

module.exports = mongoose.model('member', memberSchema);
