const mongoose = require("mongoose");

const legSchema = new mongoose.Schema({
  city: { type: String, required: true },
  country: { type: String, default: "" },
  startDate: { type: Date },
  endDate: { type: Date },
  notes: { type: String, default: "" },
  order: { type: Number, default: 0 },
});

const tripSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    // Itinerary support: multiple legs (cities)
    legs: [legSchema],
    // Legacy single-city support kept for backward compat
    city: { type: String, default: "" },
    startDate: { type: Date },
    endDate: { type: Date },
    notes: { type: String, default: "" },
    status: { type: String, enum: ["planned", "ongoing", "completed", "cancelled"], default: "planned" },
    isShared: { type: Boolean, default: false },
    shareToken: { type: String, default: null, index: true, sparse: true },
    weatherSnapshot: { type: Object, default: null },
    reminderSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);