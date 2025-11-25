const bcrypt = require("bcryptjs");

async function hashPassword(plain) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}

async function comparePassword(plain, hash) {
  if (!plain || !hash) {
    console.log("❌ comparePassword: Missing plain/hash");
    return false;
  }

  const result = await bcrypt.compare(plain, hash);
  console.log("🔐 comparePassword:", { plain, hash, result });
  return result;
}

module.exports = { hashPassword, comparePassword };
