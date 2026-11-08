import React, { useState, useEffect } from 'react';
import { X, UserPlus, UserCheck } from 'lucide-react';

export default function StudentModal({
  isOpen,
  onClose,
  student, // null if adding, student object if editing
  category,
  categoryTitle,
  onSaveStudent,
  showToast
}) {
  const [rollNo, setRollNo] = useState('');
  const [name, setName] = useState('');
  const [stream, setStream] = useState('CET');
  const [type, setType] = useState('LOCAL');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (student) {
      setRollNo(student.rollNo || student.roll || '');
      setName(student.name || '');
      setStream(student.stream || (category.includes('CET') ? 'CET' : 'NEET'));
      setType(student.type || student.hostel || 'LOCAL');
      setPhone(student.phone || '');
    } else {
      setRollNo('');
      setName('');
      setStream(category.includes('CET') ? 'CET' : 'NEET');
      setType('LOCAL');
      setPhone('');
    }
  }, [student, category, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rollNo.trim() || !name.trim() || !phone.trim()) {
      showToast('Roll No, Full Name, and Mobile Number are required.');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length !== 10) {
      showToast('Parent Mobile Number must be exactly 10 digits.');
      return;
    }

    setIsSubmitting(true);
    const payload = {
      rollNo: rollNo.trim(),
      name: name.trim(),
      stream,
      type: type.trim() || 'LOCAL',
      phone: cleanPhone,
      category
    };

    try {
      if (student && (student._id || student.id)) {
        // Edit existing
        const id = student._id || student.id;
        const res = await fetch(`/api/students/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showToast(`Updated student ${payload.name}`);
          onSaveStudent({ ...student, ...payload });
        } else {
          // Update locally
          onSaveStudent({ ...student, ...payload });
          showToast(`Updated student ${payload.name} (locally)`);
        }
      } else {
        // Add new
        const res = await fetch('/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showToast(`Added ${payload.name} to roster`);
          onSaveStudent(data.data);
        } else {
          // Add locally
          const newStudent = {
            _id: `local_${Date.now()}`,
            id: `local_${Date.now()}`,
            ...payload,
            present: true,
            score: 0,
            maxScore: 100
          };
          onSaveStudent(newStudent);
          showToast(`Added ${payload.name} (locally)`);
        }
      }
      onClose();
    } catch (err) {
      console.warn('API error saving student:', err);
      // Fallback update
      const fallbackObj = student ? { ...student, ...payload } : {
        _id: `local_${Date.now()}`,
        id: `local_${Date.now()}`,
        ...payload,
        present: true,
        score: 0,
        maxScore: 100
      };
      onSaveStudent(fallbackObj);
      showToast(`Saved ${payload.name} locally.`);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4.5 flex justify-between items-center">
          <h3 className="font-bold text-sm flex items-center gap-2">
            {student ? <UserCheck className="w-4 h-4 text-indigo-400" /> : <UserPlus className="w-4 h-4 text-emerald-400" />}
            <span>{student ? `Edit Student (${categoryTitle})` : `Add Student to ${categoryTitle}`}</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Roll Number *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 262715"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Student Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Aditi Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Stream *
              </label>
              <select
                value={stream}
                onChange={(e) => setStream(e.target.value)}
                className="w-full border border-slate-300 bg-slate-50 text-slate-800 rounded-xl p-2.5 text-xs outline-none font-bold"
              >
                <option value="CET">CET</option>
                <option value="NEET">NEET</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Hostel / Local *
              </label>
              <input
                type="text"
                placeholder="e.g. MY3, AKSHARA, LOCAL"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Parent Mobile Number (10 Digits) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-medium">+91</span>
              <input
                type="tel"
                required
                pattern="[0-9]{10}"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-2.5 pl-12 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md transition disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : student ? 'Update Student' : 'Save Student'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

