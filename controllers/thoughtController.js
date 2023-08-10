const { User, Thought, Reaction } = require('../models');

const thoughtController = {
  getAllThoughts: async (req, res) => {
    try {
      const thoughts = await Thought.find().populate('reactions');
      res.json(thoughts);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching thoughts.' });
    }
  },

  getThoughtById: async (req, res) => {
    const { thoughtId } = req.params;
    try {
      const thought = await Thought.findById(thoughtId).populate('reactions');
      if (!thought) {
        return res.status(404).json({ message: 'Thought not found.' });
      }
      res.json(thought);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching the thought.' });
    }
  },

  createThought: async (req, res) => {
    console.log('Received POST request to create thought:', req.body);
    const { thoughtText } = req.body;
    const { userId } = req.params;

    try {
      const user = await User.findById(userId);
      if (!user) {
        console.log('User not found.');
        return res.status(404).json({ error: 'User not found.' });
      }

      const thought = await Thought.create({
        thoughtText,
        username: user.username
      });
      user.thoughts.push(thought);
      await user.save();

      res.json(thought);
    } catch (error) {
      res.status(400).json({ error: 'Invalid data provided.' });
    }
  },

  updateThought: async (req, res) => {
    const { thoughtId } = req.params;
    const { thoughtText } = req.body;

    try {
      const updatedThought = await Thought.findByIdAndUpdate(
        thoughtId,
        { thoughtText },
        { new: true }
      );

      if (!updatedThought) {
        return res.status(404).json({ message: 'Thought not found.' });
      }

      res.json(updatedThought);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while updating the thought.' });
    }
  },

  deleteThought: async (req, res) => {
    const { thoughtId } = req.params;

    try {
      const deletedThought = await Thought.findByIdAndDelete(thoughtId);

      if (!deletedThought) {
        return res.status(404).json({ message: 'Thought not found.' });
      }

      res.json({ message: 'Thought deleted.' });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while deleting the thought.' });
    }
  },

  createReaction: async (req, res) => {
    const { thoughtId } = req.params;
    const { reactionBody } = req.body;
    const username = req.body.username || 'Guest';

    try {
      const newReaction = {
        reactionBody,
        username,
      };

      const updatedThought = await Thought.findByIdAndUpdate(
        thoughtId,
        { $push: { reactions: newReaction } },
        { new: true }
      );

      if (!updatedThought) {
        return res.status(404).json({ message: 'Thought not found.' });
      }

      res.json(updatedThought);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while creating the reaction.' });
    }
  },


  deleteReaction: async (req, res) => {
    const { thoughtId, reactionId } = req.params;
  
    try {
      console.log('Deleting reaction with ID:', reactionId);
  
      const thoughtContainingReaction = await Thought.findOne({ _id: thoughtId });
  
      if (!thoughtContainingReaction) {
        console.log('Thought not found.');
        return res.status(404).json({ message: 'Thought not found.' });
      }
  
      const reactionIndex = thoughtContainingReaction.reactions.findIndex(
        reaction => reaction._id.toString() === reactionId
      );
  
      if (reactionIndex === -1) {
        console.log('Reaction not found in the thought.');
        return res.status(404).json({ message: 'Reaction not found.' });
      }
  
      thoughtContainingReaction.reactions.splice(reactionIndex, 1);
  
      await thoughtContainingReaction.save();
  
      console.log('Updated thought after deleting reaction:', thoughtContainingReaction);
  
      res.json(thoughtContainingReaction);
    } catch (error) {
      console.error('Error deleting reaction:', error);
      res.status(500).json({ error: 'An error occurred while deleting the reaction.' });
    }
  },
};
module.exports = thoughtController;