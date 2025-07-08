// server/routes/dilemmas.js - CLEAN VERSION

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Dilemma = require('../models/Dilemma');
const User = require('../models/User');

// --- 1. CREATE a new dilemma ---
// @route   POST /api/dilemmas
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
// @route   GET /api/dilemmas
router.get('/', async (req, res) => {
    try {
        let query = {};
        const { category, tag, world } = req.query;

        if (tag) {
            query.tags = { $regex: `^${tag}$`, $options: 'i' };
        } else if (category) {
            query.categories = { $regex: `^${category}$`, $options: 'i' };
        } else if (world) {
            // NEW: Handle fetching by parent world
            let worldCategories = [];
            if (world === 'crossroads') {
                worldCategories = ['I Need Advice', 'It\'s My Opinion', 'Change My Mind'];
            } else if (world === 'sandbox') {
                worldCategories = ['Hypothetical', 'Fiction', 'Imaginary', 'What If...'];
            } else if (world === 'engine') {
                worldCategories = ['Dream Machine', 'Writer\'s Block', 'Why Do You Think?'];
            }
            // Find any story that has AT LEAST ONE of the categories from that world
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
router.get('/search', async (req, res) => {
    try {
        const searchTerm = req.query.q; // We'll use 'q' for query

        if (!searchTerm) {
            return res.json([]); // Return empty array if no search term
        }

        // Create a case-insensitive regular expression from the search term
        const regex = new RegExp(searchTerm, 'i');

        // This query finds documents where EITHER the title OR the story matches the regex
        const query = {
            $or: [
                { title: regex },
                { story: regex }
            ]
        };

        const dilemmas = await Dilemma.find(query)
            .populate('author', 'username')
            .sort({ createdAt: -1 }) // Or sort by relevance later
            .limit(50); // Limit search results

        res.json(dilemmas);

    } catch (error) {
        console.error('Search error:', error.message);
        res.status(500).send('Server Error');
    }
});
// --- 3. READ a single dilemma by ID ---
// @route   GET /api/dilemmas/:id
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

router.get('/top', async (req, res) => {
    try {
        const dilemmas = await Dilemma.aggregate([
            // Stage 1: Create a temporary field 'interestCount'
            {
                $addFields: {
                    interestCount: { $size: "$interestedBy" }
                }
            },
            // Stage 2: Sort by that new field
            { $sort: { interestCount: -1 } },
            // Stage 3: Limit the results
            { $limit: 50 },
            // Stage 4: Use $lookup to join with the 'users' collection (the correct way to populate)
            {
                $lookup: {
                    from: 'users', // The collection name to join with
                    localField: 'author', // The field from the Dilemma document
                    foreignField: '_id', // The field from the users document
                    as: 'authorInfo' // The name of the new array field to add
                }
            },
            // Stage 5: Deconstruct the authorInfo array and add the username
            {
                $addFields: {
                    author: { $arrayElemAt: ["$authorInfo", 0] }
                }
            },
            {
                $addFields: {
                    "author.username": "$author.username"
                }
            },
            // Stage 6: Project only the fields we need to send to the front-end
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


router.get('/trending', async (req, res) => {
    try {
        const dilemmas = await Dilemma.aggregate([
            // Stage 1: Create 'perspectiveCount'
            {
                $addFields: {
                    perspectiveCount: { $size: "$perspectives" }
                }
            },
            // Stage 2: Sort by it
            { $sort: { perspectiveCount: -1 } },
            // Stage 3: Limit
            { $limit: 50 },
            // Stage 4: Populate the author using $lookup
            {
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'authorInfo'
                }
            },
            // Stage 5 & 6: Clean up the populated author data
            {
                $addFields: {
                    author: { $arrayElemAt: ["$authorInfo", 0] }
                }
            },
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

router.get('/new', async (req, res) => {
    try {
        const dilemmas = await Dilemma.find({})
            .populate('author', 'username')
            .sort({ createdAt: -1 })
            .limit(50); // Also good to limit here

        res.json(dilemmas);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});
// --- 4. MARK AS INTERESTING (Toggle) ---
// @route   PUT /api/dilemmas/interesting/:id
router.put('/interesting/:id', auth, async (req, res) => {
    try {
        console.log('=== INTERESTING TOGGLE START ===');
        console.log('User ID from token:', req.user.id);
        console.log('Dilemma ID:', req.params.id);
        
        const dilemma = await Dilemma.findById(req.params.id);

        if (!dilemma) {
            return res.status(404).json({ msg: 'Dilemma not found' });
        }

        // Initialize interestedBy array if it doesn't exist
        if (!dilemma.interestedBy) {
            dilemma.interestedBy = [];
        }

        console.log('Current interestedBy array:', dilemma.interestedBy);
        console.log('interestedBy length BEFORE:', dilemma.interestedBy.length);

        // Convert ObjectIds to strings for comparison
        const userIdString = req.user.id.toString();
        const interestedByStrings = dilemma.interestedBy.map(id => id.toString());
        
        console.log('User ID as string:', userIdString);
        console.log('InterestedBy as strings:', interestedByStrings);
        
        // Check if user has already marked as interesting
        const userIndex = interestedByStrings.indexOf(userIdString);
        console.log('User index in array:', userIndex);

        if (userIndex === -1) {
            // User hasn't marked it yet - ADD them
            dilemma.interestedBy.push(req.user.id);
            console.log('ADDED user to interestedBy');
        } else {
            // User has already marked it - REMOVE them
            dilemma.interestedBy.splice(userIndex, 1);
            console.log('REMOVED user from interestedBy');
        }

        console.log('interestedBy length AFTER:', dilemma.interestedBy.length);
        console.log('New interestedBy array:', dilemma.interestedBy);

        await dilemma.save();
        
        // Return the updated dilemma with populated fields
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
        
        console.log('Final interestedBy count:', updatedDilemma.interestedBy.length);
        console.log('=== INTERESTING TOGGLE END ===');
        
        res.json(updatedDilemma);

    } catch (error) {
        console.error('Error in interesting toggle:', error);
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
});

// --- 5. EDIT a dilemma by ID ---
// @route   PUT /api/dilemmas/:id
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

// --- 6. DELETE a dilemma by ID ---
// @route   DELETE /api/dilemmas/:id
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

module.exports = router;