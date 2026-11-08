import React, { useState } from 'react';
import { X, FileSpreadsheet, Download, Calendar, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function ExcelExportModal({
  isOpen,
  onClose,
  category,
  categoryTitle,
  students,
  date,
  sessionTime,
  subject,
  faculty,
  maxScore,
  showToast
}) {
  const [exportType, setExportType] = useState('daily'); // 'daily', 'weekly', 'monthly', 'custom'
  const [selectedMonth, setSelectedMonth] = useState(date.slice(0, 7) || new Date().toISOString().slice(0, 7));
  const [weeklyStart, setWeeklyStart] = useState(() => {
    const d = new Date(date || new Date());
    d.setDate(d.getDate() - 6);
    return d.toISOString().slice(0, 10);
  });
  const [weeklyEnd, setWeeklyEnd] = useState(date || new Date().toISOString().slice(0, 10));
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  // Direct client-side Instant Daily Export
  const handleClientSideDailyExport = () => {
    try {
      setIsExporting(true);
      const totalStudents = students.length;
      const presentCount = students.filter(s => s.present).length;
      const absentCount = totalStudents - presentCount;
      const attRate = totalStudents > 0 ? ((presentCount / totalStudents) * 100).toFixed(1) + '%' : '0%';

      const meta = [
        ['APEX COACHING ACADEMY - CET & NEET STUDY CENTRE'],
        ['DAILY ATTENDANCE & TEST MARKS REPORT'],
        [''],
        ['Batch / Category:', categoryTitle, 'Date:', date],
        ['Subject:', subject, 'Faculty:', faculty || 'N/A'],
        ['Session Time:', sessionTime || '09:00 AM', 'Default Max Score:', maxScore],
        ['Total Students:', totalStudents, 'Present:', presentCount],
        ['Absent:', absentCount, 'Attendance Rate:', attRate],
        ['Generated At:', new Date().toLocaleString()],
        [''],
        ['SL No', 'Roll No', 'Student Name', 'Stream', 'Hostel / Local', 'Parent Mobile', 'Attendance', 'Score', 'Max Score', 'Percentage (%)', 'Status']
      ];

      const rows = students.map((s, idx) => {
        const sc = s.score !== undefined ? Number(s.score) : 0;
        const mx = s.maxScore || maxScore || 100;
        const pct = mx > 0 ? ((sc / mx) * 100).toFixed(1) : 0;
        return [
          idx + 1,
          s.rollNo || s.roll,
          s.name,
          s.stream,
          s.type || s.hostel || 'LOCAL',
          `+91 ${s.phone}`,
          s.present ? 'PRESENT' : 'ABSENT',
          s.present ? sc : 0,
          mx,
          `${pct}%`,
          s.present ? (pct >= 75 ? 'Distinction' : pct >= 40 ? 'Pass' : 'Low Score') : 'Absent'
        ];
      });

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet([...meta, ...rows]);
      ws['!cols'] = [
        { wch: 8 }, { wch: 14 }, { wch: 28 }, { wch: 10 }, { wch: 16 }, { wch: 16 }, { wch: 14 }, { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 18 }
      ];
      XLSX.utils.book_append_sheet(wb, ws, 'Daily Roster');
      XLSX.writeFile(wb, `Attendance_Daily_${category}_${date}.xlsx`);

      showToast(`Daily Excel sheet downloaded for ${categoryTitle}!`);
      setIsExporting(false);
      onClose();
    } catch (err) {
      console.error(err);
      showToast('Error exporting daily Excel: ' + err.message);
      setIsExporting(false);
    }
  };

  // Backend API Export (for historical aggregation or server-side formats)
  const handleApiExport = async () => {
    try {
      setIsExporting(true);
      let url = '';
      let filename = '';

      if (exportType === 'daily') {
        url = `/api/export/excel/daily?date=${date}&category=${category}&subject=${encodeURIComponent(subject)}&faculty=${encodeURIComponent(faculty || '')}&sessionTime=${encodeURIComponent(sessionTime || '')}&maxScore=${maxScore}`;
        filename = `Attendance_Daily_${category}_${date}.xlsx`;
      } else if (exportType === 'weekly') {
        url = `/api/export/excel/weekly?category=${category}&startDate=${weeklyStart}&endDate=${weeklyEnd}`;
        filename = `Attendance_Weekly_${category}_${weeklyStart}_to_${weeklyEnd}.xlsx`;
      } else if (exportType === 'monthly') {
        url = `/api/export/excel/monthly?category=${category}&month=${selectedMonth}`;
        filename = `Attendance_Monthly_${category}_${selectedMonth}.xlsx`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Server export request failed. Falling back to immediate export.');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);

      showToast(`Excel file downloaded successfully: ${filename}`);
      setIsExporting(false);
      onClose();
    } catch (err) {
      console.warn('API export issue, triggering direct export:', err.message);
      // Fallback to client-side immediate generation
      handleClientSideDailyExport();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-5 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-300">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                Export Attendance Excel
              </h3>
              <p className="text-xs text-emerald-200/80">Batch: {categoryTitle} ({students.length} Students)</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white p-1 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Export Mode Selection Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Extraction Frequency
            </label>
            <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-xl">
              <button
                type="button"
                onClick={() => setExportType('daily')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                  exportType === 'daily'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Daily Sheet</span>
              </button>

              <button
                type="button"
                onClick={() => setExportType('weekly')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                  exportType === 'weekly'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Weekly Sheet</span>
              </button>

              <button
                type="button"
                onClick={() => setExportType('monthly')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                  exportType === 'monthly'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Monthly Sheet</span>
              </button>
            </div>
          </div>

          {/* Conditional Controls based on Export Type */}
          {exportType === 'daily' && (
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Daily Attendance & Marks Scorecard</span>
              </div>
              <p className="text-xs text-slate-600">
                Exports the complete student list with their present/absent status, test marks, percentages, faculty name, and custom academic remarks for <strong>{date}</strong>.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-slate-600">
                <div><span className="font-semibold text-slate-700">Subject:</span> {subject}</div>
                <div><span className="font-semibold text-slate-700">Faculty:</span> {faculty || 'N/A'}</div>
                <div><span className="font-semibold text-slate-700">Date:</span> {date}</div>
                <div><span className="font-semibold text-slate-700">Roster Count:</span> {students.length} Students</div>
              </div>
            </div>
          )}

          {exportType === 'weekly' && (
            <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-4 space-y-3">
              <div className="flex items-center space-x-2 text-blue-800 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Weekly Attendance Consolidation Matrix</span>
              </div>
              <p className="text-xs text-slate-600">
                Generates a multi-day attendance matrix with individual days (Mon-Sat), total classes attended, overall weekly attendance %, and average test marks.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={weeklyStart}
                    onChange={(e) => setWeeklyStart(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">End Date</label>
                  <input
                    type="date"
                    value={weeklyEnd}
                    onChange={(e) => setWeeklyEnd(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {exportType === 'monthly' && (
            <div className="bg-purple-50/70 border border-purple-200/80 rounded-xl p-4 space-y-3">
              <div className="flex items-center space-x-2 text-purple-800 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                <span>Monthly Master Attendance Register (30/31 Days)</span>
              </div>
              <p className="text-xs text-slate-600">
                Extracts the full calendar month grid with day-by-day (D1 to D31) attendance marks, total Present count, total Absent count, monthly attendance %, and shortage alerts.
              </p>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Select Month & Year</label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleClientSideDailyExport}
                className="px-3.5 py-2 text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition flex items-center space-x-1.5"
                title="Instant client-side export with current on-screen edits"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant Export</span>
              </button>

              <button
                type="button"
                disabled={isExporting}
                onClick={handleApiExport}
                className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition shadow-md flex items-center space-x-1.5 disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>{isExporting ? 'Generating Excel...' : `Download ${exportType.toUpperCase()} Sheet`}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
