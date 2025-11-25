const { createServer } = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const logger = require("./utils/logger");
const socketInit = require("./sockets");
const AuthService = require("./services/auth.service"); // ⬅ add this

require("dotenv").config();

const PORT = process.env.PORT || 5000;

connectDB()
  .then(async () => {

    // ✅ Ensure single default admin exists
    await AuthService.ensureDefaultAdmin();

    const server = createServer(app);

    socketInit(server);

    server.listen(PORT, () => {
      logger.info(`Server running in ${process.env.NODE_ENV} on port ${PORT}`);
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
