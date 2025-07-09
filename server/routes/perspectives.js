const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const Dilemma = require('../models/Dilemma');
const Perspective = require('../models/Perspective');

// --- CREATE a new perspective ---
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
            dilemma: req.params.dilemmaId
        });

        const perspective = await newPerspective.save();

        dilemma.perspectives.unshift(perspective._id); // safer to use _id
        await dilemma.save();

        res.status(201).json(perspective);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// --- EDIT a perspective ---
router.put('/:id', auth, async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ msg: 'Text is required.' });

    try {
        let perspective = await Perspective.findById(req.params.id);
        if (!perspective) {
            return res.status(404).json({ msg: 'Perspective not found.' });
        }

        if (perspective.author.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized.' });
        }

        perspective = await Perspective.findByIdAndUpdate(
            req.params.id,
            { $set: { text, isEdited: true } },
            { new: true }
        );

        res.json(perspective);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// --- STAR / UNSTAR a perspective ---
router.put('/star/:id', auth, async (req, res) => {
    try {
        const perspective = await Perspective.findById(req.params.id);
        if (!perspective) {
            return res.status(404).json({ msg: 'Perspective not found.' });
        }

        const userId = req.user.id;
        const index = perspective.starredBy.map(id => id.toString()).indexOf(userId);

        if (index === -1) {
            perspective.starredBy.push(userId);
        } else {
            perspective.starredBy.splice(index, 1);
        }

        await perspective.save();
        res.json(perspective.starredBy);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// --- MARK / UNMARK BEST ---
router.put('/best/:id', auth, async (req, res) => {
    try {
        const perspective = await Perspective.findById(req.params.id);
        if (!perspective) {
            return res.status(404).json({ msg: 'Perspective not found.' });
        }

        const dilemma = await Dilemma.findById(perspective.dilemma);
        if (!dilemma) {
            return res.status(404).json({ msg: 'Parent dilemma not found.' });
        }

        if (dilemma.author.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized.' });
        }

        perspective.isMarkedBest = !perspective.isMarkedBest;
        await perspective.save();

        res.json(perspective);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// --- DELETE a perspective ---
router.delete('/:id', auth, async (req, res) => {
    try {
        const perspective = await Perspective.findById(req.params.id);
        if (!perspective) {
            return res.status(404).json({ msg: 'Perspective not found.' });
        }

        if (perspective.author.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized.' });
        }

        const dilemma = await Dilemma.findById(perspective.dilemma);
        if (dilemma) {
            dilemma.perspectives = dilemma.perspectives.filter(
                (pId) => pId.toString() !== perspective._id.toString()
            );
            await dilemma.save();
        }

        await perspective.deleteOne();
        res.json({ msg: 'Perspective removed.' });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
