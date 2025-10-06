const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/ask", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
    });

    const text = result.response.text();
    return res.status(200).json({ reply: text });
  } catch (err) {
    console.error("Gemini API Error:", err);
    return res.status(500).json({ error: "Gemini API call failed" });
  }
});

module.exports = router;
