import express from 'express';
import Date from '../models/Date.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all dates with slots (public)
router.get('/', async (req, res) => {
    try {
        const dates = await Date.find().sort({ order: 1 });
        res.json(dates);
    } catch (error) {
        console.error('Error fetching dates:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new date (admin only)
router.post('/', requireAuth, async (req, res) => {
    try {
        const { name } = req.body;

        // Get the highest order number
        const lastDate = await Date.findOne().sort({ order: -1 });
        const order = lastDate ? lastDate.order + 1 : 0;

        // Create new date with slots
        const newDate = new Date({ name, order });
        newDate.generateSlots();

        await newDate.save();
        res.status(201).json(newDate);
    } catch (error) {
        console.error('Error creating date:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update date name (admin only)
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const { name } = req.body;
        const date = await Date.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true }
        );

        if (!date) {
            return res.status(404).json({ message: 'Date not found' });
        }

        res.json(date);
    } catch (error) {
        console.error('Error updating date:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete date (admin only)
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const date = await Date.findByIdAndDelete(req.params.id);

        if (!date) {
            return res.status(404).json({ message: 'Date not found' });
        }

        res.json({ message: 'Date deleted successfully' });
    } catch (error) {
        console.error('Error deleting date:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Toggle slot availability (admin only)
router.put('/:id/slots/:slotId', requireAuth, async (req, res) => {
    try {
        const date = await Date.findById(req.params.id);

        if (!date) {
            return res.status(404).json({ message: 'Date not found' });
        }

        const slot = date.slots.id(req.params.slotId);
        if (!slot) {
            return res.status(404).json({ message: 'Slot not found' });
        }

        slot.available = !slot.available;
        await date.save();

        res.json(date);
    } catch (error) {
        console.error('Error toggling slot:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Reorder dates (admin only)
router.put('/reorder/all', requireAuth, async (req, res) => {
    try {
        const { dateIds } = req.body; // Array of date IDs in new order

        // Update order for each date
        const updatePromises = dateIds.map((id, index) =>
            Date.findByIdAndUpdate(id, { order: index })
        );

        await Promise.all(updatePromises);

        const dates = await Date.find().sort({ order: 1 });
        res.json(dates);
    } catch (error) {
        console.error('Error reordering dates:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
