const { Translate } = require("@google-cloud/translate").v2;
const dotenv = require("dotenv");

dotenv.config(); // Load API key from .env file

const translate = new Translate({ key: process.env.GOOGLE_API_KEY });

const translateText = async (text, lang) => {
  try {
    const [translation] = await translate.translate(text, lang);
    return translation;
  } catch (error) {
    console.error(`❌ Google Translation Error (${lang}):`, error.message);
    return text; // Fallback to original text
  }
};

// 🌍 Translate both question & answer using Google API
const translateFAQ = async ({ question, answer }) => {
  const languages = ["es", "fr", "de", "hi"];

  const translations = await Promise.all(
    languages.map(async (lang) => ({
      [`question_${lang}`]: await translateText(question, lang),
      [`answer_${lang}`]: await translateText(answer, lang),
    }))
  );

  return Object.assign({}, ...translations);
};

module.exports = { translateFAQ };
