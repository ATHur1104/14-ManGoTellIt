require("dotenv").config();
const connection = require('../config/connection');
const { User, Thought } = require('../models');


connection.once('open', async () => {
  console.log('Connected to the database.');

  try {
    // Access the underlying MongoDB collections
    const userCollection = User.collection;
    const thoughtCollection = Thought.collection;

    // Drop existing collections
    await userCollection.drop();
    await thoughtCollection.drop();

    // Create users and thoughts
    const user1 = await userCollection.insertOne({
      username: 'user1',
      email: 'user1@example.com',
    });

    const user2 = await userCollection.insertOne({
      username: 'user2',
      email: 'user2@example.com',
    });

    const thought1 = await thoughtCollection.insertOne({
      thoughtText: 'This is thought 1 by user1.',
      username: user1.username,
    });

    const thought2 = await thoughtCollection.insertOne({
      thoughtText: 'This is thought 2 by user1.',
      username: user1.username,
    });

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

    await thoughtCollection.updateOne(
      { _id: thought1._id },
      { $push: { reactions: reaction1 } }
    );

    await thoughtCollection.updateOne(
      { _id: thought2._id },
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
