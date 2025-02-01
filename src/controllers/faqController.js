const FAQ = require("../models/faqModel");
const { translateFAQ } = require("../services/translationService");
const redis = require("../config/redis");

exports.createFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;

    // 🌍 Translate FAQ before creating the document
    const translations = await translateFAQ({ question, answer });
    console.log("translation:",translations);

    // 📝 Create new FAQ document with translations
    const newFAQ = new FAQ({
      question,
      answer,
      ...translations, // Spread translated fields like question_es, answer_es, etc.
    });

    // 💾 Save the FAQ to the database
    const savedFAQ = await newFAQ.save();

    redis.setex(`faq:${question}:en`, 3600, String(answer)); // Store in Redis with a 1-hour expiration
    for (let i = 0; i < Object.keys(translations).length; i += 2) {
      const lang = Object.keys(translations)[i].split('_')[1]; // Extract language code
      const translatedQuestion = translations[Object.keys(translations)[i]]; // Get translated question
      const translatedAnswer = translations[Object.keys(translations)[i + 1]]; // Get translated answer
      // Set the translation in Redis
      redis.setex(`faq:${translatedQuestion}:${lang}`, 3600, String(translatedAnswer)); // Store in Redis with a 1-hour expiration
    }



    res.status(200).json({
      message: "FAQ created successfully",
      data: savedFAQ,
    });
  } catch (error) {
    console.error("❌ Error creating FAQ:", error);
    res.status(500).json({ message: "Error creating FAQ", error: error.message });
  }
};
