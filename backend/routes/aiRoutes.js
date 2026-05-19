const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const axios = require('axios');
const Complaint = require('../models/Complaint');

router.post('/analyze', protect, async (req, res) => {
  const { complaintId } = req.body;

  try {
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found.' });

    const prompt = `You are an AI complaint management assistant for a smart city system. Analyze the following complaint and respond ONLY with a valid JSON object (no extra text, no markdown, no backticks).

Complaint Title: ${complaint.title}
Category: ${complaint.category}
Location: ${complaint.location}
Description: ${complaint.description}

Return this exact JSON structure:
{
  "priority": "High | Medium | Low",
  "department": "Name of the responsible department",
  "summary": "2-sentence summary of the complaint",
  "autoResponse": "A polite, professional response message to the citizen"
}`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',  // ← Outlier endpoint
      {
       model: "meta-llama/llama-3-8b-instruct",   // ← use whichever model Outlier gave you access to
        messages: [
          { role: 'system', content: 'You are a helpful smart city complaint management AI. Always respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const text = response.data.choices[0].message.content;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return res.status(500).json({ message: 'AI response parsing failed.' });

    const aiAnalysis = JSON.parse(jsonMatch[0]);

    complaint.aiAnalysis = aiAnalysis;
    await complaint.save();

    res.json({ message: 'AI analysis complete.', aiAnalysis });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: 'AI analysis failed.', error: err.message });
  }
});

module.exports = router;