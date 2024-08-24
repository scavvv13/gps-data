const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3009;

app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

// Schema for storing GPS data
const locationSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  timestamp: { type: Date, default: Date.now },
});

const Location = mongoose.model("Location", locationSchema);

// Route to receive GPS data
app.post("/api/upload_location", async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const location = new Location({ latitude: lat, longitude: lng });
    await location.save();
    res.status(201).json({ message: "Location saved successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error saving location", error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
