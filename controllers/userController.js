const { User } = require('../models');

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching users.' });
    }
  },

  getUserById: async (req, res) => {
    const { userId } = req.params;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching the user.' });
    }
  },

  createUser: async (req, res) => {
    const { username, email } = req.body;
    try {
      const user = await User.create({ username, email });
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: 'Invalid data provided.' });
    }
  },

  updateUser: async (req, res) => {
    const { userId } = req.params;
    const { username, email } = req.body;

    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { username, email },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found.' });
      }

      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while updating the user.' });
    }
  },

  deleteUser: async (req, res) => {
    const { userId } = req.params;

    try {
      const deletedUser = await User.findByIdAndDelete(userId);

      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found.' });
      }

      res.json({ message: 'User deleted.' });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while deleting the user.' });
    }
  },

  addFriend: async (req, res) => {
    const { userId, friendId } = req.params;

    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { friends: friendId } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while adding the friend.' });
    }
  },

  removeFriend: async (req, res) => {
    const { userId, friendId } = req.params;

    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { friends: friendId } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while removing the friend.' });
    }
  },
};

module.exports = userController;
