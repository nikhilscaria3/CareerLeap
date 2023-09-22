const express = require('express');
const router = express.Router();
const axios = require('axios');

// Replace 'YOUR_OPENAI_API_KEY' with your actual API key
const apiKey = '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';
const apiUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions';

router.post('/api/chatbot/ask', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(apiUrl, {
      prompt,
      max_tokens: 150,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    res.json({ response: response.data.choices[0].text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
});

module.exports = router;
