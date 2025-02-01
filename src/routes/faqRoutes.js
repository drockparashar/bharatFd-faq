const express = require("express");
const router = express.Router();
const { createFAQ } = require("../controllers/faqController"); // Ensure this import

// Define routes
router.post("/create", createFAQ); // Ensure this points to the correct method in faqController

module.exports = router;
