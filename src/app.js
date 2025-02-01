const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const faqRoutes = require("./routes/faqRoutes");

require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON requests

// Routes
app.use("/api/faqs", faqRoutes);

// Connect to DB and Start Server
const PORT = process.env.PORT || 8000;
connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app; // Export for testing
