const express = require("express");
const app = express();

// const { connectDB } = require("./config/db.config.js");
const { PORT } = require("./config/env.config.js");
app.use(express.json());


app.listen(PORT, () => {
  console.log(`my app listening on port ${PORT}`);
});
