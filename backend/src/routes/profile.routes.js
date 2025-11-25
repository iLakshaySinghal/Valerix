const router = require("express").Router();
const authJwt = require("../middlewares/authJwt");
const ProfileController = require("../controllers/profile.controller");

router.use(authJwt);

router.get("/me", ProfileController.getMyProfile);
router.post("/create", ProfileController.createProfile);
router.put("/update", ProfileController.updateProfile);

module.exports = router;
