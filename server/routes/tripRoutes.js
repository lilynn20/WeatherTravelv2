const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  getTrips,
  createTrip,
  updateTrip,
  deleteTrip,
  shareTrip,
  revokeShare,
  getSharedTrip,
} = require("../controllers/tripController");

// Public — no auth needed
router.get("/shared/:token", getSharedTrip);

// Protected
router.get("/", auth, getTrips);
router.post("/", auth, createTrip);
router.put("/:id", auth, updateTrip);
router.delete("/:id", auth, deleteTrip);
router.post("/:id/share", auth, shareTrip);
router.delete("/:id/share", auth, revokeShare);

module.exports = router;