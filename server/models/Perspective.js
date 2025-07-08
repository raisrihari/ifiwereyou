// server/models/Perspective.js - VERIFIED CORRECT VERSION

const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const PerspectiveSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    dilemma: {
        type: Schema.Types.ObjectId,
        ref: 'Dilemma',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    isMarkedBest: {
        type: Boolean,
        default: false
    },
    starredBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
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

module.exports = mongoose.model('Perspective', PerspectiveSchema);