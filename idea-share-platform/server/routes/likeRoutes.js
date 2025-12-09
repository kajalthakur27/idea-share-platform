const express = require('express');
const router = express.Router();
const { likeIdea, unlikeIdea, getLikesForIdea, checkIfLiked } = require('../controllers/likeController');
const { protect } = require('../middleware/authMiddleware');

// Specific routes pehle likho - ताकि general /:ideaId से पहले match हो जाएं
router.get('/:ideaId/check', protect, checkIfLiked);

// Public route - koi bhi dekh sakta hai idea pe kitne likes hain
router.get('/:ideaId', getLikesForIdea);

// Private routes - sirf logged in user like/unlike kar sakta hai
router.post('/:ideaId', protect, likeIdea);
router.delete('/:ideaId', protect, unlikeIdea);

module.exports = router;
