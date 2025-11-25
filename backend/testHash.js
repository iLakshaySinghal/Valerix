const bcrypt = require("bcryptjs");

const hash = "$2a$10$wr5jGYRbfxej.OlQq2iiqQNDF7buo2nndjKEHZ1lcV1/CRVf7qaTW"; // copy from your DB
const entered = "1234"; // replace with the password you used at signup

bcrypt.compare(entered, hash).then(result => console.log("MATCH?", result));
