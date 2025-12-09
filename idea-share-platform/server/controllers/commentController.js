const Comment = require('../models/Comment');
const Idea = require('../models/Idea');


const getCommentsForIdea = async (req, res) => {
  try {
    const ideaId = req.params.ideaId;

   
    const comments = await Comment.find({ idea: ideaId })
      .sort({ createdAt: -1 })
      .populate('user', 'name email');  // User ka naam aur email bhi lao

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const addComment = async (req, res) => {
  try {
    const ideaId = req.params.ideaId;
    const { text } = req.body;

    // Comment text zaroori hai
    if (!text) {
      return res.status(400).json({ message: 'Please provide comment text' });
    }

    // Check karo ki idea exist karta hai
    const idea = await Idea.findById(ideaId);
    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }

    // Naya comment create karo
    const comment = await Comment.create({
      text,
      user: req.user.id,
      userName: req.user.name,
      idea: ideaId
    });

    // Idea ke commentsCount ko 1 se badha do
    idea.commentsCount += 1;
    await idea.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const { text } = req.body;

    // Comment ko dhundo
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check karo ki ye comment current user ka hi hai
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only update your own comments' });
    }

    // Comment update karo
    comment.text = text || comment.text;
    const updatedComment = await comment.save();

    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:commentId
// @access  Private (sirf apna comment delete kar sakte ho)
const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;

    // Comment ko dhundo
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check karo ki ye comment current user ka hi hai
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own comments' });
    }

    // Idea ke commentsCount ko 1 se kam karo
    const idea = await Idea.findById(comment.idea);
    if (idea) {
      idea.commentsCount -= 1;
      await idea.save();
    }

    // Comment delete karo
    await comment.deleteOne();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCommentsForIdea,
  addComment,
  updateComment,
  deleteComment
};
