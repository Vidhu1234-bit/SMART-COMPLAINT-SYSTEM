const express = require('express');
const router = express.Router();
const {
  addComplaint, getAllComplaints, getComplaintById,
  updateComplaintStatus, deleteComplaint,
  searchByLocation, filterByCategory
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addComplaint);
router.get('/', protect, getAllComplaints);
router.get('/search', protect, searchByLocation);
router.get('/filter', protect, filterByCategory);
router.get('/:id', protect, getComplaintById);
router.put('/:id', protect, updateComplaintStatus);
router.delete('/:id', protect, deleteComplaint);

module.exports = router;