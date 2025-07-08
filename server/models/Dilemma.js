// server/models/Dilemma.js - CORRECTED FINAL VERSION

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DilemmaSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    story: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        trim: true
    },
    categories: {
        type: [String],
        required: true,
        trim: true
    },
    interestedBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    // Storing the reactions directly. This is efficient.
    // Example: [{ feeling: 'Scared', userId: '...' }, { feeling: 'Inspired', userId: '...' }]
    reactions: [
        {
            feeling: { type: String, required: true },
            user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
        }
    ],
    perspectives: [{
        type: Schema.Types.ObjectId,
        ref: 'Perspective'
    }],
    isEdited: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Dilemma', DilemmaSchema);