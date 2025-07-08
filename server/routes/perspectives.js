// server/routes/perspectives.js

const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const Dilemma = require('../models/Dilemma'); // Make sure Dilemma model is imported
const Perspective = require('../models/Perspective');
const User = require('../models/User'); // Assuming User model is needed elsewhere in this file

router.post('/:dilemmaId', auth, async (req, res) => {
    const { text, isAnonymous } = req.body;

    if (!text) {
        return res.status(400).json({ msg: 'Comment text is required.' });
    }

    try {
        const dilemma = await Dilemma.findById(req.params.dilemmaId);
        if (!dilemma) {
            return res.status(404).json({ msg: 'Dilemma not found.' });
        }

        const newPerspective = new Perspective({
            text,
            isAnonymous: isAnonymous || false,
            author: req.user.id,
            dilemma: req.params.dilemmaId // Ensure the dilemma ID is stored with the perspective
        });

        const perspective = await newPerspective.save();

        // Add the new perspective's ID to the dilemma's perspectives array
        dilemma.perspectives.unshift(perspective.id);
        await dilemma.save();

        res.status(201).json(perspective);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

router.put('/:id', auth, async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ msg: 'Text is required.' });

    try {
        let perspective = await Perspective.findById(req.params.id);
        if (!perspective) {
            return res.status(404).json({ msg: 'Perspective not found.' });
        }
        // Ensure the user editing is the author of the perspective
        if (perspective.author.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized.' });
        }
        
        perspective = await Perspective.findByIdAndUpdate(
            req.params.id,
            { $set: { text: text, isEdited: true } },
            { new: true } // Return the updated document
        );
        res.json(perspective);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

router.put('/star/:id', auth, async (req, res) => {
    try {
        const perspective = await Perspective.findById(req.params.id);

        if (!perspective) {
            return res.status(404).json({ msg: 'Perspective not found.' });
        }

        // Check if the user's ID is already in the array
        const userIndex = perspective.starredBy.indexOf(req.user.id);

        if (userIndex === -1) {
            // User has NOT starred it yet. Add them to the array.
            perspective.starredBy.push(req.user.id);
            await perspective.save();
            return res.json(perspective.starredBy); // Return the updated array
        } else {
            // User HAS starred it. Remove them from the array.
            perspective.starredBy.splice(userIndex, 1);
            await perspective.save();
            return res.json(perspective.starredBy); // Return the updated array
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

router.put('/best/:id', auth, async (req, res) => {
    try {
        const perspective = await Perspective.findById(req.params.id);
        if (!perspective) {
            return res.status(404).json({ msg: 'Perspective not found.' });
        }

        // Find the parent dilemma to verify the author
        const dilemma = await Dilemma.findById(perspective.dilemma);
        if (!dilemma) {
            return res.status(404).json({ msg: 'Parent dilemma not found for this perspective.' });
        }

        // Ensure the logged-in user is the author of the dilemma
        if (dilemma.author.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized to mark best for this dilemma.' });
        }

        // Toggle the 'isMarkedBest' status
        perspective.isMarkedBest = !perspective.isMarkedBest;
        await perspective.save();

        res.json(perspective);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const perspective = await Perspective.findById(req.params.id);
        if (!perspective) {
            return res.status(404).json({ msg: 'Perspective not found.' });
        }

        // Ensure the user deleting is the author of the perspective
        if (perspective.author.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized.' });
        }

        // Get the parent dilemma to remove the perspective reference
        const dilemma = await Dilemma.findById(perspective.dilemma);
        if (dilemma) {
            dilemma.perspectives = dilemma.perspectives.filter(
                (pId) => pId.toString() !== req.params.id
            );
            await dilemma.save();
        }

        // Delete the perspective document itself
        await perspective.deleteOne(); // Mongoose v6+ uses deleteOne()

        res.json({ msg: 'Perspective removed.' });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;