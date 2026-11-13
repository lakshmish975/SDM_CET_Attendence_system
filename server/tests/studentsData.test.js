import { describe, it, expect } from '@jest/globals';
import {
  getAllInitialStudents,
  rawIPUCData,
  rawIIPUCData,
  defaultGroupLinks,
  defaultSubjectFaculties
} from '../src/data/studentsData.js';

describe('Students Data Repository & Dataset Integrity', () => {
  it('should return exactly 165 total students across all categories', () => {
    const students = getAllInitialStudents();
    expect(students).toBeDefined();
    expect(Array.isArray(students)).toBe(true);
    expect(students.length).toBe(165);
  });

  it('should correctly partition students by category', () => {
    const students = getAllInitialStudents();
    
    const ipucCet = students.filter(s => s.category === 'IPUC_CET');
    const ipucNeet = students.filter(s => s.category === 'IPUC_NEET');
    const iipucCet = students.filter(s => s.category === 'IIPUC_CET');
    const iipucNeet = students.filter(s => s.category === 'IIPUC_NEET');

    expect(ipucCet.length).toBe(24);
    expect(ipucNeet.length).toBe(56);
    expect(iipucCet.length).toBe(41);
    expect(iipucNeet.length).toBe(44);

    expect(ipucCet.length + ipucNeet.length + iipucCet.length + iipucNeet.length).toBe(165);
  });

  it('should verify all students have valid properties', () => {
    const students = getAllInitialStudents();

    students.forEach((s) => {
      expect(typeof s.name).toBe('string');
      expect(s.name.trim().length).toBeGreaterThan(0);

      expect(typeof s.rollNo).toBe('string');
      expect(s.rollNo.trim().length).toBeGreaterThan(0);

      expect(['I PUC', 'II PUC']).toContain(s.puc);
      expect(['CET', 'NEET']).toContain(s.stream);
      expect(['IPUC_CET', 'IPUC_NEET', 'IIPUC_CET', 'IIPUC_NEET']).toContain(s.category);

      expect(typeof s.phone).toBe('string');
      expect(s.phone.length).toBe(10);
      expect(/^\d+$/.test(s.phone)).toBe(true);

      expect(typeof s.type).toBe('string');
      expect(s.isActive).toBe(true);
      expect(typeof s.slNo).toBe('number');
    });
  });

  it('should have unique roll numbers within each category', () => {
    const students = getAllInitialStudents();
    const categories = ['IPUC_CET', 'IPUC_NEET', 'IIPUC_CET', 'IIPUC_NEET'];

    categories.forEach(cat => {
      const catStudents = students.filter(s => s.category === cat);
      const rollSet = new Set(catStudents.map(s => s.rollNo));
      expect(rollSet.size).toBe(catStudents.length);
    });
  });

  it('should contain default group links for all 4 batches', () => {
    expect(defaultGroupLinks).toBeDefined();
    const keys = [
      'IPUC_CET_ABSENT', 'IPUC_CET_MARKS',
      'IPUC_NEET_ABSENT', 'IPUC_NEET_MARKS',
      'IIPUC_CET_ABSENT', 'IIPUC_CET_MARKS',
      'IIPUC_NEET_ABSENT', 'IIPUC_NEET_MARKS'
    ];
    keys.forEach(k => {
      expect(defaultGroupLinks[k]).toBeDefined();
      expect(defaultGroupLinks[k].startsWith('http')).toBe(true);
    });
  });

  it('should contain default subject faculties for Core CET & NEET subjects', () => {
    expect(defaultSubjectFaculties).toBeDefined();
    expect(defaultSubjectFaculties.Physics).toBe('Dr. H. V. Rao');
    expect(defaultSubjectFaculties.Chemistry).toBe('Prof. Suresh Kumar');
    expect(defaultSubjectFaculties.Mathematics).toBe('Dr. Ananya Sharma');
    expect(defaultSubjectFaculties.Biology).toBe('Dr. Rajesh Hegde');
  });
});
