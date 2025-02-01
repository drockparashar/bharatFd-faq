const FAQ = require("../models/faqModel");
const { translateFAQ } = require("../services/translationService");

exports.createFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;

    // Create the FAQ document
    const newFAQ = new FAQ({
      question,
      answer,
    });

    // Translate FAQ
    const languages = ['es', 'fr', 'de', 'hi'];
    for (const lang of languages) {
      const cachedQuestion = await redis.get(`faq:${question}:${lang}`);
      const cachedAnswer = await redis.get(`faq:${answer}:${lang}`);

      if (cachedQuestion && cachedAnswer) {
        // Use cached translations if available
        newFAQ[`question_${lang}`] = cachedQuestion;
        newFAQ[`answer_${lang}`] = cachedAnswer;
      } else {
        // If not cached, use the translation service and cache the result
        const translated = await translateFAQ(question, answer, lang);
        newFAQ[`question_${lang}`] = translated.question;
        newFAQ[`answer_${lang}`] = translated.answer;

        // Cache the translations for future use
        redis.setex(`faq:${question}:${lang}`, 3600, translated.question); // Cache for 1 hour
        redis.setex(`faq:${answer}:${lang}`, 3600, translated.answer); // Cache for 1 hour
      }
    }

    // Save FAQ to the database
    const savedFAQ = await newFAQ.save();

    res.status(200).json({
      message: 'FAQ created successfully',
      data: savedFAQ,
    });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    res.status(500).json({ message: 'Error creating FAQ', error: error.message });
  }
};
