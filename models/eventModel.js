const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const eventSchema = new Schema({
  name: String,
  date: Date,
  location: String,
  attendees: [{type: mongoose.Types.ObjectId, ref: 'member'}]
});

module.exports = mongoose.model("event", eventSchema);
