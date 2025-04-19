const express = require("express");
const app = express();
const authRoutes = require("./routes/auth");
const kosRoutes = require("./routes/kost.routes");

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/kos", kosRoutes);

module.exports = app;
