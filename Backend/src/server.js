const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const problemRoutes = require("./routes/problemRoutes");
const battleRoutes = require("./routes/battleRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const friendRoutes = require("./routes/friendRoutes");
const chatRoutes = require("./routes/chatRoutes");
const run_code = require("./routes/run_code");

const http = require("http");
const { initSocket } = require("./socket");

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/problems", problemRoutes);
app.use("/battles", battleRoutes);
app.use("/submissions", submissionRoutes);
app.use("/leaderboard", leaderboardRoutes);
app.use("/friends", friendRoutes);
app.use("/chat", chatRoutes);
app.use("/", run_code);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));