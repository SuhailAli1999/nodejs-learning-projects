const express = require("express");
const path = require("path");

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

const memberRoutes = require("./routes/member");
const trainerRoutes = require("./routes/trainer");
const statisticRoutes = require("./routes/statistics");

app.use("/api/v1", memberRoutes);
app.use("/api/v1", trainerRoutes);
app.use("/api/v1", statisticRoutes);

app.use((req, res, next) => {
  res.status(404).send("<h1>Page not found</h1>");
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
