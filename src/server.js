require("dotenv").config();
const express = require("express");
const cors = require("cors");
const server = express();
const authRoutes = require("./routes/auth");
const kosRoutes = require("./routes/kost.routes");

server.use(cors());

const PORT = process.env.PORT || 3000;

server.use(express.json({ limit: "10mb" }));

server.use("/api/auth", authRoutes);
server.use("/api/kos", kosRoutes);

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

