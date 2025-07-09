const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Dilemma = require('../models/Dilemma');
const User = require('../models/User');

// --- 1. CREATE a new dilemma ---
router.post('/', auth, async (req, res) => {
    const { title, story, tags, categories, isAnonymous } = req.body;
    if (!title || !story || !categories) {
        return res.status(400).json({ msg: 'Please provide a title, story, and at least one category.' });
    }
    try {
        const newDilemma = new Dilemma({
            title, story, tags: tags || [], categories,
            isAnonymous: isAnonymous || false, author: req.user.id
        });
        const dilemma = await newDilemma.save();
        res.status(201).json(dilemma);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// --- 2. READ all dilemmas (with filtering) ---
router.get('/', async (req, res) => {
    try {
        let query = {};
        const { category, tag, world } = req.query;

        if (tag) {
            query.tags = { $regex: `^${tag}$`, $options: 'i' };
        } else if (category) {
            query.categories = { $regex: `^${category}$`, $options: 'i' };
        } else if (world) {
            let worldCategories = [];
            if (world === 'crossroads') {
                worldCategories = ['I Need Advice', 'It\'s My Opinion', 'Change My Mind'];
            } else if (world === 'sandbox') {
                worldCategories = ['Hypothetical', 'Fiction', 'Imaginary', 'What If...'];
            } else if (world === 'engine') {
                worldCategories = ['Dream Machine', 'Writer\'s Block', 'Why Do You Think?'];
            }
            query.categories = { $in: worldCategories };
        }
        
        const dilemmas = await Dilemma.find(query)
            .populate('author', 'username')
            .sort({ createdAt: -1 });
        
        res.json(dilemmas);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// --- 3. SEARCH ---
router.get('/search', async (req, res) => {
    try {
        const searchTerm = req.query.q;
        if (!searchTerm) return res.json([]);

        const regex = new RegExp(searchTerm, 'i');
        const query = {
            $or: [{ title: regex }, { story: regex }]
        };

        const dilemmas = await Dilemma.find(query)
            .populate('author', 'username')
            .sort({ createdAt: -1 })
            .limit(50);

        res.json(dilemmas);

    } catch (error) {
        console.error('Search error:', error.message);
        res.status(500).send('Server Error');
    }
});

// --- 4. TOP DILEMMAS ---
router.get('/top', async (req, res) => {
    try {
        const dilemmas = await Dilemma.aggregate([
            { $addFields: { interestCount: { $size: "$interestedBy" } } },
            { $sort: { interestCount: -1 } },
            { $limit: 50 },
            {
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'authorInfo'
                }
            },
            { $addFields: { author: { $arrayElemAt: ["$authorInfo", 0] } } },
            {
                $project: {
                    title: 1, story: 1, tags: 1, categories: 1, isAnonymous: 1, 
                    createdAt: 1, perspectives: 1, interestedBy: 1, 
                    'author._id': 1, 'author.username': 1
                }
            }
        ]);

        res.json(dilemmas);
    } catch (error) {
        console.error('Error in /top route:', error);
        res.status(500).send('Server Error');
    }
});

// --- 5. TRENDING DILEMMAS ---
router.get('/trending', async (req, res) => {
    try {
        const dilemmas = await Dilemma.aggregate([
            { $addFields: { perspectiveCount: { $size: "$perspectives" } } },
            { $sort: { perspectiveCount: -1 } },
            { $limit: 50 },
            {
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'authorInfo'
                }
            },
            { $addFields: { author: { $arrayElemAt: ["$authorInfo", 0] } } },
            {
                $project: {
                    title: 1, story: 1, tags: 1, categories: 1, isAnonymous: 1,
                    createdAt: 1, perspectives: 1, interestedBy: 1, 
                    'author._id': 1, 'author.username': 1
                }
            }
        ]);

        res.json(dilemmas);
    } catch (error) {
        console.error('Error in /trending route:', error);
        res.status(500).send('Server Error');
    }
});

// --- 6. NEWEST DILEMMAS ---
router.get('/new', async (req, res) => {
    try {
        const dilemmas = await Dilemma.find({})
            .populate('author', 'username')
            .sort({ createdAt: -1 })
            .limit(50);

        res.json(dilemmas);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// --- 7. MARK AS INTERESTING ---
router.put('/interesting/:id', auth, async (req, res) => {
    try {
        const dilemma = await Dilemma.findById(req.params.id);
        if (!dilemma) return res.status(404).json({ msg: 'Dilemma not found' });

        if (!dilemma.interestedBy) dilemma.interestedBy = [];

        const userIdString = req.user.id.toString();
        const interestedByStrings = dilemma.interestedBy.map(id => id.toString());
        const userIndex = interestedByStrings.indexOf(userIdString);

        if (userIndex === -1) {
            dilemma.interestedBy.push(req.user.id);
        } else {
            dilemma.interestedBy.splice(userIndex, 1);
        }

        await dilemma.save();

        const updatedDilemma = await Dilemma.findById(req.params.id)
            .populate('author', 'username')
            .populate({
                path: 'perspectives',
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: 'author',
                    select: 'username'
                }
            });

        res.json(updatedDilemma);

    } catch (error) {
        console.error('Error in interesting toggle:', error);
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
});

// --- 8. EDIT a dilemma by ID ---
router.put('/:id', auth, async (req, res) => {
    const { title, story, tags, categories, isAnonymous } = req.body;
    try {
        let dilemma = await Dilemma.findById(req.params.id);
        if (!dilemma) return res.status(404).json({ msg: 'Dilemma not found' });
        if (dilemma.author.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });

        const updatedFields = {};
        if (title) updatedFields.title = title;
        if (story) updatedFields.story = story;
        if (tags) updatedFields.tags = tags;
        if (categories) updatedFields.categories = categories;
        if (isAnonymous !== undefined) updatedFields.isAnonymous = isAnonymous;
        updatedFields.isEdited = true;

        dilemma = await Dilemma.findByIdAndUpdate(
            req.params.id,
            { $set: updatedFields },
            { new: true }
        );
        res.json(dilemma);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// --- 9. DELETE a dilemma by ID ---
router.delete('/:id', auth, async (req, res) => {
    try {
        const dilemma = await Dilemma.findById(req.params.id);
        if (!dilemma) return res.status(404).json({ msg: 'Dilemma not found' });
        if (dilemma.author.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });
        
        await dilemma.deleteOne();
        res.json({ msg: 'Dilemma removed' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// --- 10. GET a single dilemma by ID (LAST to avoid route conflict!) ---
router.get('/:id', async (req, res) => {
    try {
        const dilemma = await Dilemma.findById(req.params.id)
            .populate('author', 'username')
            .populate({
                path: 'perspectives',
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: 'author',
                    select: 'username'
                }
            });

        if (!dilemma) {
            return res.status(404).json({ msg: 'Dilemma not found' });
        }

        res.json(dilemma);

    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Dilemma not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
