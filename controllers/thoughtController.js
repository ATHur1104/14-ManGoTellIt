const { ObjectId } = require('mongoose').Types;
const { Thought } = require('../models/Thought');

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
};

module.exports = thoughtController;
