import React, { useState } from 'react';
import { X, Database, CheckCircle2, AlertCircle, RefreshCw, KeyRound, ShieldCheck } from 'lucide-react';

export default function DatabaseConfigModal({
  isOpen,
  onClose,
  dbStatus,
  onDbConnected,
  showToast
}) {
  const [mongoUri, setMongoUri] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleConnect = async (e) => {
    e.preventDefault();
    if (!mongoUri.trim()) {
      showToast('Please paste a valid MongoDB connection string.');
      return;
    }

    setIsLoading(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/settings/db-connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mongoUri: mongoUri.trim() })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setTestResult({
          type: 'success',
          message: data.message || 'Connected to MongoDB successfully! All 165 students seeded.'
        });
        showToast('Connected to MongoDB! Students synchronized.');
        if (onDbConnected) onDbConnected(data.dbStatus);
      } else {
        setTestResult({
          type: 'error',
          message: data.error || data.message || 'Connection failed. Please verify credentials and network IP access.'
        });
        showToast('Connection failed: ' + (data.error || 'Check details'));
      }
    } catch (err) {
      console.error(err);
      setTestResult({
        type: 'error',
        message: 'Could not reach backend API: ' + err.message
      });
      showToast('API Error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">MongoDB Database Configuration</h3>
              <p className="text-xs text-slate-400">Connect cloud or local MongoDB instance</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleConnect} className="p-6 space-y-4">
          
          {/* Status Badge */}
          <div className={`p-3.5 rounded-xl border flex items-start space-x-3 text-xs ${
            dbStatus?.isConnected
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
              : 'bg-amber-50/80 border-amber-200 text-amber-900'
          }`}>
            {dbStatus?.isConnected ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-bold">
                {dbStatus?.isConnected ? 'Connected to MongoDB' : 'Running in Memory Store (165 Preloaded Students)'}
              </div>
              <div className="text-[11px] opacity-80 mt-0.5">
                Current URI: {dbStatus?.currentUri || 'Not connected yet'}
              </div>
            </div>
          </div>

          {/* Connection String Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Paste MongoDB Connection String</span>
              <span className="text-[10px] text-indigo-600 font-semibold lowercase">mongodb+srv://...</span>
            </label>
            <textarea
              required
              rows={3}
              value={mongoUri}
              onChange={(e) => setMongoUri(e.target.value)}
              placeholder="e.g. mongodb+srv://username:password@cluster0.abcde.mongodb.net/apex_cet_neet?retryWrites=true&w=majority"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-mono text-xs text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Once you paste your connection string and click connect, the system will instantly link and auto-seed all 165 students into your MongoDB database.
            </p>
          </div>

          {/* Feedback message */}
          {testResult && (
            <div className={`p-3 rounded-xl border text-xs ${
              testResult.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
              {testResult.message}
            </div>
          )}

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <div className="font-bold text-slate-700 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Alternative Setup via .env</span>
            </div>
            <p>You can also paste your string in <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono">server/.env</code> as <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono">MONGODB_URI=...</code> anytime.</p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition shadow-md flex items-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  <span>Connecting & Seeding...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Connect & Sync Database</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

