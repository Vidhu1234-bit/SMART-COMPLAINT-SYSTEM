const axios = require("axios");
const Complaint = require("../models/Complaint");

exports.analyzeComplaint = async (req, res) => {
  try {
    const { complaintId } = req.body;

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found.",
      });
    }

    const prompt = `
Analyze this complaint:
Title: ${complaint.title}
Description: ${complaint.description}

Return:
1. Priority
2. Department
3. Short AI response
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      success: true,
      aiResponse: response.data,
    });
  } catch (error) {
    res.status(500).json({
      message: "AI analysis failed.",
      error: error.message,
    });
  }
};