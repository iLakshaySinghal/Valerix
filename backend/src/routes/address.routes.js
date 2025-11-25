const router = require("express").Router();
const authJwt = require("../middlewares/authJwt");
const addressController = require("../controllers/address.controller");

router.use(authJwt);

// CREATE
router.post("/add", addressController.addAddress);

// READ
router.get("/", addressController.getAddresses);

// SET DEFAULT
router.put("/default/:id", addressController.setDefaultAddress);

// DELETE
router.delete("/:id", addressController.deleteAddress);

module.exports = router;
