const { Schema, model, Types } = require('mongoose');

const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
      required: true
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280
    },
    username: {
      type: String,
      required: false
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAt) => new Date(createdAt).toISOString()
    }
  },
  {
    id: false
  }
);

module.exports = reactionSchema;
