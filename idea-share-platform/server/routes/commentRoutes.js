const express = require('express');
const router = express.Router();
const { getCommentsForIdea, addComment, updateComment, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

// Public route - koi bhi comments dekh sakta hai
router.get('/:ideaId', getCommentsForIdea);

// Private routes - sirf logged in user comment kar sakta hai
router.post('/:ideaId', protect, addComment);
router.put('/:commentId', protect, updateComment);
router.delete('/:commentId', protect, deleteComment);

module.exports = router;
