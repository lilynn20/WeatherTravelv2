const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  userId:String,
  city:String,
  startDate:Date,
  endDate:Date,
  notes:String
});

module.exports = mongoose.model("Trip", tripSchema);