const Trip = require("../models/Trip");
const crypto = require("crypto");

// GET /api/trips — list all trips for authenticated user
exports.getTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) {
    next(err);
  }
};

// POST /api/trips — create a trip
exports.createTrip = async (req, res, next) => {
  try {
    const { title, legs, city, startDate, endDate, notes, weatherSnapshot } = req.body;

    if (!title || (!city && (!legs || legs.length === 0))) {
      return res.status(400).json({ error: "Title and at least one city/leg are required." });
    }

    const trip = await Trip.create({
      userId: req.user.id,
      title,
      legs: legs || [],
      city: city || (legs && legs[0]?.city) || "",
      startDate,
      endDate,
      notes,
      weatherSnapshot,
    });
    res.status(201).json(trip);
  } catch (err) {
    next(err);
  }
};

// PUT /api/trips/:id — update a trip
exports.updateTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) return res.status(404).json({ error: "Trip not found." });

    const allowed = ["title", "legs", "city", "startDate", "endDate", "notes", "status", "weatherSnapshot"];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) trip[field] = req.body[field];
    });

    await trip.save();
    res.json(trip);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/trips/:id — delete a trip
exports.deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!trip) return res.status(404).json({ error: "Trip not found." });
    res.json({ message: "Trip deleted." });
  } catch (err) {
    next(err);
  }
};

// POST /api/trips/:id/share — generate a shareable link token
exports.shareTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) return res.status(404).json({ error: "Trip not found." });

    if (!trip.shareToken) {
      trip.shareToken = crypto.randomBytes(16).toString("hex");
    }
    trip.isShared = true;
    await trip.save();

    res.json({ shareToken: trip.shareToken, isShared: true });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/trips/:id/share — revoke sharing
exports.revokeShare = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) return res.status(404).json({ error: "Trip not found." });

    trip.isShared = false;
    trip.shareToken = null;
    await trip.save();

    res.json({ isShared: false });
  } catch (err) {
    next(err);
  }
};

// GET /api/trips/shared/:token — public read of a shared trip (no auth)
exports.getSharedTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ shareToken: req.params.token, isShared: true });
    if (!trip) return res.status(404).json({ error: "Shared trip not found or link revoked." });
    res.json(trip);
  } catch (err) {
    next(err);
  }
};
