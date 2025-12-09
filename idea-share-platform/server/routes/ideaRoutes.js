const express = require('express');
const router = express.Router();
const { 
  getAllIdeas, 
  getIdeaById, 
  createIdea, 
  updateIdea, 
  deleteIdea,
  getMyIdeas 
} = require('../controllers/ideaController');
const { protect } = require('../middleware/authMiddleware');

// Specific routes pehle likho - protect ke sath
router.get('/my/all', protect, getMyIdeas);

// Public routes - bina login ke access kar sakte hain
router.get('/', getAllIdeas);
router.get('/:id', getIdeaById);

// Private routes - login zaroori hai
router.post('/', protect, createIdea);
router.put('/:id', protect, updateIdea);
router.delete('/:id', protect, deleteIdea);

module.exports = router;
