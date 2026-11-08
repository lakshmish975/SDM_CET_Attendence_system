import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Play, Pause, RotateCcw, CheckCircle, Clock, AlertTriangle, ExternalLink, Settings, MessageSquare } from 'lucide-react';

export default function WhatsAppAutoSendModal({
  isOpen,
  onClose,
  category,
  categoryTitle,
  students,
  date,
  subject,
  faculty,
  maxScore,
  showToast
}) {
  const [filterType, setFilterType] = useState('absent'); // 'absent', 'present', 'low_score', 'all'
  const [template, setTemplate] = useState(
    `Dear Parent,\nCoaching Progress Alert for {student_name} (Roll: {roll_no}) [{batch} - {subject}]:\n\n` +
    `📅 Date: {date}\n` +
    `👨‍🏫 Faculty: {faculty}\n` +
    `📌 Attendance: {status}\n` +
    `📝 Test Score: {score}/{max_score} ({pct}%)\n\n` +
    `Apex Coaching Academy`
  );
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [delaySeconds, setDelaySeconds] = useState(4);
  const [timerCountdown, setTimerCountdown] = useState(0);

  const timerRef = useRef(null);

  // Stop auto runner helper
  const stopAutoSend = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerCountdown(0);
  };

  // Format message text for a specific student
  const formatMessage = (student) => {
    const sc = student.score !== undefined ? Number(student.score) : 0;
    const mx = student.maxScore || maxScore || 100;
    const pct = mx > 0 ? ((sc / mx) * 100).toFixed(1) : 0;
    const statusText = student.present ? 'PRESENT ✅' : 'ABSENT ❌';

    return template
      .replace(/{student_name}/g, student.name)
      .replace(/{roll_no}/g, student.rollNo || student.roll)
      .replace(/{batch}/g, categoryTitle)
      .replace(/{subject}/g, subject)
      .replace(/{date}/g, date)
      .replace(/{faculty}/g, faculty || 'Faculty')
      .replace(/{status}/g, statusText)
      .replace(/{score}/g, String(sc))
      .replace(/{max_score}/g, String(mx))
      .replace(/{pct}/g, String(pct));
  };

  // Launch WhatsApp Web URL
  const sendStudentMessage = (index) => {
    const student = queue[index];
    if (!student) return;

    const rawPhone = String(student.phone).replace(/[^0-9]/g, '');
    const phone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
    const message = encodeURIComponent(formatMessage(student));
    const url = `https://web.whatsapp.com/send?phone=${phone}&text=${message}`;

    // Open WhatsApp Web in tab
    window.open(url, '_blank');

    // Update sent status
    setQueue(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], sent: true };
      return copy;
    });
  };

  // Initialize Queue when modal opens or filter changes
  useEffect(() => {
    if (!isOpen) {
      stopAutoSend();
      return;
    }

    let filtered = [];
    if (filterType === 'absent') {
      filtered = students.filter(s => !s.present);
    } else if (filterType === 'present') {
      filtered = students.filter(s => s.present);
    } else if (filterType === 'low_score') {
      filtered = students.filter(s => {
        const mx = s.maxScore || maxScore || 100;
        const sc = s.score !== undefined ? Number(s.score) : 0;
        const pct = mx > 0 ? (sc / mx) * 100 : 0;
        return pct < 50;
      });
    } else {
      filtered = [...students];
    }

    setQueue(
      filtered.map(s => ({
        ...s,
        selected: true,
        sent: false,
        skipped: false
      }))
    );
    setCurrentIndex(-1);
    setIsRunning(false);
  }, [isOpen, filterType, students]);

  // Handle Auto Runner Effect
  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    // Find next pending selected student
    const nextIdx = queue.findIndex((item, idx) => idx > currentIndex && item.selected && !item.sent && !item.skipped);
    if (nextIdx === -1) {
      // Completed queue
      setIsRunning(false);
      showToast('🎉 All selected WhatsApp messages have been dispatched!');
      return;
    }

    setTimerCountdown(delaySeconds);
    let secondsLeft = delaySeconds;

    timerRef.current = setInterval(() => {
      secondsLeft -= 1;
      setTimerCountdown(secondsLeft);

      if (secondsLeft <= 0) {
        clearInterval(timerRef.current);
        sendStudentMessage(nextIdx);
        setCurrentIndex(nextIdx);
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, currentIndex, queue, delaySeconds]);

  if (!isOpen) return null;

  // Send single on demand
  const handleSendSingle = (index) => {
    sendStudentMessage(index);
    showToast(`WhatsApp Web opened for ${queue[index].name}`);
  };

  const handleSkipSingle = (index) => {
    setQueue(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], skipped: true };
      return copy;
    });
  };

  const startAutoSend = () => {
    const hasPending = queue.some(s => s.selected && !s.sent && !s.skipped);
    if (!hasPending) {
      showToast('No pending students selected in the queue.');
      return;
    }
    setIsRunning(true);
    showToast(`Started Auto WhatsApp Web dispatch (${delaySeconds}s intervals)...`);
  };

  const resetQueue = () => {
    stopAutoSend();
    setQueue(prev => prev.map(s => ({ ...s, sent: false, skipped: false })));
    setCurrentIndex(-1);
    showToast('Queue reset to beginning.');
  };

  const toggleSelectAll = (checked) => {
    setQueue(prev => prev.map(s => ({ ...s, selected: checked })));
  };

  const toggleItemSelect = (index) => {
    setQueue(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], selected: !copy[index].selected };
      return copy;
    });
  };

  const sentCount = queue.filter(s => s.sent).length;
  const pendingCount = queue.filter(s => s.selected && !s.sent && !s.skipped).length;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-4 sm:p-5 flex justify-between items-center border-b border-emerald-800/40">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                Auto Send WhatsApp Web Broadcast
                <span className="text-[10px] bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Live Dispatcher
                </span>
              </h3>
              <p className="text-xs text-emerald-200/80">
                Direct parent alerts via WhatsApp Web ({categoryTitle})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 space-y-4 overflow-y-auto flex-grow custom-scrollbar">
          
          {/* Controls Bar: Filter, Delay, Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            {/* Target Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Target Recipient Filter
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-xl p-2.5 font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="absent">🚨 Absentees Only ({students.filter(s => !s.present).length} Students)</option>
                <option value="present">✅ Present Students Only ({students.filter(s => s.present).length} Students)</option>
                <option value="low_score">⚠️ Test Score &lt; 50%</option>
                <option value="all">👥 All Students ({students.length} Total)</option>
              </select>
            </div>

            {/* Delay Interval */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Dispatch Speed / Interval
              </label>
              <select
                value={delaySeconds}
                onChange={(e) => setDelaySeconds(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-xl p-2.5 font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value={3}>Fast (3 Seconds Delay)</option>
                <option value={4}>Recommended (4 Seconds Delay)</option>
                <option value={6}>Safe Pace (6 Seconds Delay)</option>
                <option value={8}>Gentle Pace (8 Seconds Delay)</option>
              </select>
            </div>

            {/* Progress Counters */}
            <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Queue Progress</p>
                <div className="flex items-baseline space-x-1.5 mt-0.5">
                  <span className="text-lg font-black text-emerald-600">{sentCount}</span>
                  <span className="text-xs text-slate-400 font-semibold">/ {queue.length} Sent</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-700 bg-white px-2 py-1 rounded-lg border border-slate-200">
                  {pendingCount} Pending
                </span>
              </div>
            </div>
          </div>

          {/* Collapsible Message Template Preview */}
          <details className="bg-slate-50 border border-slate-200/90 rounded-xl p-3 text-xs">
            <summary className="font-bold text-slate-700 cursor-pointer flex items-center justify-between">
              <span>Preview & Edit WhatsApp Message Template</span>
              <span className="text-[11px] text-emerald-600 font-semibold">Click to customize</span>
            </summary>
            <div className="mt-3 space-y-2">
              <textarea
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                rows={5}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-mono text-xs text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-slate-500">
                Variables: <code className="bg-slate-200 px-1 rounded">&#123;student_name&#125;</code>, <code className="bg-slate-200 px-1 rounded">&#123;roll_no&#125;</code>, <code className="bg-slate-200 px-1 rounded">&#123;status&#125;</code>, <code className="bg-slate-200 px-1 rounded">&#123;score&#125;</code>, <code className="bg-slate-200 px-1 rounded">&#123;max_score&#125;</code>, <code className="bg-slate-200 px-1 rounded">&#123;pct&#125;</code>, <code className="bg-slate-200 px-1 rounded">&#123;subject&#125;</code>
              </p>
            </div>
          </details>

          {/* Active Runner Banner */}
          {isRunning && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 flex items-center justify-between animate-pulse">
              <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Auto-Dispatcher Active: Launching next tab in {timerCountdown}s...</span>
              </div>
              <button
                onClick={stopAutoSend}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-1 rounded-lg transition"
              >
                Pause Auto-Dispatch
              </button>
            </div>
          )}

          {/* Recipient Queue Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-100 p-2.5 px-3 flex items-center justify-between text-xs font-bold text-slate-700 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={queue.length > 0 && queue.every(s => s.selected)}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Select All ({queue.length} Recipients)</span>
              </div>
              <button
                onClick={resetQueue}
                className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Statuses</span>
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto custom-scrollbar divide-y divide-slate-100">
              {queue.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No students match the selected filter.
                </div>
              ) : (
                queue.map((student, idx) => (
                  <div
                    key={student._id || student.id || student.rollNo}
                    className={`p-2.5 px-3 flex items-center justify-between text-xs transition ${
                      student.sent ? 'bg-emerald-50/60' : student.skipped ? 'bg-slate-100/60 opacity-60' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={student.selected}
                        onChange={() => toggleItemSelect(idx)}
                        disabled={student.sent}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <div className="font-bold text-slate-800 flex items-center gap-1.5">
                          <span>{student.name}</span>
                          <span className="text-[11px] font-mono text-slate-400">({student.rollNo || student.roll})</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                            student.present ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {student.present ? 'Present' : 'Absent'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Parent: +91 {student.phone} | Score: {student.score !== undefined ? student.score : 0}/{student.maxScore || maxScore || 100}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {student.sent ? (
                        <span className="inline-flex items-center space-x-1 text-emerald-700 font-bold bg-emerald-100 px-2 py-1 rounded-md text-[11px]">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Sent via Web</span>
                        </span>
                      ) : student.skipped ? (
                        <span className="text-slate-400 text-[11px] font-semibold">Skipped</span>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() => handleSendSingle(idx)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-2.5 py-1 rounded-lg text-[11px] flex items-center space-x-1 transition shadow-sm"
                            title="Open WhatsApp Web for this parent"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Send</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSkipSingle(idx)}
                            className="text-slate-400 hover:text-slate-600 p-1 text-[11px]"
                            title="Skip this student"
                          >
                            Skip
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer with Master Actions */}
        <div className="bg-slate-50 p-4 px-5 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            {isRunning ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Dispatched {sentCount} of {queue.length} parents
              </span>
            ) : (
              <span>Ready to dispatch {pendingCount} WhatsApp messages</span>
            )}
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition"
            >
              Close
            </button>

            {isRunning ? (
              <button
                type="button"
                onClick={stopAutoSend}
                className="flex-1 sm:flex-none px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition shadow-md flex items-center justify-center space-x-1.5"
              >
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </button>
            ) : (
              <button
                type="button"
                disabled={pendingCount === 0}
                onClick={startAutoSend}
                className="flex-1 sm:flex-none px-6 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-md flex items-center justify-center space-x-1.5 disabled:opacity-50"
              >
                <Play className="w-4 h-4" />
                <span>Start Auto-Send via WhatsApp Web</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

