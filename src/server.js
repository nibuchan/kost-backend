require("dotenv").config();
const express = require("express");
const cors = require("cors");
const server = express();
const authRoutes = require("./routes/auth");
const kosRoutes = require("./routes/kost.routes");

server.use(cors({
  origin: ["https://bacarikos.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

const PORT = process.env.PORT || 3000;

server.use(express.json({ limit: "10mb" }));

server.use("/api/auth", authRoutes);
server.use("/api/kos", kosRoutes);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

