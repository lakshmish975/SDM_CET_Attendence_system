import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  Stethoscope,
  Award,
  Activity,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  UserPlus,
  Send,
  Share2,
  FileSpreadsheet,
  Settings,
  Database,
  Save,
  MessageSquare,
  Smartphone,
  Edit,
  Trash2,
  Sparkles,
  ExternalLink
} from 'lucide-react';

import { defaultFourGroupRosters, defaultGroupLinks } from './data/defaultStudents.js';
import ExcelExportModal from './components/ExcelExportModal.jsx';
import WhatsAppAutoSendModal from './components/WhatsAppAutoSendModal.jsx';
import DatabaseConfigModal from './components/DatabaseConfigModal.jsx';
import GroupConfigModal from './components/GroupConfigModal.jsx';
import StudentModal from './components/StudentModal.jsx';

const categoryThemes = {
  IPUC_CET: {
    title: "I PUC CET",
    subtitle: "Engineering Stream Roster & Daily Tracker",
    badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-300",
    heroBg: "bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 border-emerald-700/60 text-white",
    heroIconBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    logoBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
    activeTabBg: "bg-emerald-600 text-white shadow-md",
    btnAbsent: "bg-emerald-700 hover:bg-emerald-600 border-emerald-500",
    btnMarks: "bg-emerald-600 hover:bg-emerald-500 border-emerald-400",
    btnMarksBroadcast: "bg-emerald-600 hover:bg-emerald-700",
    statBox: "bg-emerald-50 text-emerald-600 border-emerald-100",
    accentText: "text-emerald-600",
    icon: BookOpen
  },
  IPUC_NEET: {
    title: "I PUC NEET",
    subtitle: "Medical Stream Roster & Daily Tracker",
    badgeBg: "bg-teal-100 text-teal-800 border-teal-300",
    heroBg: "bg-gradient-to-r from-teal-950 via-cyan-950 to-slate-900 border-teal-700/60 text-white",
    heroIconBg: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    logoBg: "bg-gradient-to-br from-teal-500 to-cyan-600",
    activeTabBg: "bg-teal-600 text-white shadow-md",
    btnAbsent: "bg-teal-700 hover:bg-teal-600 border-teal-500",
    btnMarks: "bg-teal-600 hover:bg-teal-500 border-teal-400",
    btnMarksBroadcast: "bg-teal-600 hover:bg-teal-700",
    statBox: "bg-teal-50 text-teal-600 border-teal-100",
    accentText: "text-teal-600",
    icon: Stethoscope
  },
  IIPUC_CET: {
    title: "II PUC CET",
    subtitle: "Senior Engineering Stream Roster & Daily Tracker",
    badgeBg: "bg-blue-100 text-blue-800 border-blue-300",
    heroBg: "bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 border-blue-700/60 text-white",
    heroIconBg: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    logoBg: "bg-gradient-to-br from-blue-600 to-indigo-600",
    activeTabBg: "bg-blue-600 text-white shadow-md",
    btnAbsent: "bg-blue-700 hover:bg-blue-600 border-blue-500",
    btnMarks: "bg-blue-600 hover:bg-blue-500 border-blue-400",
    btnMarksBroadcast: "bg-blue-600 hover:bg-blue-700",
    statBox: "bg-blue-50 text-blue-600 border-blue-100",
    accentText: "text-blue-600",
    icon: Award
  },
  IIPUC_NEET: {
    title: "II PUC NEET",
    subtitle: "Senior Medical Stream Roster & Daily Tracker",
    badgeBg: "bg-purple-100 text-purple-800 border-purple-300",
    heroBg: "bg-gradient-to-r from-purple-950 via-violet-950 to-slate-900 border-purple-700/60 text-white",
    heroIconBg: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    logoBg: "bg-gradient-to-br from-purple-600 to-violet-600",
    activeTabBg: "bg-purple-600 text-white shadow-md",
    btnAbsent: "bg-purple-700 hover:bg-purple-600 border-purple-500",
    btnMarks: "bg-purple-600 hover:bg-purple-500 border-purple-400",
    btnMarksBroadcast: "bg-purple-600 hover:bg-purple-700",
    statBox: "bg-purple-50 text-purple-600 border-purple-100",
    accentText: "text-purple-600",
    icon: Activity
  }
};

export default function App() {
  // Application State
  const [currentCategory, setCurrentCategory] = useState('IPUC_CET');
  const [studentsData, setStudentsData] = useState(() => {
    const saved = localStorage.getItem('apex_cet_neet_roster');
    return saved ? JSON.parse(saved) : defaultFourGroupRosters;
  });
  const [groupLinks, setGroupLinks] = useState(() => {
    const saved = localStorage.getItem('apex_group_links');
    return saved ? JSON.parse(saved) : defaultGroupLinks;
  });

  // Session Metadata
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [sessionTime, setSessionTime] = useState(() => {
    const n = new Date();
    return `${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}`;
  });
  const [subject, setSubject] = useState('Physics');
  const [faculty, setFaculty] = useState('Dr. H. V. Rao');
  const [globalMaxScore, setGlobalMaxScore] = useState(100);
  const [searchQuery, setSearchQuery] = useState('');
  const [liveClock, setLiveClock] = useState('');

  // Database Connection State
  const [dbStatus, setDbStatus] = useState({
    isConnected: false,
    databaseName: 'Checking...',
    currentUri: ''
  });
  const [isSavingDb, setIsSavingDb] = useState(false);

  // Modals Visibility
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [isWhatsAppAutoOpen, setIsWhatsAppAutoOpen] = useState(false);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  // Toast Notification State
  const [toast, setToast] = useState({ visible: false, message: '' });

  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 3500);
  };

  // Clock Ticker
  useEffect(() => {
    const updateTime = () => setLiveClock(new Date().toLocaleTimeString());
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch initial DB status and Students from API
  useEffect(() => {
    const fetchHealthAndSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.dbStatus) setDbStatus(data.dbStatus);
          if (data.groupLinks) setGroupLinks(data.groupLinks);
        }
      } catch (e) {
        console.warn('Backend server not connected yet, operating in local mode.');
      }
    };
    fetchHealthAndSettings();
  }, []);

  // Fetch Category Roster from API or fallback
  useEffect(() => {
    const fetchStudentsForCategory = async () => {
      try {
        const res = await fetch(`/api/students?category=${currentCategory}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) {
            // Merge with local attendance/score state
            setStudentsData(prev => ({
              ...prev,
              [currentCategory]: json.data.map(dbStudent => {
                const existing = (prev[currentCategory] || []).find(s => (s.rollNo === dbStudent.rollNo || s.roll === dbStudent.rollNo));
                return {
                  ...dbStudent,
                  present: existing ? existing.present : true,
                  score: existing ? existing.score : Math.floor(65 + Math.random() * 30),
                  maxScore: existing ? existing.maxScore : globalMaxScore
                };
              })
            }));
          }
        }
      } catch (err) {
        console.warn('Using local dataset for category.');
      }
    };
    fetchStudentsForCategory();
  }, [currentCategory]);

  // Persist local state
  useEffect(() => {
    localStorage.setItem('apex_cet_neet_roster', JSON.stringify(studentsData));
  }, [studentsData]);

  useEffect(() => {
    localStorage.setItem('apex_group_links', JSON.stringify(groupLinks));
  }, [groupLinks]);

  // Active theme and list
  const theme = categoryThemes[currentCategory];
  const activeStudentList = studentsData[currentCategory] || [];

  // Filter students based on search input
  const filteredStudents = activeStudentList.filter(s => {
    const q = searchQuery.toLowerCase().trim();
    const name = (s.name || '').toLowerCase();
    const roll = (s.rollNo || s.roll || '').toLowerCase();
    return name.includes(q) || roll.includes(q);
  });

  const totalEnrolled = activeStudentList.length;
  const presentCount = activeStudentList.filter(s => s.present).length;
  const absentCount = totalEnrolled - presentCount;
  const attendanceRate = totalEnrolled > 0 ? ((presentCount / totalEnrolled) * 100).toFixed(1) : '100.0';

  // Toggle Attendance
  const toggleAttendance = (roll) => {
    setStudentsData(prev => ({
      ...prev,
      [currentCategory]: prev[currentCategory].map(s => {
        if ((s.rollNo || s.roll) === roll) {
          return { ...s, present: !s.present };
        }
        return s;
      })
    }));
  };

  // Mark all Attendance
  const markAll = (status) => {
    setStudentsData(prev => ({
      ...prev,
      [currentCategory]: prev[currentCategory].map(s => ({ ...s, present: status }))
    }));
    showToast(`Marked all ${totalEnrolled} students as ${status ? 'Present' : 'Absent'}`);
  };

  // Update Score
  const updateScore = (roll, val) => {
    const parsed = val === '' ? 0 : parseFloat(val);
    setStudentsData(prev => ({
      ...prev,
      [currentCategory]: prev[currentCategory].map(s => {
        if ((s.rollNo || s.roll) === roll) {
          return { ...s, score: parsed };
        }
        return s;
      })
    }));
  };

  // Update Student Max Score
  const updateStudentMaxScore = (roll, val) => {
    const parsed = val === '' ? 100 : parseFloat(val);
    setStudentsData(prev => ({
      ...prev,
      [currentCategory]: prev[currentCategory].map(s => {
        if ((s.rollNo || s.roll) === roll) {
          return { ...s, maxScore: parsed };
        }
        return s;
      })
    }));
  };

  // Update Global Max Score
  const handleGlobalMaxChange = (val) => {
    const parsed = val === '' ? 100 : parseFloat(val);
    setGlobalMaxScore(parsed);
    setStudentsData(prev => ({
      ...prev,
      [currentCategory]: prev[currentCategory].map(s => ({ ...s, maxScore: parsed }))
    }));
  };

  // Save Current Session to MongoDB
  const saveSessionToDatabase = async () => {
    setIsSavingDb(true);
    try {
      const payload = {
        date,
        category: currentCategory,
        subject,
        faculty,
        sessionTime,
        maxScore: globalMaxScore,
        records: activeStudentList
      };

      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`✅ Saved ${theme.title} attendance session to MongoDB!`);
      } else {
        showToast('Saved locally.');
      }
    } catch (err) {
      console.warn('API save error:', err);
      showToast('Saved locally in browser storage.');
    } finally {
      setIsSavingDb(false);
    }
  };

  // Student Add / Edit Handlers
  const handleOpenAddStudent = () => {
    setEditingStudent(null);
    setIsStudentModalOpen(true);
  };

  const handleOpenEditStudent = (student) => {
    setEditingStudent(student);
    setIsStudentModalOpen(true);
  };

  const handleSaveStudent = (savedStudent) => {
    const roll = savedStudent.rollNo || savedStudent.roll;
    setStudentsData(prev => {
      const list = [...(prev[currentCategory] || [])];
      const idx = list.findIndex(s => (s.rollNo || s.roll) === roll);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...savedStudent };
      } else {
        list.unshift(savedStudent);
      }
      return { ...prev, [currentCategory]: list };
    });
  };

  const handleDeleteStudent = async (student) => {
    const roll = student.rollNo || student.roll;
    if (window.confirm(`Are you sure you want to remove ${student.name} (${roll})?`)) {
      setStudentsData(prev => ({
        ...prev,
        [currentCategory]: prev[currentCategory].filter(s => (s.rollNo || s.roll) !== roll)
      }));

      if (student._id && !student._id.startsWith('fallback_') && !student._id.startsWith('local_')) {
        try {
          await fetch(`/api/students/${student._id}`, { method: 'DELETE' });
        } catch (e) {
          console.warn('Could not delete on server:', e);
        }
      }
      showToast(`Removed ${student.name} from roster.`);
    }
  };

  // Direct Parent Messaging
  const getIndividualMessage = (student) => {
    const sc = student.score !== undefined ? student.score : 0;
    const mx = student.maxScore || globalMaxScore || 100;
    const pct = mx > 0 ? ((sc / mx) * 100).toFixed(1) : 0;
    const statusText = student.present ? 'PRESENT ✅' : 'ABSENT ❌';

    return (
      `Dear Parent,\nCoaching Progress Update for ${student.name} (Roll: ${student.rollNo || student.roll}) [${theme.title} - ${subject}]:\n\n` +
      `📅 Date: ${date}\n` +
      `👨‍🏫 Faculty: ${faculty || 'Faculty'}\n` +
      `📌 Status: ${statusText}\n` +
      `📝 Test Score: ${sc}/${mx} (${pct}%)\n\n` +
      `Apex Coaching Academy`
    );
  };

  const sendSingleWhatsApp = (student) => {
    const raw = String(student.phone).replace(/[^0-9]/g, '');
    const phone = raw.length === 10 ? `91${raw}` : raw;
    const text = encodeURIComponent(getIndividualMessage(student));
    window.open(`https://web.whatsapp.com/send?phone=${phone}&text=${text}`, '_blank');
  };

  const sendSingleSMS = (student) => {
    const text = encodeURIComponent(getIndividualMessage(student));
    window.open(`sms:${student.phone}?body=${text}`, '_self');
  };

  // Copy to clipboard helper
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  // WhatsApp Group Broadcasts
  const openWhatsAppGroup = (type) => {
    const key = `${currentCategory}_${type}`;
    const link = groupLinks[key];
    if (link && link.startsWith('http')) {
      window.open(link, '_blank');
    } else {
      showToast("Please configure valid group links in 'Group Links'");
      setIsGroupModalOpen(true);
    }
  };

  const broadcastAbsentees = () => {
    const absentees = activeStudentList.filter(s => !s.present);
    if (absentees.length === 0) {
      showToast('🎉 All students are marked present today!');
      return;
    }

    let msg = `🚨 *ABSENTEE NOTICE - ${theme.title}* 🚨\n`;
    msg += `📅 Date: ${date} | Time: ${sessionTime}\n`;
    msg += `📚 Subject: ${subject} | Faculty: ${faculty || 'N/A'}\n`;
    msg += `------------------------------------\n`;
    msg += `Total Absentees: ${absentees.length}\n\n`;

    absentees.forEach((student, index) => {
      msg += `${index + 1}. ${student.rollNo || student.roll} - ${student.name} (${student.type || student.hostel || 'Local'})\n`;
    });

    copyToClipboard(msg);
    openWhatsAppGroup('ABSENT');
    showToast('Absentees list copied to clipboard! Launching group...');
  };

  const broadcastMarksReport = () => {
    if (activeStudentList.length === 0) {
      showToast('No students available in roster.');
      return;
    }

    let msg = `📊 *DAILY TEST SCORECARD - ${theme.title}* 📊\n`;
    msg += `📅 Date: ${date} | Time: ${sessionTime}\n`;
    msg += `📚 Subject: ${subject} | Faculty: ${faculty || 'N/A'}\n`;
    msg += `------------------------------------\n`;

    activeStudentList.forEach((student) => {
      const mx = student.maxScore || globalMaxScore || 100;
      const sc = student.score || 0;
      const pct = mx > 0 ? ((sc / mx) * 100).toFixed(1) : 0;
      const statusFlag = student.present ? '' : ' (Absent)';
      msg += `${student.rollNo || student.roll} | ${student.name}${statusFlag}: ${sc}/${mx} (${pct}%)\n`;
    });

    copyToClipboard(msg);
    openWhatsAppGroup('MARKS');
    showToast('Marks report copied to clipboard! Launching group...');
  };

  const CategoryIcon = theme.icon;

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Toast Notification */}
      <div
        className={`fixed bottom-5 right-5 z-50 transform transition-all duration-300 pointer-events-none flex items-center space-x-3 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 ${
          toast.visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
        <span className="text-xs sm:text-sm font-semibold">{toast.message}</span>
      </div>

      {/* Navigation Header */}
      <header className="bg-slate-950 text-white shadow-xl sticky top-0 z-40 border-b border-slate-800/80 backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            
            {/* Title & Brand */}
            <div className="flex items-center space-x-3">
              <div className={`p-2.5 rounded-2xl shadow-lg text-white transition-all duration-300 ${theme.logoBg}`}>
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
                  Apex Academy
                  <span className="text-[10px] sm:text-xs bg-slate-900 text-emerald-400 border border-slate-700 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-extrabold shadow-inner">
                    MERN Edition
                  </span>
                </h1>
                <p className="text-xs text-slate-400 font-medium">Daily Attendance, Marks & WhatsApp Broadcast Suite</p>
              </div>
            </div>

            {/* 4 Separate Category Switches with Icons & Colors */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 self-start lg:self-auto">
              {/* 1. I PUC CET */}
              <button
                type="button"
                onClick={() => setCurrentCategory('IPUC_CET')}
                className={`flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  currentCategory === 'IPUC_CET'
                    ? categoryThemes.IPUC_CET.activeTabBg
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>I PUC CET</span>
              </button>

              {/* 2. I PUC NEET */}
              <button
                type="button"
                onClick={() => setCurrentCategory('IPUC_NEET')}
                className={`flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  currentCategory === 'IPUC_NEET'
                    ? categoryThemes.IPUC_NEET.activeTabBg
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Stethoscope className="w-4 h-4" />
                <span>I PUC NEET</span>
              </button>

              {/* 3. II PUC CET */}
              <button
                type="button"
                onClick={() => setCurrentCategory('IIPUC_CET')}
                className={`flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  currentCategory === 'IIPUC_CET'
                    ? categoryThemes.IIPUC_CET.activeTabBg
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>II PUC CET</span>
              </button>

              {/* 4. II PUC NEET */}
              <button
                type="button"
                onClick={() => setCurrentCategory('IIPUC_NEET')}
                className={`flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  currentCategory === 'IIPUC_NEET'
                    ? categoryThemes.IIPUC_NEET.activeTabBg
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>II PUC NEET</span>
              </button>
            </div>

            {/* Config & DB Buttons */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsDbModalOpen(true)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition shadow-sm ${
                  dbStatus.isConnected
                    ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800 hover:bg-emerald-900'
                    : 'bg-slate-800 text-amber-400 border-amber-900/60 hover:bg-slate-700'
                }`}
                title="MongoDB Database Connection Status & Settings"
              >
                <Database className="w-3.5 h-3.5" />
                <span>{dbStatus.isConnected ? 'MongoDB Connected' : 'Database Settings'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsGroupModalOpen(true)}
                className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 px-3 py-2 rounded-xl text-xs font-bold border border-slate-700 transition"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                <span>Group Links</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-grow w-full">
        
        {/* Dynamic Category Hero Banner */}
        <div className={`p-5 rounded-3xl shadow-lg border transition-all duration-300 ${theme.heroBg}`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            <div className="flex items-center space-x-3.5">
              <div className={`p-3 rounded-2xl border ${theme.heroIconBg}`}>
                <CategoryIcon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black uppercase tracking-wider flex items-center gap-2">
                  <span>{theme.title} Operations Hub</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold lowercase tracking-normal">
                    {totalEnrolled} enrolled
                  </span>
                </h3>
                <p className="text-xs text-white/80 font-medium">
                  {theme.subtitle} — Instant WhatsApp Web Broadcasts & Database Sync
                </p>
              </div>
            </div>

            {/* Launchers & Save Sync Button */}
            <div className="flex flex-wrap items-center gap-2.5">
              
              <button
                type="button"
                onClick={() => openWhatsAppGroup('ABSENT')}
                className={`flex items-center justify-center space-x-2 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition border ${theme.btnAbsent}`}
              >
                <Users className="w-4 h-4" />
                <span>{theme.title} Absentees Group</span>
              </button>

              <button
                type="button"
                onClick={() => openWhatsAppGroup('MARKS')}
                className={`flex items-center justify-center space-x-2 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition border ${theme.btnMarks}`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>{theme.title} Marks Group</span>
              </button>

              <button
                type="button"
                disabled={isSavingDb}
                onClick={saveSessionToDatabase}
                className="flex items-center justify-center space-x-2 bg-white text-slate-900 hover:bg-slate-100 px-4 py-2.5 rounded-xl text-xs font-black shadow-md transition"
                title="Save today's attendance and test marks to MongoDB"
              >
                <Save className="w-4 h-4 text-emerald-600" />
                <span>{isSavingDb ? 'Saving...' : 'Save to DB'}</span>
              </button>

            </div>
          </div>
        </div>

        {/* Daily Class & Exam Setup Metadata */}
        <section className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/90">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div className="flex items-center space-x-2.5">
              <span className={`px-3 py-1 text-xs font-black rounded-lg uppercase tracking-wide border ${theme.badgeBg}`}>
                {theme.title}
              </span>
              <h2 className="text-sm sm:text-base font-bold text-slate-800">
                Daily Class & Exam Setup
              </h2>
            </div>
            
            <div className="text-xs text-slate-600 font-semibold flex items-center gap-1.5 bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-mono">{liveClock || '--:--:--'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* Date */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs sm:text-sm rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white p-2.5 outline-none font-semibold transition"
              />
            </div>

            {/* Time Slot */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Session Time
              </label>
              <input
                type="time"
                value={sessionTime}
                onChange={(e) => setSessionTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs sm:text-sm rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white p-2.5 outline-none font-semibold transition"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs sm:text-sm rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white p-2.5 outline-none font-semibold transition"
              >
                <option value="Physics">Physics ⚛️</option>
                <option value="Chemistry">Chemistry 🧪</option>
                <option value="Mathematics">Mathematics 📐</option>
                <option value="Biology">Biology 🧬</option>
              </select>
            </div>

            {/* Faculty Name */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Faculty Name
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. H. V. Rao"
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs sm:text-sm rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white p-2.5 outline-none font-semibold transition"
              />
            </div>

            {/* Default Max Score */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Default Max Score
              </label>
              <input
                type="number"
                min="1"
                value={globalMaxScore}
                onChange={(e) => handleGlobalMaxChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs sm:text-sm rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white p-2.5 outline-none font-semibold transition"
              />
            </div>
          </div>
        </section>

        {/* 4 Feature Action Cards: Stats, Absentees Broadcast, Scorecard Dispatch, Auto WhatsApp & Excel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Stats Widget */}
          <div className="bg-white p-4.5 rounded-3xl border border-slate-200/90 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {theme.title} Roster
              </p>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-3xl font-black text-slate-900">{totalEnrolled}</span>
                <span className="text-xs text-slate-500 font-semibold">Students</span>
              </div>
              <div className="flex items-center space-x-3 text-xs font-bold mt-2">
                <span className="text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{presentCount} Present</span>
                </span>
                <span className="text-rose-600 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>{absentCount} Absent</span>
                </span>
              </div>
            </div>
            <div className={`p-3.5 rounded-2xl border ${theme.statBox}`}>
              <Users className="w-7 h-7" />
            </div>
          </div>

          {/* Card 2: Broadcast Absentees */}
          <div className="bg-white p-4.5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Absentees Broadcast
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Copy formatted absentee list & open target WhatsApp group
              </p>
            </div>
            <button
              type="button"
              onClick={broadcastAbsentees}
              className="mt-3 w-full bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Absentees Notice</span>
            </button>
          </div>

          {/* Card 3: Broadcast Scorecard */}
          <div className="bg-white p-4.5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Scorecard Dispatch
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Copy full test marks summary & launch WhatsApp group
              </p>
            </div>
            <button
              type="button"
              onClick={broadcastMarksReport}
              className={`mt-3 w-full text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-sm ${theme.btnMarksBroadcast}`}
            >
              <Share2 className="w-4 h-4" />
              <span>Broadcast Test Scorecard</span>
            </button>
          </div>

          {/* Card 4: Auto WhatsApp & Excel Download */}
          <div className="bg-white p-4.5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Automation Suite</span>
                </h4>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                  PRO
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Auto-send via WhatsApp Web & Multi-frequency Excel extraction
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3">
              <button
                type="button"
                onClick={() => setIsWhatsAppAutoOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 shadow-sm"
                title="Automated WhatsApp Web Dispatcher"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Auto WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => setIsExcelModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 shadow-sm"
                title="Download Excel: Daily, Weekly, Monthly"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export Excel</span>
              </button>
            </div>
          </div>

        </div>

        {/* Student Data Section */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-200/90 overflow-hidden flex flex-col">
          
          {/* Table Toolbar */}
          <div className="p-4 bg-slate-50/90 border-b border-slate-200/80 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-600" />
                <span>{theme.title} Student Roster</span>
              </h3>
              <span className="bg-slate-200 text-slate-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {filteredStudents.length} Students
              </span>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search */}
              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search Name or Roll..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-xs rounded-xl pl-9 pr-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              {/* Add Student */}
              <button
                type="button"
                onClick={handleOpenAddStudent}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition shadow-sm"
              >
                <UserPlus className="w-4 h-4 text-emerald-400" />
                <span>Add Student</span>
              </button>

              {/* Bulk Attendance Toggles */}
              <div className="flex items-center space-x-1 border-l border-slate-300 pl-2">
                <button
                  type="button"
                  onClick={() => markAll(true)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-2.5 py-2 rounded-xl transition"
                >
                  All Present
                </button>
                <button
                  type="button"
                  onClick={() => markAll(false)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-2.5 py-2 rounded-xl transition"
                >
                  All Absent
                </button>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto custom-scrollbar flex-grow">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100/90 text-slate-600 font-black uppercase tracking-wider border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">SL NO</th>
                  <th className="py-3.5 px-4 w-24">Roll No</th>
                  <th className="py-3.5 px-4">Student Details</th>
                  <th className="py-3.5 px-4 text-center">Stream</th>
                  <th className="py-3.5 px-4 text-center">Attendance</th>
                  <th className="py-3.5 px-4">Subject & Faculty</th>
                  <th className="py-3.5 px-4 text-center w-24">Score</th>
                  <th className="py-3.5 px-4 text-center w-20">Max</th>
                  <th className="py-3.5 px-4 text-center w-20">% Pct</th>
                  <th className="py-3.5 px-4 text-center">Parent Alerts</th>
                  <th className="py-3.5 px-4 text-center w-16">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="p-12 text-center text-slate-400 text-xs">
                      No matching student records found.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student, index) => {
                    const roll = student.rollNo || student.roll;
                    const max = student.maxScore || globalMaxScore || 100;
                    const sc = student.score !== undefined ? student.score : 0;
                    const pct = max > 0 ? ((sc / max) * 100).toFixed(1) : 0;

                    let pctBadge = "bg-slate-100 text-slate-700 border-slate-200";
                    if (pct >= 75) pctBadge = "bg-emerald-50 text-emerald-700 border-emerald-200 font-bold";
                    else if (pct >= 40) pctBadge = "bg-amber-50 text-amber-700 border-amber-200 font-bold";
                    else if (pct > 0) pctBadge = "bg-rose-50 text-rose-700 border-rose-200 font-bold";

                    return (
                      <tr key={student._id || student.id || roll} className="hover:bg-slate-50/80 transition-colors">
                        
                        {/* SL No */}
                        <td className="py-3 px-4 text-center text-slate-400 font-semibold text-xs">
                          {index + 1}
                        </td>

                        {/* Roll */}
                        <td className="py-3 px-4 font-bold text-slate-700 text-xs font-mono">
                          {roll}
                        </td>

                        {/* Student Details */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 text-sm">{student.name}</div>
                          <div className="flex items-center space-x-2 mt-0.5">
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                              {student.type || student.hostel || 'LOCAL'}
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium">
                              +91 {student.phone}
                            </span>
                          </div>
                        </td>

                        {/* Stream */}
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2 py-0.5 text-xs font-extrabold rounded-md ${
                              student.stream === 'NEET'
                                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                : 'bg-blue-100 text-blue-700 border border-blue-200'
                            }`}
                          >
                            {student.stream}
                          </span>
                        </td>

                        {/* Attendance Toggle */}
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => toggleAttendance(roll)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center space-x-1 transition shadow-sm ${
                              student.present
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                                : 'bg-rose-100 text-rose-800 hover:bg-rose-200 border border-rose-300'
                            }`}
                          >
                            {student.present ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5" />
                            )}
                            <span>{student.present ? 'Present' : 'Absent'}</span>
                          </button>
                        </td>

                        {/* Subject & Faculty */}
                        <td className="py-3 px-4">
                          <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-md">
                            {subject}
                          </span>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Faculty: <span className="font-semibold text-slate-700">{faculty}</span>
                          </div>
                        </td>

                        {/* Score Input */}
                        <td className="py-3 px-4 text-center">
                          <input
                            type="number"
                            min="0"
                            max={max}
                            value={sc}
                            onChange={(e) => updateScore(roll, e.target.value)}
                            className="w-16 bg-slate-50 border border-slate-300 rounded-lg p-1.5 text-center text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                          />
                        </td>

                        {/* Max Score Input */}
                        <td className="py-3 px-4 text-center">
                          <input
                            type="number"
                            min="1"
                            value={max}
                            onChange={(e) => updateStudentMaxScore(roll, e.target.value)}
                            className="w-14 bg-slate-50 border border-slate-300 rounded-lg p-1.5 text-center text-xs font-medium text-slate-600 focus:ring-2 focus:ring-emerald-500 outline-none"
                          />
                        </td>

                        {/* Percentage */}
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block px-2 py-1 rounded-lg text-xs border ${pctBadge}`}>
                            {pct}%
                          </span>
                        </td>

                        {/* Parent Alerts */}
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center space-x-1.5">
                            <button
                              type="button"
                              onClick={() => sendSingleWhatsApp(student)}
                              title="Launch WhatsApp Web Parent Alert"
                              className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition border border-emerald-200"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => sendSingleSMS(student)}
                              title="Send SMS Alert"
                              className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition border border-blue-200"
                            >
                              <Smartphone className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditStudent(student)}
                              title="Edit Student"
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteStudent(student)}
                              title="Delete Student"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Apex Academy CET & NEET Coaching Management Platform &copy; 2026. MERN Stack Production Suite.</span>
          <div className="flex items-center space-x-3 text-slate-400">
            <span>Database: <strong className={dbStatus.isConnected ? 'text-emerald-600' : 'text-amber-600'}>{dbStatus.databaseName}</strong></span>
            <span>•</span>
            <span>Batch: <strong>{theme.title}</strong></span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ExcelExportModal
        isOpen={isExcelModalOpen}
        onClose={() => setIsExcelModalOpen(false)}
        category={currentCategory}
        categoryTitle={theme.title}
        students={activeStudentList}
        date={date}
        sessionTime={sessionTime}
        subject={subject}
        faculty={faculty}
        maxScore={globalMaxScore}
        showToast={showToast}
      />

      <WhatsAppAutoSendModal
        isOpen={isWhatsAppAutoOpen}
        onClose={() => setIsWhatsAppAutoOpen(false)}
        category={currentCategory}
        categoryTitle={theme.title}
        students={activeStudentList}
        date={date}
        subject={subject}
        faculty={faculty}
        maxScore={globalMaxScore}
        showToast={showToast}
      />

      <DatabaseConfigModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
        dbStatus={dbStatus}
        onDbConnected={(status) => {
          setDbStatus(status);
        }}
        showToast={showToast}
      />

      <GroupConfigModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        groupLinks={groupLinks}
        onSaveLinks={(newLinks) => setGroupLinks(newLinks)}
        showToast={showToast}
      />

      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        student={editingStudent}
        category={currentCategory}
        categoryTitle={theme.title}
        onSaveStudent={handleSaveStudent}
        showToast={showToast}
      />

    </div>
  );
}

