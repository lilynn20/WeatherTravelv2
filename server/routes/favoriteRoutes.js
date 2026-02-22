const router = require("express").Router();
const Favorite = require("../models/Favorite");
const auth = require("../middleware/auth");

// Get all favorites for a user
router.get("/", auth, async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ userId: req.user.id }).sort({ addedAt: -1 });
    res.json(favorites);
  } catch (err) {
    next(err);
  }
});

// Add a favorite
router.post("/", auth, async (req, res, next) => {
  try {
    const { city } = req.body;
    
    // Check if already favorited
    const existing = await Favorite.findOne({ userId: req.user.id, city });
    if (existing) {
      return res.status(400).json({ error: "City already in favorites" });
    }
    
    const favorite = await Favorite.create({ userId: req.user.id, city });
    res.status(201).json(favorite);
  } catch (err) {
    next(err);
  }
});

// Remove a favorite
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const favorite = await Favorite.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!favorite) {
      return res.status(404).json({ error: "Favorite not found" });
    }
    
    res.json({ message: "Favorite removed successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
