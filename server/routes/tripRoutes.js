const router = require("express").Router();
const Trip = require("../models/Trip");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res, next) => {
  try {
    const trip = await Trip.create({ ...req.body, userId: req.user.id });
    res.status(201).json(trip);
  } catch (err) {
    next(err);
  }
});

router.get("/", auth, async (req, res, next) => {
  try {
    const trips = await Trip.find({ userId: req.user.id }).sort({ startDate: -1 });
    res.json(trips);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", auth, async (req, res, next) => {
  try {
    const trip = await Trip.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }
    
    res.json({ message: "Trip deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;