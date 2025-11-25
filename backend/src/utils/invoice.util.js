const crypto = require("crypto");

function generateInvoiceNumber() {
  const now = new Date();

  // YYYYMMDD format
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");

  // 3-byte strong random hex → 6 chars
  const rand = crypto.randomBytes(3).toString("hex").toUpperCase();

  return `INV-${datePart}-${rand}`;
}

module.exports = { generateInvoiceNumber };
