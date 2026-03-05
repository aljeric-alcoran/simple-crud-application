const express = require("express");
const router = express.Router();
const firestoreService = require("../services/firestoreService");

// GET all records
router.get("/", async (req, res) => {
  try {
    const records = await firestoreService.getAll("records");
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single record
router.get("/:id", async (req, res) => {
  try {
    const record = await firestoreService.getById("records", req.params.id);
    if (!record) return res.status(404).json({ error: "Record not found" });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create record
router.post("/", async (req, res) => {
  try {
    const record = await firestoreService.create("records", req.body);
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update record
router.put("/:id", async (req, res) => {
  try {
    const record = await firestoreService.update("records", req.params.id, req.body);
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE record
router.delete("/:id", async (req, res) => {
  try {
    await firestoreService.delete("records", req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;