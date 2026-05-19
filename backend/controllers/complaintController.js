const Complaint = require('../models/Complaint');

exports.addComplaint = async (req, res) => {
  try {
    const { name, email, title, description, category, location } = req.body;
    if (!name || !email || !title || !description || !category || !location)
      return res.status(400).json({ message: 'All fields are required.' });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: 'Invalid email format.' });

    const complaint = await Complaint.create({ name, email, title, description, category, location });
    res.status(201).json({ message: 'Complaint registered successfully.', complaint });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found.' });
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status, aiAnalysis } = req.body;
    const updated = await Complaint.findByIdAndUpdate(
      req.params.id,
      { ...(status && { status }), ...(aiAnalysis && { aiAnalysis }) },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Complaint not found.' });
    res.json({ message: 'Updated successfully.', complaint: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteComplaint = async (req, res) => {
  try {
    const deleted = await Complaint.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Complaint not found.' });
    res.json({ message: 'Complaint deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.searchByLocation = async (req, res) => {
  try {
    const { location } = req.query;
    const complaints = await Complaint.find({
      location: { $regex: location, $options: 'i' }
    });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.filterByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    const complaints = await Complaint.find({
      category: { $regex: category, $options: 'i' }
    });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};