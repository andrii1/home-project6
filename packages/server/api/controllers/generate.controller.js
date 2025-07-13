/* TODO: This is an example controller to illustrate a server side controller.
Can be deleted as soon as the first real controller is added. */

const HttpError = require('../lib/utils/http-error');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const createChat = async (body) => {
  const { prompt } = body;

  if (!prompt) {
    throw new HttpError('Prompt is required', 400);
  }

  try {
    // Call OpenAI Chat API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const aiReply = response.choices[0].message.content;

    return {
      successful: true,
      prompt,
      response: aiReply,
    };
  } catch (err) {
    console.error('OpenAI error:', err);
    throw new HttpError('Failed to generate response', 500);
  }
};

module.exports = {
  createChat,
};
