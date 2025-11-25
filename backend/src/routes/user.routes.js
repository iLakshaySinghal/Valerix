const router = require("express").Router();
const authJwt = require("../middlewares/authJwt");

const {
  getProfile,
  updateProfile,
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} = require("../controllers/user.controller");

// All user routes need login
router.use(authJwt);

// Profile
router.get("/profile", getProfile);
router.put("/profile", updateProfile);

// Address
router.post("/address", addAddress);
router.get("/address", getAddresses);
router.put("/address/:id", updateAddress);
router.delete("/address/:id", deleteAddress);

// Default address
router.post("/address/default/:id", setDefaultAddress);

module.exports = router;
