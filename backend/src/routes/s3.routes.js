const router = require("express").Router();
const authJwt = require("../middlewares/authJwt");

const { getPresignedUrl } = require("../controllers/s3.controller");

// Login required for upload
router.get("/presign", authJwt, getPresignedUrl);

module.exports = router;
