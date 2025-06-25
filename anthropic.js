const axios = require("axios");

// Replace with your actual API key
const API_KEY = "your-anthropic-api-key-here";

async function queryClaudeWithSearch(userPrompt) {
  try {
    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-3.5-sonnet-20240229", // or latest Claude model
        max_tokens: 1000,
        tools: [{ name: "search" }], // Enables the web search tool
        messages: [
          {
            role: "user",
            content: userPrompt,
          },
        ],
      },
      {
        headers: {
          "x-api-key": API_KEY,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
      }
    );

    const message = response.data;
    console.log("Claude response:");
    console.log(message.content);
  } catch (error) {
    console.error(
      "Error querying Claude:",
      error.response?.data || error.message
    );
  }
}

// Example usage
queryClaudeWithSearch(
  "What are the latest trends in generative AI as of this month?"
);
