import * as XLSX from 'xlsx';

/**
 * Generate a Daily Attendance & Marks Excel Workbook
 */
export function generateDailyExcel({ date, category, subject, faculty, sessionTime, records, maxScore = 100 }) {
  const wb = XLSX.utils.book_new();

  const totalStudents = records.length;
  const presentCount = records.filter(r => r.present).length;
  const absentCount = totalStudents - presentCount;
  const attendanceRate = totalStudents > 0 ? ((presentCount / totalStudents) * 100).toFixed(1) + '%' : '0%';

  const totalScores = records.filter(r => r.present).reduce((sum, r) => sum + (Number(r.score) || 0), 0);
  const avgScore = presentCount > 0 ? (totalScores / presentCount).toFixed(1) : 0;

  // Header & Metadata Rows
  const metaData = [
    ['APEX COACHING ACADEMY - CET & NEET STUDY CENTRE'],
    ['DAILY ATTENDANCE & TEST PERFORMANCE REPORT'],
    [''],
    ['Category / Batch:', category.replace('_', ' '), 'Date:', date],
    ['Subject:', subject, 'Session Time:', sessionTime || '09:00 AM'],
    ['Faculty In-Charge:', faculty || 'N/A', 'Default Max Score:', maxScore],
    [''],
    ['--- SUMMARY STATS ---'],
    ['Total Enrolled:', totalStudents, 'Present:', presentCount],
    ['Absent:', absentCount, 'Attendance Rate:', attendanceRate],
    ['Batch Average Score:', `${avgScore} / ${maxScore}`, 'Report Generated At:', new Date().toLocaleString()],
    [''],
    [
      'SL No',
      'Roll Number',
      'Student Name',
      'Stream',
      'Hostel / Local',
      'Parent Mobile',
      'Attendance Status',
      'Score Obtained',
      'Max Score',
      'Percentage (%)',
      'Academic Remarks'
    ]
  ];

  // Student Rows
  const studentRows = records.map((s, idx) => {
    const studentScore = s.score !== undefined ? Number(s.score) : 0;
    const studentMax = s.maxScore || maxScore || 100;
    const pct = studentMax > 0 ? ((studentScore / studentMax) * 100).toFixed(1) : 0;

    let remark = 'Absent';
    if (s.present) {
      if (pct >= 85) remark = 'Outstanding';
      else if (pct >= 70) remark = 'Good';
      else if (pct >= 50) remark = 'Average';
      else remark = 'Needs Remedial Attention';
    }

    return [
      idx + 1,
      s.rollNo || s.roll,
      s.name,
      s.stream,
      s.type || s.hostel || 'Local',
      `+91 ${s.phone}`,
      s.present ? 'PRESENT' : 'ABSENT',
      s.present ? studentScore : 0,
      studentMax,
      `${pct}%`,
      remark
    ];
  });

  const fullSheetData = [...metaData, ...studentRows];
  const ws = XLSX.utils.aoa_to_sheet(fullSheetData);

  // Column widths
  ws['!cols'] = [
    { wch: 8 },  // SL No
    { wch: 14 }, // Roll
    { wch: 28 }, // Name
    { wch: 10 }, // Stream
    { wch: 16 }, // Hostel
    { wch: 16 }, // Mobile
    { wch: 18 }, // Attendance
    { wch: 16 }, // Score
    { wch: 12 }, // Max Score
    { wch: 15 }, // Pct
    { wch: 24 }  // Remarks
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Daily Roster');
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

/**
 * Generate a Weekly Attendance Sheet Excel Workbook
 */
export function generateWeeklyExcel({ weekStartDate, weekEndDate, category, sessions, students }) {
  const wb = XLSX.utils.book_new();

  // Extract distinct dates or use Monday to Saturday
  const dates = [...new Set(sessions.map(s => s.date))].sort();

  const titleRows = [
    ['APEX COACHING ACADEMY - CET & NEET STUDY CENTRE'],
    ['WEEKLY ATTENDANCE CONSOLIDATION SHEET'],
    [''],
    ['Category / Batch:', category.replace('_', ' '), 'Period:', `${weekStartDate} to ${weekEndDate}`],
    ['Total Recorded Sessions:', sessions.length, 'Generated On:', new Date().toLocaleString()],
    ['']
  ];

  // Build Table Header
  const tableHeader = [
    'SL No',
    'Roll No',
    'Student Name',
    'Stream',
    'Hostel',
    'Parent Mobile'
  ];

  // Add date columns
  if (dates.length > 0) {
    dates.forEach(d => {
      tableHeader.push(`${d} Attd`);
      tableHeader.push(`${d} Score`);
    });
  } else {
    tableHeader.push('No Sessions Recorded for this week');
  }

  tableHeader.push('Total Present');
  tableHeader.push('Total Sessions');
  tableHeader.push('Attendance %');
  tableHeader.push('Avg Score');
  tableHeader.push('Weekly Performance');

  // Build rows for each student
  const studentRows = students.map((st, idx) => {
    let presentDays = 0;
    let totalScore = 0;
    let scoredSessions = 0;

    const row = [
      idx + 1,
      st.rollNo || st.roll,
      st.name,
      st.stream,
      st.type || st.hostel || 'Local',
      `+91 ${st.phone}`
    ];

    if (dates.length > 0) {
      dates.forEach(d => {
        // Find session for this date
        const sess = sessions.find(s => s.date === d);
        if (sess) {
          const rec = sess.records.find(r => r.rollNo === st.rollNo || r.roll === st.rollNo);
          if (rec) {
            row.push(rec.present ? 'P' : 'A');
            row.push(rec.present ? (rec.score !== undefined ? rec.score : '-') : 'ABS');
            if (rec.present) {
              presentDays++;
              if (rec.score !== undefined) {
                totalScore += Number(rec.score);
                scoredSessions++;
              }
            }
          } else {
            row.push('-');
            row.push('-');
          }
        } else {
          row.push('-');
          row.push('-');
        }
      });
    } else {
      row.push('-');
    }

    const totalSessions = dates.length;
    const attPct = totalSessions > 0 ? ((presentDays / totalSessions) * 100).toFixed(1) : '100.0';
    const avgScore = scoredSessions > 0 ? (totalScore / scoredSessions).toFixed(1) : '-';

    let perf = 'Regular';
    if (parseFloat(attPct) < 75) perf = 'Low Attendance Alert';
    else if (avgScore !== '-' && parseFloat(avgScore) >= 80) perf = 'Top Performer';

    row.push(presentDays);
    row.push(totalSessions);
    row.push(`${attPct}%`);
    row.push(avgScore);
    row.push(perf);

    return row;
  });

  const fullSheetData = [...titleRows, tableHeader, ...studentRows];
  const ws = XLSX.utils.aoa_to_sheet(fullSheetData);

  ws['!cols'] = [
    { wch: 8 },  // SL
    { wch: 14 }, // Roll
    { wch: 28 }, // Name
    { wch: 10 }, // Stream
    { wch: 16 }, // Hostel
    { wch: 16 }, // Phone
    ...Array(dates.length * 2).fill({ wch: 12 }),
    { wch: 14 }, // Total Present
    { wch: 14 }, // Total Sessions
    { wch: 14 }, // Att %
    { wch: 14 }, // Avg Score
    { wch: 22 }  // Performance
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Weekly Sheet');
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

/**
 * Generate a Monthly Attendance Sheet Excel Workbook
 */
export function generateMonthlyExcel({ month, category, sessions, students }) {
  const wb = XLSX.utils.book_new();

  // Extract month year details e.g. "2026-11"
  const [yearStr, monthStr] = (month || new Date().toISOString().slice(0, 7)).split('-');
  const year = parseInt(yearStr, 10);
  const monthNum = parseInt(monthStr, 10);

  // Total days in month
  const daysInMonth = new Date(year, monthNum, 0).getDate();
  const dayNumbers = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const titleRows = [
    ['APEX COACHING ACADEMY - CET & NEET STUDY CENTRE'],
    ['MONTHLY MASTER ATTENDANCE REGISTER'],
    [''],
    ['Category / Batch:', category.replace('_', ' '), 'Month / Year:', `${monthStr}/${year}`],
    ['Total Registered Students:', students.length, 'Generated On:', new Date().toLocaleString()],
    ['']
  ];

  // Header: SL, Roll, Name, Stream, Hostel, Days 1..31, Total P, Total A, % Pct, Status
  const tableHeader = [
    'SL No',
    'Roll No',
    'Student Name',
    'Stream',
    'Hostel',
    'Phone',
    ...dayNumbers.map(d => `D${d}`),
    'Total Present (P)',
    'Total Absent (A)',
    'Total Days',
    'Attendance %',
    'Monthly Status'
  ];

  // Map sessions by date day number e.g. { "2026-11-05": session }
  const sessionByDay = {};
  sessions.forEach(sess => {
    if (sess.date && sess.date.startsWith(`${yearStr}-${monthStr}`)) {
      const day = parseInt(sess.date.split('-')[2], 10);
      sessionByDay[day] = sess;
    }
  });

  const studentRows = students.map((st, idx) => {
    let presentCount = 0;
    let absentCount = 0;

    const row = [
      idx + 1,
      st.rollNo || st.roll,
      st.name,
      st.stream,
      st.type || st.hostel || 'Local',
      `+91 ${st.phone}`
    ];

    dayNumbers.forEach(d => {
      const sess = sessionByDay[d];
      if (sess) {
        const rec = sess.records.find(r => r.rollNo === st.rollNo || r.roll === st.rollNo);
        if (rec) {
          if (rec.present) {
            row.push('P');
            presentCount++;
          } else {
            row.push('A');
            absentCount++;
          }
        } else {
          row.push('-');
        }
      } else {
        // No class on this day or weekend / not logged
        row.push('-');
      }
    });

    const recordedDays = presentCount + absentCount;
    const pct = recordedDays > 0 ? ((presentCount / recordedDays) * 100).toFixed(1) : '100.0';

    let status = 'Regular';
    if (recordedDays > 0 && parseFloat(pct) < 75) {
      status = 'Shortage Alert (<75%)';
    } else if (recordedDays > 0 && parseFloat(pct) === 100) {
      status = '100% Full Attendance';
    }

    row.push(presentCount);
    row.push(absentCount);
    row.push(recordedDays);
    row.push(`${pct}%`);
    row.push(status);

    return row;
  });

  const fullSheetData = [...titleRows, tableHeader, ...studentRows];
  const ws = XLSX.utils.aoa_to_sheet(fullSheetData);

  ws['!cols'] = [
    { wch: 8 },  // SL
    { wch: 14 }, // Roll
    { wch: 28 }, // Name
    { wch: 10 }, // Stream
    { wch: 16 }, // Hostel
    { wch: 16 }, // Phone
    ...dayNumbers.map(() => ({ wch: 5 })),
    { wch: 16 }, // P
    { wch: 16 }, // A
    { wch: 14 }, // Total
    { wch: 14 }, // %
    { wch: 24 }  // Status
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Monthly Register');
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}
