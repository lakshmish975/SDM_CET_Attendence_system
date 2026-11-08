import React, { useState, useEffect } from 'react';
import { X, Link2, Check, MessageSquare } from 'lucide-react';

export default function GroupConfigModal({
  isOpen,
  onClose,
  groupLinks,
  onSaveLinks,
  showToast
}) {
  const [links, setLinks] = useState(groupLinks || {});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (groupLinks) {
      setLinks(groupLinks);
    }
  }, [groupLinks]);

  if (!isOpen) return null;

  const handleChange = (key, val) => {
    setLinks(prev => ({ ...prev, [key]: val }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch('/api/settings/group-links', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupLinks: links })
      });

      if (response.ok) {
        showToast('WhatsApp Group links saved successfully!');
      } else {
        showToast('Saved locally.');
      }
      onSaveLinks(links);
      onClose();
    } catch (err) {
      console.warn('API error saving group links:', err);
      onSaveLinks(links);
      showToast('Saved locally.');
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Configure 4 Category WhatsApp Links</h3>
              <p className="text-xs text-slate-400">Direct launch invite URLs for batch groups</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-grow custom-scrollbar">
          <p className="text-xs text-slate-500">
            Paste your WhatsApp Group invite links (<code className="font-mono bg-slate-100 px-1 py-0.5 rounded">https://chat.whatsapp.com/...</code>) for all 4 student categories:
          </p>

          {/* 1. I PUC CET */}
          <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200/80 space-y-2">
            <h4 className="text-xs font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>1. I PUC CET Groups</span>
            </h4>
            <input
              type="url"
              placeholder="Absentees Group: https://chat.whatsapp.com/..."
              value={links.IPUC_CET_ABSENT || ''}
              onChange={(e) => handleChange('IPUC_CET_ABSENT', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="url"
              placeholder="Marks Group: https://chat.whatsapp.com/..."
              value={links.IPUC_CET_MARKS || ''}
              onChange={(e) => handleChange('IPUC_CET_MARKS', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* 2. I PUC NEET */}
          <div className="bg-teal-50/60 p-3.5 rounded-xl border border-teal-200/80 space-y-2">
            <h4 className="text-xs font-black text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>2. I PUC NEET Groups</span>
            </h4>
            <input
              type="url"
              placeholder="Absentees Group: https://chat.whatsapp.com/..."
              value={links.IPUC_NEET_ABSENT || ''}
              onChange={(e) => handleChange('IPUC_NEET_ABSENT', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="url"
              placeholder="Marks Group: https://chat.whatsapp.com/..."
              value={links.IPUC_NEET_MARKS || ''}
              onChange={(e) => handleChange('IPUC_NEET_MARKS', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* 3. II PUC CET */}
          <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-200/80 space-y-2">
            <h4 className="text-xs font-black text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>3. II PUC CET Groups</span>
            </h4>
            <input
              type="url"
              placeholder="Absentees Group: https://chat.whatsapp.com/..."
              value={links.IIPUC_CET_ABSENT || ''}
              onChange={(e) => handleChange('IIPUC_CET_ABSENT', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="url"
              placeholder="Marks Group: https://chat.whatsapp.com/..."
              value={links.IIPUC_CET_MARKS || ''}
              onChange={(e) => handleChange('IIPUC_CET_MARKS', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 4. II PUC NEET */}
          <div className="bg-purple-50/60 p-3.5 rounded-xl border border-purple-200/80 space-y-2">
            <h4 className="text-xs font-black text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>4. II PUC NEET Groups</span>
            </h4>
            <input
              type="url"
              placeholder="Absentees Group: https://chat.whatsapp.com/..."
              value={links.IIPUC_NEET_ABSENT || ''}
              onChange={(e) => handleChange('IIPUC_NEET_ABSENT', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="url"
              placeholder="Marks Group: https://chat.whatsapp.com/..."
              value={links.IIPUC_NEET_MARKS || ''}
              onChange={(e) => handleChange('IIPUC_NEET_MARKS', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition shadow-md flex items-center space-x-1.5"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{isSaving ? 'Saving...' : 'Save Group Links'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
