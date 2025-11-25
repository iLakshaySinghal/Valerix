const router = require("express").Router();
const authJwt = require("../middlewares/authJwt");
const requireRole = require("../middlewares/requireRole");
const { getInvoicePdf } = require("../controllers/invoice.controller");

// All invoice routes need login
router.use(authJwt);

// User / startup / admin can view invoice PDF
router.get(
  "/:id/pdf",
  requireRole(["user", "startup", "admin"]),
  getInvoicePdf
);

module.exports = router;
