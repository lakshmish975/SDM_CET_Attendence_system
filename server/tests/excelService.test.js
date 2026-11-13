import { describe, it, expect } from '@jest/globals';
import * as XLSX from 'xlsx';
import {
  generateDailyExcel,
  generateWeeklyExcel,
  generateMonthlyExcel
} from '../src/services/excelService.js';
import { getAllInitialStudents } from '../src/data/studentsData.js';

describe('Excel Export Service Suite', () => {
  const sampleStudents = getAllInitialStudents().slice(0, 10);

  it('should generate a valid Daily Attendance Excel file', () => {
    const records = sampleStudents.map((s, idx) => ({
      ...s,
      present: idx % 3 !== 0,
      score: 75 + idx,
      maxScore: 100
    }));

    const buffer = generateDailyExcel({
      date: '2026-11-13',
      category: 'IPUC_CET',
      subject: 'Physics',
      faculty: 'Dr. H. V. Rao',
      sessionTime: '10:00 AM',
      records,
      maxScore: 100
    });

    expect(buffer).toBeDefined();
    expect(Buffer.isBuffer(buffer)).toBe(true);
    expect(buffer.length).toBeGreaterThan(1000);

    // Read back workbook
    const wb = XLSX.read(buffer, { type: 'buffer' });
    expect(wb.SheetNames).toContain('Daily Roster');

    const ws = wb.Sheets['Daily Roster'];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
    expect(data.length).toBeGreaterThan(12);

    // Verify Title and Metadata
    expect(data[0][0]).toBe('APEX COACHING ACADEMY - CET & NEET STUDY CENTRE');
    expect(data[1][0]).toBe('DAILY ATTENDANCE & TEST PERFORMANCE REPORT');
  });

  it('should generate a valid Weekly Attendance Excel file', () => {
    const sessions = [
      {
        date: '2026-11-09',
        subject: 'Physics',
        records: sampleStudents.map((s, idx) => ({
          rollNo: s.rollNo,
          name: s.name,
          present: idx % 2 === 0,
          score: 80
        }))
      },
      {
        date: '2026-11-10',
        subject: 'Chemistry',
        records: sampleStudents.map((s, idx) => ({
          rollNo: s.rollNo,
          name: s.name,
          present: true,
          score: 85
        }))
      }
    ];

    const buffer = generateWeeklyExcel({
      weekStartDate: '2026-11-09',
      weekEndDate: '2026-11-15',
      category: 'IPUC_CET',
      sessions,
      students: sampleStudents
    });

    expect(buffer).toBeDefined();
    expect(Buffer.isBuffer(buffer)).toBe(true);

    const wb = XLSX.read(buffer, { type: 'buffer' });
    expect(wb.SheetNames).toContain('Weekly Sheet');

    const ws = wb.Sheets['Weekly Sheet'];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
    expect(data.length).toBeGreaterThan(6);
  });

  it('should generate a valid Monthly Register Excel file', () => {
    const sessions = [
      {
        date: '2026-11-02',
        subject: 'Physics',
        records: sampleStudents.map((s) => ({
          rollNo: s.rollNo,
          present: true,
          score: 90
        }))
      },
      {
        date: '2026-11-03',
        subject: 'Mathematics',
        records: sampleStudents.map((s, idx) => ({
          rollNo: s.rollNo,
          present: idx !== 0,
          score: 70
        }))
      }
    ];

    const buffer = generateMonthlyExcel({
      month: '2026-11',
      category: 'IPUC_CET',
      sessions,
      students: sampleStudents
    });

    expect(buffer).toBeDefined();
    expect(Buffer.isBuffer(buffer)).toBe(true);

    const wb = XLSX.read(buffer, { type: 'buffer' });
    expect(wb.SheetNames).toContain('Monthly Register');

    const ws = wb.Sheets['Monthly Register'];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
    expect(data.length).toBeGreaterThan(6);
  });
});
