const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Fetch all food items
// @route   GET /api/food
// @access  Public
router.get('/', async (req, res) => {
    const foods = await Food.find({});
    res.json(foods);
});

// @desc    Fetch single food item
// @route   GET /api/food/:id
// @access  Public
router.get('/:id', async (req, res) => {
    const food = await Food.findById(req.params.id);
    if (food) {
        res.json(food);
    } else {
        res.status(404).json({ message: 'Food not found' });
    }
});

// @desc    Create a food item
// @route   POST /api/food
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    const { name, category, price, description, rating } = req.body;
    let { image } = req.body;

    // Auto-generate image if not provided
    if (!image || image.trim() === '') {
        image = `https://loremflickr.com/400/300/${encodeURIComponent(category + ',' + name)}`;
    }

    const food = new Food({
        name,
        category,
        price,
        description,
        image,
        rating: rating || 4.5
    });

    try {
        const createdFood = await food.save();
        res.status(201).json(createdFood);
    } catch (error) {
        console.error('Error creating food:', error);
        res.status(400).json({ message: 'Invalid food data' });
    }
});

// @desc    Generate food image
// @route   POST /api/food/generate-image
// @access  Private/Admin
router.post('/generate-image', protect, admin, async (req, res) => {
    const { foodName, category } = req.body;

    try {
        // Use LoremFlickr which is more reliable for keyword-based redirects
        const imageUrl = `https://loremflickr.com/400/300/${encodeURIComponent(category + ',' + foodName)}`;

        console.log(`Generated image URL for ${foodName}: ${imageUrl}`);
        res.json({ imageUrl });
    } catch (error) {
        console.error('Image generation route error:', error);
        res.status(500).json({ message: 'Image generation failed' });
    }
});

// @desc    Delete a food item
// @route   DELETE /api/food/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    const food = await Food.findById(req.params.id);

    if (food) {
        await food.deleteOne();
        res.json({ message: 'Food item removed' });
    } else {
        res.status(404).json({ message: 'Food not found' });
    }
});

module.exports = router;
