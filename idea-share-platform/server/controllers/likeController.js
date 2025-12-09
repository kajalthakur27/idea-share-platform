const Like = require('../models/Like');
const Idea = require('../models/Idea');


const likeIdea = async (req, res) => {
  try {
    const ideaId = req.params.ideaId;
    const userId = req.user.id;

    
    const idea = await Idea.findById(ideaId);
    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }

    
    const alreadyLiked = await Like.findOne({ user: userId, idea: ideaId });
    if (alreadyLiked) {
      return res.status(400).json({ message: 'You already liked this idea' });
    }

    const like = await Like.create({
      user: userId,
      idea: ideaId
    });

   
    idea.likesCount += 1;
    await idea.save();

    res.status(201).json({ message: 'Idea liked successfully', like });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const unlikeIdea = async (req, res) => {
  try {
    const ideaId = req.params.ideaId;
    const userId = req.user.id;

    const like = await Like.findOne({ user: userId, idea: ideaId });
    if (!like) {
      return res.status(404).json({ message: 'Like not found' });
    }

    // Like ko delete karo
    await like.deleteOne();

    // Idea ke likesCount ko 1 se kam karo
    const idea = await Idea.findById(ideaId);
    if (idea) {
      idea.likesCount -= 1;
      await idea.save();
    }

    res.json({ message: 'Idea unliked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all likes for an idea
// @route   GET /api/likes/:ideaId
// @access  Public
const getLikesForIdea = async (req, res) => {
  try {
    const ideaId = req.params.ideaId;

    // Is idea pe kitne likes hain aur kis kis user ne like kiya
    const likes = await Like.find({ idea: ideaId }).populate('user', 'name email');
    
    res.json({
      count: likes.length,
      likes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const checkIfLiked = async (req, res) => {
  try {
    const ideaId = req.params.ideaId;
    const userId = req.user.id;

    // Check karo ki current user ne like kiya hai ya nahi
    const liked = await Like.findOne({ user: userId, idea: ideaId });
    
    res.json({ liked: !!liked });  // true ya false bhejenge
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  likeIdea,
  unlikeIdea,
  getLikesForIdea,
  checkIfLiked
};
