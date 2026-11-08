import express from 'express';
import mongoose from 'mongoose';
import Attendance from '../models/Attendance.js';
import { inMemoryStore } from '../db.js';

const router = express.Router();

function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

// GET attendance for a specific date, category, and subject
router.get('/', async (req, res) => {
  try {
    const { date, category, subject } = req.query;

    if (!date || !category) {
      return res.status(400).json({ success: false, error: 'date and category query parameters are required.' });
    }

    if (isMongoConnected()) {
      const query = { date, category };
      if (subject) query.subject = subject;

      const record = await Attendance.findOne(query).sort({ updatedAt: -1 });
      return res.json({ success: true, source: 'mongodb', data: record });
    } else {
      // In-memory
      const record = inMemoryStore.attendance.find(a => 
        a.date === date && a.category === category && (!subject || a.subject === subject)
      );
      return res.json({ success: true, source: 'in-memory', data: record || null });
    }
  } catch (err) {
    console.error('Error fetching attendance:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST save / upsert attendance session
router.post('/', async (req, res) => {
  try {
    const { date, category, subject, faculty, sessionTime, maxScore, records } = req.body;

    if (!date || !category || !subject || !records || !Array.isArray(records)) {
      return res.status(400).json({ success: false, error: 'date, category, subject, and records are required.' });
    }

    const totalStudents = records.length;
    const presentCount = records.filter(r => r.present === true).length;
    const absentCount = totalStudents - presentCount;

    const payload = {
      date,
      category,
      subject,
      faculty: faculty || 'Faculty',
      sessionTime: sessionTime || '09:00',
      maxScore: Number(maxScore) || 100,
      totalStudents,
      presentCount,
      absentCount,
      records: records.map(r => ({
        studentId: r.studentId || r._id,
        rollNo: r.rollNo || r.roll,
        name: r.name,
        stream: r.stream,
        type: r.type || r.hostel || 'LOCAL',
        phone: r.phone,
        present: Boolean(r.present),
        score: Number(r.score) || 0,
        maxScore: Number(r.maxScore) || Number(maxScore) || 100
      }))
    };

    if (isMongoConnected()) {
      const updated = await Attendance.findOneAndUpdate(
        { date, category, subject },
        { $set: payload },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      return res.json({ success: true, message: 'Attendance saved successfully to MongoDB.', data: updated });
    } else {
      // In-memory upsert
      const idx = inMemoryStore.attendance.findIndex(a => 
        a.date === date && a.category === category && a.subject === subject
      );
      if (idx !== -1) {
        inMemoryStore.attendance[idx] = { ...inMemoryStore.attendance[idx], ...payload, updatedAt: new Date() };
        return res.json({ success: true, message: 'Attendance updated in memory store.', data: inMemoryStore.attendance[idx] });
      } else {
        const item = { _id: `mem_att_${Date.now()}`, ...payload, createdAt: new Date(), updatedAt: new Date() };
        inMemoryStore.attendance.push(item);
        return res.json({ success: true, message: 'Attendance saved to memory store.', data: item });
      }
    }
  } catch (err) {
    console.error('Error saving attendance:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET attendance history by date range
router.get('/history', async (req, res) => {
  try {
    const { category, startDate, endDate, month } = req.query;

    if (!category) {
      return res.status(400).json({ success: false, error: 'category is required.' });
    }

    if (isMongoConnected()) {
      let filter = { category };
      if (month) {
        // e.g. "2026-11"
        filter.date = { $regex: `^${month}` };
      } else if (startDate && endDate) {
        filter.date = { $gte: startDate, $lte: endDate };
      }

      const sessions = await Attendance.find(filter).sort({ date: 1 });
      return res.json({ success: true, count: sessions.length, data: sessions });
    } else {
      let list = inMemoryStore.attendance.filter(a => a.category === category);
      if (month) {
        list = list.filter(a => a.date && a.date.startsWith(month));
      } else if (startDate && endDate) {
        list = list.filter(a => a.date >= startDate && a.date <= endDate);
      }
      return res.json({ success: true, count: list.length, data: list });
    }
  } catch (err) {
    console.error('Error fetching attendance history:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

