const express = require("express");
const router = express.Router();
require("dotenv").config();
const config = require("../utils/config");
const Chat = require("../models/chat");
const User = require("../models/user");
const { GoogleGenAI } = require("@google/genai");

const apiKey = config.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

router.post("/chats", async (request, response, next) => {
  const topic = request.body.topic;
  const userRequest = request.body.userRequest;
  const userID = request.body.user;
  console.log(userID, " expecting id fron front end send");

  const prompt = `
You are an expert ${topic} educator with 10+ years of teaching experience.
Respond to this user request: "${userRequest}"
If the user is making casual conversation or greeting, respond naturally and conversationally.
For educational requests, provide a clear, structured response following this exact format:

OUTPUT FORMAT REQUIREMENTS:
- Return ONLY valid JSON with no additional text outside the JSON structure.
- Output must be an array containing exactly 1 object.
- The object MUST strictly follow this schema:

{
  "summary": "A concise 4-word headline summary from user question if question is one or two word use your intellegence and make it 4 word",
  "answer": "Your complete response here following the three-part structure below"
}

RESPONSE RULES:
1. "summary" must always be a short, exactly 4-word headline that give user understand what the question is also you can add ... also .
   Example: "DOM and VDOM in javascript"
2. "answer" must always contain three labeled sections in plain text:

EXPLANATION:
Step-by-step breakdown with simple language, assuming no prior knowledge.

EXAMPLE:
A practical, working example with input/output. Use readable text without markdown.

SUMMARY:
A detailed overview covering:
- What (definition)
- When (use cases)
- Where (context/environment)
- Why (benefits/importance)
- How (key methods/approaches)

FORMATTING RULES:
- Use plain text only (no markdown symbols like **, ##, or \`\`\`).
- Separate sections with clear headings.
- Use line breaks for readability.
- Ensure the response directly answers "${userRequest}".

Remember: The entire response must strictly follow the JSON schema with both "summary" and "answer".`;
  try {
    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      generationConfig: {
        response_mime_type: "application/json",
      },
    });

    let cleanedResponse = aiResponse.text
      .replace(/```json\n?/g, "") // Remove ```json
      .replace(/```\n?/g, "") // Remove ```
      .trim(); // Remove extra whitespace

    let parsedAnswer;
    try {
      parsedAnswer = JSON.parse(cleanedResponse);

      if (!Array.isArray(parsedAnswer)) {
        parsedAnswer = [parsedAnswer];
      }
    } catch (err) {
      console.warn("AI did not return valid JSON. Wrapping raw text.");
      parsedAnswer = [{ answer: cleanedResponse }];
    }

    console.log("cleanedResponse", parsedAnswer);
    console.log("Raw AI Response:", aiResponse.text);
    console.log("Cleaned Response Before JSON.parse:", cleanedResponse);

    const user = await User.findById(userID);
    console.log(user, " get from user");

    if (!user) {
      return response
        .status(400)
        .json({ error: "userId missing or not valid" });
    }

    const newChat = new Chat({
      topic: topic,
      userRequest: userRequest,
      summary: parsedAnswer[0].summary,
      answer: parsedAnswer[0].answer,
      user: user.id,
    });

    const result = await newChat.save();
    user.chats = user.chats.concat(result.id);
    await user.save();

    return response.status(200).json({ data: parsedAnswer, chats: user.chats });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
