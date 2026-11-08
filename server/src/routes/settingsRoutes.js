import express from 'express';
import mongoose from 'mongoose';
import Settings from '../models/Settings.js';
import { connectDB, getDbStatus, inMemoryStore, autoSeedIfNeeded } from '../db.js';
import { defaultGroupLinks } from '../data/studentsData.js';

const router = express.Router();

function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

// GET settings (Group links and Database connection status)
router.get('/', async (req, res) => {
  try {
    const dbStatus = getDbStatus();

    if (isMongoConnected()) {
      let settings = await Settings.findOne({ key: 'app_settings' });
      if (!settings) {
        settings = await Settings.create({
          key: 'app_settings',
          groupLinks: defaultGroupLinks
        });
      }
      return res.json({
        success: true,
        dbStatus,
        groupLinks: settings.groupLinks || defaultGroupLinks
      });
    } else {
      return res.json({
        success: true,
        dbStatus,
        groupLinks: inMemoryStore.settings.groupLinks
      });
    }
  } catch (err) {
    console.error('Error fetching settings:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update group links
router.put('/group-links', async (req, res) => {
  try {
    const { groupLinks } = req.body;
    if (!groupLinks || typeof groupLinks !== 'object') {
      return res.status(400).json({ success: false, error: 'groupLinks object is required.' });
    }

    if (isMongoConnected()) {
      const updated = await Settings.findOneAndUpdate(
        { key: 'app_settings' },
        { $set: { groupLinks } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      return res.json({ success: true, message: 'Group links updated in MongoDB.', groupLinks: updated.groupLinks });
    } else {
      inMemoryStore.settings.groupLinks = { ...inMemoryStore.settings.groupLinks, ...groupLinks };
      return res.json({ success: true, message: 'Group links updated in memory store.', groupLinks: inMemoryStore.settings.groupLinks });
    }
  } catch (err) {
    console.error('Error updating group links:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST connect/update MongoDB connection string
router.post('/db-connect', async (req, res) => {
  try {
    const { mongoUri } = req.body;

    if (!mongoUri || typeof mongoUri !== 'string' || mongoUri.trim() === '') {
      return res.status(400).json({ success: false, error: 'Valid mongoUri connection string is required.' });
    }

    const trimmedUri = mongoUri.trim();
    const result = await connectDB(trimmedUri);

    if (result.success) {
      // Auto seed students
      await autoSeedIfNeeded();

      // Save custom URI reference in settings if connected
      try {
        await Settings.findOneAndUpdate(
          { key: 'app_settings' },
          { $set: { customMongoUri: trimmedUri } },
          { upsert: true }
        );
      } catch (saveErr) {
        console.warn('Could not persist customMongoUri in settings doc:', saveErr.message);
      }

      return res.json({
        success: true,
        message: 'Successfully connected to your MongoDB database! All student records have been synchronized and seeded.',
        dbStatus: getDbStatus()
      });
    } else {
      return res.status(400).json({
        success: false,
        error: result.error || 'Failed to connect to MongoDB with provided connection string.',
        message: result.message,
        dbStatus: getDbStatus()
      });
    }
  } catch (err) {
    console.error('Error connecting to DB via API:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

