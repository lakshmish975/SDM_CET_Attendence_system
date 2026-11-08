import express from 'express';
import mongoose from 'mongoose';
import Student from '../models/Student.js';
import Attendance from '../models/Attendance.js';
import { inMemoryStore } from '../db.js';
import { generateDailyExcel, generateWeeklyExcel, generateMonthlyExcel } from '../services/excelService.js';

const router = express.Router();

function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

// 1. Export Daily Attendance Sheet
router.get('/excel/daily', async (req, res) => {
  try {
    const { date, category = 'IPUC_CET', subject = 'Physics', faculty = 'Faculty', sessionTime = '09:00', maxScore = 100 } = req.query;

    let records = [];

    // First check if an attendance session was saved for this date & category
    let existingSession = null;
    if (isMongoConnected()) {
      existingSession = await Attendance.findOne({ date, category, subject });
    } else {
      existingSession = inMemoryStore.attendance.find(a => a.date === date && a.category === category && a.subject === subject);
    }

    if (existingSession && existingSession.records && existingSession.records.length > 0) {
      records = existingSession.records;
    } else {
      // Fallback: fetch registered student roster for this category
      if (isMongoConnected()) {
        const students = await Student.find({ category, isActive: true }).sort({ slNo: 1, rollNo: 1 });
        records = students.map(s => ({
          rollNo: s.rollNo,
          name: s.name,
          stream: s.stream,
          type: s.type,
          phone: s.phone,
          present: true,
          score: 0,
          maxScore: Number(maxScore) || 100
        }));
      } else {
        records = inMemoryStore.students
          .filter(s => s.category === category && s.isActive !== false)
          .map(s => ({
            rollNo: s.rollNo,
            name: s.name,
            stream: s.stream,
            type: s.type,
            phone: s.phone,
            present: true,
            score: 0,
            maxScore: Number(maxScore) || 100
          }));
      }
    }

    const buffer = generateDailyExcel({
      date: date || new Date().toISOString().slice(0, 10),
      category,
      subject: existingSession ? existingSession.subject : subject,
      faculty: existingSession ? existingSession.faculty : faculty,
      sessionTime: existingSession ? existingSession.sessionTime : sessionTime,
      records,
      maxScore: Number(maxScore) || 100
    });

    const filename = `Attendance_Daily_${category}_${date || 'today'}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(buffer);
  } catch (err) {
    console.error('Error generating daily Excel:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Export Weekly Attendance Sheet
router.get('/excel/weekly', async (req, res) => {
  try {
    const { category = 'IPUC_CET', startDate, endDate } = req.query;

    // Default to last 7 days if not provided
    const today = new Date();
    const defaultEnd = today.toISOString().slice(0, 10);
    const prevWeek = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
    const defaultStart = prevWeek.toISOString().slice(0, 10);

    const weekStartDate = startDate || defaultStart;
    const weekEndDate = endDate || defaultEnd;

    let students = [];
    let sessions = [];

    if (isMongoConnected()) {
      students = await Student.find({ category, isActive: true }).sort({ slNo: 1, rollNo: 1 });
      sessions = await Attendance.find({
        category,
        date: { $gte: weekStartDate, $lte: weekEndDate }
      }).sort({ date: 1 });
    } else {
      students = inMemoryStore.students.filter(s => s.category === category && s.isActive !== false);
      sessions = inMemoryStore.attendance.filter(a =>
        a.category === category && a.date >= weekStartDate && a.date <= weekEndDate
      );
    }

    const buffer = generateWeeklyExcel({
      weekStartDate,
      weekEndDate,
      category,
      sessions,
      students
    });

    const filename = `Attendance_Weekly_${category}_${weekStartDate}_to_${weekEndDate}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(buffer);
  } catch (err) {
    console.error('Error generating weekly Excel:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Export Monthly Attendance Sheet
router.get('/excel/monthly', async (req, res) => {
  try {
    const { category = 'IPUC_CET', month } = req.query;
    // month format: YYYY-MM
    const currentMonth = month || new Date().toISOString().slice(0, 7);

    let students = [];
    let sessions = [];

    if (isMongoConnected()) {
      students = await Student.find({ category, isActive: true }).sort({ slNo: 1, rollNo: 1 });
      sessions = await Attendance.find({
        category,
        date: { $regex: `^${currentMonth}` }
      }).sort({ date: 1 });
    } else {
      students = inMemoryStore.students.filter(s => s.category === category && s.isActive !== false);
      sessions = inMemoryStore.attendance.filter(a =>
        a.category === category && a.date && a.date.startsWith(currentMonth)
      );
    }

    const buffer = generateMonthlyExcel({
      month: currentMonth,
      category,
      sessions,
      students
    });

    const filename = `Attendance_Monthly_${category}_${currentMonth}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(buffer);
  } catch (err) {
    console.error('Error generating monthly Excel:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Custom Direct Export from Client Payload (Immediate download with active UI edits!)
router.post('/excel/custom-daily', (req, res) => {
  try {
    const { date, category, subject, faculty, sessionTime, records, maxScore } = req.body;

    if (!records || !Array.isArray(records)) {
      return res.status(400).json({ success: false, error: 'records array is required.' });
    }

    const buffer = generateDailyExcel({
      date: date || new Date().toISOString().slice(0, 10),
      category: category || 'IPUC_CET',
      subject: subject || 'Physics',
      faculty: faculty || 'Faculty',
      sessionTime: sessionTime || '09:00',
      records,
      maxScore: Number(maxScore) || 100
    });

    const filename = `Attendance_Roster_${category || 'Batch'}_${date || 'date'}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(buffer);
  } catch (err) {
    console.error('Error exporting custom daily:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

