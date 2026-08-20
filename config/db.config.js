const mongoose = require("mongoose");


const uri = process.env.MONGO_URI;

const connectDB = () => {
  if (!uri) {
    console.error("MONGO_URI is not defined in .env file");
    process.exit(1);
  }

  mongoose
    .connect(uri)
    .then(() => {
      console.log(" MongoDB Connected Successfully");
    })
    .catch((error) => {
      console.error("MongoDB Connection Error:", error.message);
      process.exit(1);
    });
};

module.exports = { connectDB };