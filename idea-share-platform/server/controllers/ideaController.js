// const Idea = require('../models/Idea');
// const Comment = require('../models/Comment');
// const Like = require('../models/Like');

// // @desc    Get all ideas
// // @route   GET /api/ideas
// // @access  Public
// const getAllIdeas = async (req, res) => {
//   try {
//     // Database se saare ideas nikalo, latest pehle (sort by createdAt)
//     const ideas = await Idea.find().sort({ createdAt: -1 });
//     res.json(ideas);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Get single idea by ID
// // @route   GET /api/ideas/:id
// // @access  Public
// const getIdeaById = async (req, res) => {
//   try {
//     // req.params.id se id milegi URL se
//     const idea = await Idea.findById(req.params.id);
    
//     if (!idea) {
//       return res.status(404).json({ message: 'Idea not found' });
//     }
    
//     res.json(idea);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Create new idea
// // @route   POST /api/ideas
// // @access  Private (login user hi create kar sakta hai)
// const createIdea = async (req, res) => {
//   try {
//     const { title, description, tags, category } = req.body;

//     // Title aur description zaroori hain
//     if (!title || !description) {
//       return res.status(400).json({ message: 'Please provide title and description' });
//     }

//     // Naya idea create karo
//     const idea = await Idea.create({
//       title,
//       description,
//       tags: tags || [],
//       category: category || 'General',
//       user: req.user.id,        // Logged in user ka ID (middleware se aaya hai)
//       userName: req.user.name   // User ka naam bhi save kar rahe hain
//     });

//     res.status(201).json(idea);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// const updateIdea = async (req, res) => {
//   try {
//     const idea = await Idea.findById(req.params.id);

//     if (!idea) {
//       return res.status(404).json({ message: 'Idea not found' });
//     }

//     // Check karo ki idea is user ka hi hai ya nahi
//     if (idea.user.toString() !== req.user.id) {
//       return res.status(403).json({ message: 'You can only update your own ideas' });
//     }

//     // Update karo idea ko
//     const { title, description, tags, category } = req.body;
    
//     idea.title = title || idea.title;
//     idea.description = description || idea.description;
//     idea.tags = tags || idea.tags;
//     idea.category = category || idea.category;

//     const updatedIdea = await idea.save();
//     res.json(updatedIdea);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const deleteIdea = async (req, res) => {
//   try {
//     const idea = await Idea.findById(req.params.id);

//     if (!idea) {
//       return res.status(404).json({ message: 'Idea not found' });
//     }

//     // Check karo ki idea is user ka hi hai
//     if (idea.user.toString() !== req.user.id) {
//       return res.status(403).json({ message: 'You can only delete your own ideas' });
//     }

//     // Idea delete karte waqt uske sare comments aur likes bhi delete karo
//     await Comment.deleteMany({ idea: req.params.id });
//     await Like.deleteMany({ idea: req.params.id });
//     await idea.deleteOne();

//     res.json({ message: 'Idea deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Get my ideas (current user ke ideas)
// // @route   GET /api/ideas/my/all
// // @access  Private
// const getMyIdeas = async (req, res) => {
//   try {
//     // Sirf current user ke ideas nikalo
//     const ideas = await Idea.find({ user: req.user.id }).sort({ createdAt: -1 });
//     res.json(ideas);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = {
//   getAllIdeas,
//   getIdeaById,
//   createIdea,
//   updateIdea,
//   deleteIdea,
//   getMyIdeas
// };







const Idea = require('../models/Idea');
const Comment = require('../models/Comment');
const Like = require('../models/Like');

// Helper: check if req.user exists
const checkUser = (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: 'Not authorized, invalid token or user not found' });
    return false;
  }
  return true;
};

// Get all ideas
const getAllIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find().sort({ createdAt: -1 });
    res.json(ideas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get idea by ID
const getIdeaById = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });
    res.json(idea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new idea
const createIdea = async (req, res) => {
  try {
    if (!checkUser(req, res)) return;

    const { title, description, tags, category } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Please provide title and description' });
    }

    const idea = await Idea.create({
      title,
      description,
      tags: tags || [],
      category: category || 'General',
      user: req.user._id,
      userName: req.user.name
    });

    res.status(201).json(idea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update idea
const updateIdea = async (req, res) => {
  try {
    if (!checkUser(req, res)) return;

    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });

    if (idea.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only update your own ideas' });
    }

    const { title, description, tags, category } = req.body;
    idea.title = title || idea.title;
    idea.description = description || idea.description;
    idea.tags = tags || idea.tags;
    idea.category = category || idea.category;

    const updatedIdea = await idea.save();
    res.json(updatedIdea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete idea
const deleteIdea = async (req, res) => {
  try {
    if (!checkUser(req, res)) return;

    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });

    if (idea.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own ideas' });
    }

    await Comment.deleteMany({ idea: req.params.id });
    await Like.deleteMany({ idea: req.params.id });
    await idea.deleteOne();

    res.json({ message: 'Idea deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get my ideas
const getMyIdeas = async (req, res) => {
  try {
    if (!checkUser(req, res)) return;

    const ideas = await Idea.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(ideas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllIdeas,
  getIdeaById,
  createIdea,
  updateIdea,
  deleteIdea,
  getMyIdeas
};
