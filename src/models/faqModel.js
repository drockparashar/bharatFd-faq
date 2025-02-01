const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  question_es: String,
  answer_es: String,
  question_fr: String,
  answer_fr: String,
  question_de: String,
  answer_de: String,
  question_hi: String,
  answer_hi: String,
});

module.exports = mongoose.model("FAQ", faqSchema);
