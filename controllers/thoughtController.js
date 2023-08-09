const { Thought } = require('../models');

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
    const { thoughtText, username, userId } = req.body;
    try {
      const thought = await Thought.create({ thoughtText, username });
      const user = await User.findByIdAndUpdate(userId, { $push: { thoughts: thought._id } });
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
    const { reactionBody, username } = req.body;

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
      
      const updatedThought = await Thought.findByIdAndUpdate(
        thoughtId,
        { $pull: { reactions: { _id: reactionId } } },
        { new: true } 
      );

      if (!updatedThought) {
        return res.status(404).json({ message: 'Thought not found.' });
      }

      res.json(updatedThought);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while deleting the reaction.' });
    }
  },
};
module.exports = thoughtController;