require("dotenv").config();

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

const chatGPT = async (prompt) => {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });
  console.log(response["data"]["choices"][0]["message"]["content"]);
};

chatGPT("what are some theories on what is one piece?");
