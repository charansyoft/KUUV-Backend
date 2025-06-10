import express from "express";
import locationModel from "../models/locationModel.js";

const router = express.Router();

router.get("/locations", async (req, res) => {
  try {
    const locations = await locationModel.find();

    if (!locations || locations.length === 0) {
      return res.status(404).json({ message: "No locations found" });
    }

    res.status(200).json(locations);
  } catch (error) {
    console.error("Error fetching locations:", error.message || error);
    res.status(500).json({ message: "Server error while fetching locations" });
  }
});

export default router;
