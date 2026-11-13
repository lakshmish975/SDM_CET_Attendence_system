import express from 'express';
import mongoose from 'mongoose';
import Student from '../models/Student.js';
import { inMemoryStore } from '../db.js';

const router = express.Router();

function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

// GET all students (optionally filtered by category)
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;

    if (isMongoConnected()) {
      let filter = { isActive: true };
      if (category) filter.category = category;
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { rollNo: { $regex: search, $options: 'i' } }
        ];
      }
      const students = await Student.find(filter).sort({ slNo: 1, rollNo: 1 });
      return res.json({ success: true, count: students.length, source: 'mongodb', data: students });
    } else {
      // In-memory fallback
      let list = inMemoryStore.students.filter(s => s.isActive !== false);
      if (category) {
        list = list.filter(s => s.category === category);
      }
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(s => s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q));
      }
      return res.json({ success: true, count: list.length, source: 'in-memory', data: list });
    }
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create a new student
router.post('/', async (req, res) => {
  try {
    const { rollNo, name, category, stream, type, phone } = req.body;
    if (!rollNo || !name || !category || !phone) {
      return res.status(400).json({ success: false, error: 'rollNo, name, category, and phone are required.' });
    }

    const puc = category.startsWith('II') ? 'II PUC' : 'I PUC';
    const computedStream = stream || (category.includes('CET') ? 'CET' : 'NEET');

    if (isMongoConnected()) {
      // Check existing roll in category
      const existing = await Student.findOne({ rollNo, category });
      if (existing) {
        return res.status(409).json({ success: false, error: `Student with roll ${rollNo} already exists in ${category}.` });
      }

      const totalInCat = await Student.countDocuments({ category });
      const newStudent = await Student.create({
        rollNo,
        name,
        category,
        puc,
        stream: computedStream,
        type: type || 'LOCAL',
        phone,
        slNo: totalInCat + 1,
        isActive: true
      });
      return res.status(201).json({ success: true, data: newStudent });
    } else {
      // In-memory
      const existing = inMemoryStore.students.find(s => s.rollNo === rollNo && s.category === category && s.isActive !== false);
      if (existing) {
        return res.status(409).json({ success: false, error: `Student with roll ${rollNo} already exists in ${category}.` });
      }

      const totalInCat = inMemoryStore.students.filter(s => s.category === category).length;
      const newStudent = {
        _id: `mem_${category}_${Date.now()}`,
        rollNo,
        name,
        category,
        puc,
        stream: computedStream,
        type: type || 'LOCAL',
        phone,
        slNo: totalInCat + 1,
        isActive: true
      };
      inMemoryStore.students.push(newStudent);
      return res.status(201).json({ success: true, data: newStudent });
    }
  } catch (err) {
    console.error('Error creating student:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single student by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected() && mongoose.Types.ObjectId.isValid(id)) {
      const student = await Student.findById(id);
      if (!student) {
        return res.status(404).json({ success: false, error: 'Student not found.' });
      }
      return res.json({ success: true, data: student });
    } else {
      const student = inMemoryStore.students.find(s => s._id === id || s.rollNo === id);
      if (!student) {
        return res.status(404).json({ success: false, error: 'Student not found in memory store.' });
      }
      return res.json({ success: true, data: student });
    }
  } catch (err) {
    console.error('Error fetching student:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update existing student
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rollNo, name, stream, type, phone, category } = req.body;

    if (isMongoConnected() && mongoose.Types.ObjectId.isValid(id)) {
      const updated = await Student.findByIdAndUpdate(
        id,
        { $set: { rollNo, name, stream, type, phone, ...(category && { category }) } },
        { new: true }
      );
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Student not found.' });
      }
      return res.json({ success: true, data: updated });
    } else {
      // In-memory
      const idx = inMemoryStore.students.findIndex(s => s._id === id || s.rollNo === id);
      if (idx === -1) {
        return res.status(404).json({ success: false, error: 'Student not found in memory store.' });
      }
      inMemoryStore.students[idx] = {
        ...inMemoryStore.students[idx],
        rollNo: rollNo || inMemoryStore.students[idx].rollNo,
        name: name || inMemoryStore.students[idx].name,
        stream: stream || inMemoryStore.students[idx].stream,
        type: type || inMemoryStore.students[idx].type,
        phone: phone || inMemoryStore.students[idx].phone,
        ...(category && { category })
      };
      return res.json({ success: true, data: inMemoryStore.students[idx] });
    }
  } catch (err) {
    console.error('Error updating student:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE student
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected() && mongoose.Types.ObjectId.isValid(id)) {
      const deleted = await Student.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Student not found.' });
      }
      return res.json({ success: true, message: 'Student removed successfully.', data: deleted });
    } else {
      const idx = inMemoryStore.students.findIndex(s => s._id === id || s.rollNo === id);
      if (idx === -1) {
        return res.status(404).json({ success: false, error: 'Student not found in memory store.' });
      }
      const removed = inMemoryStore.students.splice(idx, 1)[0];
      return res.json({ success: true, message: 'Student removed successfully.', data: removed });
    }
  } catch (err) {
    console.error('Error deleting student:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

