// server/models/Reaction.js - FINAL REVISED VERSION

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReactionSchema = new Schema({
    // The user who made the reaction
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // CHANGED: The dilemma this reaction is for
    dilemma: {
        type: Schema.Types.ObjectId,
        ref: 'Dilemma',
        required: true
    },
    // The type of feeling/reaction
    feeling: {
        type: String,
        required: true,
        enum: ['Excited', 'Scared', 'Concerned', 'Inspired', 'Confused', 'Supportive', 'Intrigued']
    }
}, { timestamps: true });

module.exports = mongoose.model('Reaction', ReactionSchema);