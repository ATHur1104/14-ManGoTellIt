require("dotenv").config();
const connection = require('../config/connection');
const { User, Thought } = require('../models');

connection.once('open', async () => {
  console.log('Connected to the database.');

  try {
    // Drop existing collections
    await User.collection.drop();
    await Thought.collection.drop();

    // Create users
    const user1 = await User.create({
      username: 'user1',
      email: 'user1@example.com',
    });

    const user2 = await User.create({
      username: 'user2',
      email: 'user2@example.com',
    });

    // Create thoughts and link to users
    const thought1 = await Thought.create({
      thoughtText: 'This is thought 1 by user1.',
      username: user1.username,
    });
    user1.thoughts.push(thought1);
    await user1.save();

    const thought2 = await Thought.create({
      thoughtText: 'This is thought 2 by user1.',
      username: user1.username,
    });
    user1.thoughts.push(thought2);
    await user1.save();

    const reaction1 = {
      reactionBody: 'Cool thought!',
      username: user2.username,
    };

    const reaction2 = {
      reactionBody: 'I agree!',
      username: user2.username,
    };

    const reaction3 = {
      reactionBody: 'Interesting.',
      username: user1.username,
    };

    await Thought.findByIdAndUpdate(
      thought1._id,
      { $push: { reactions: reaction1 } }
    );

    await Thought.findByIdAndUpdate(
      thought2._id,
      { $push: { reactions: [reaction2, reaction3] } }
    );

    console.log('Seed data has been populated.');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    connection.close();
    console.log('Connection closed.');
  }
});
