const axios = require("axios");

const TRANSLATION_API_URL = "https://api.mymemory.translated.net/get";

const translateText = async (text, lang) => {
  try {
    const response = await axios.get(TRANSLATION_API_URL, {
      params: { q: text, langpair: `en|${lang}` },
    });

    return response.data.responseData.translatedText;
  } catch (error) {
    console.error(`❌ Translation Error (${lang}):`, error.response?.data || error.message);
    return null;
  }
};

// 🔄 Translate FAQ question & answer to multiple languages
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
