
import React, { useState, useMemo, useEffect } from 'react';
import { GRANTS } from '../constants';
import { Grant } from '../types';
import { searchActiveGrants } from '../services/geminiService';

const GrantsHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
  const [reminders, setReminders] = useState<string[]>([]);
  const [completedSteps, setCompletedSteps] = useState<Record<string, number[]>>({});
  const [showToast, setShowToast] = useState<string | null>(null);
  const [isPortalModalOpen, setIsPortalModalOpen] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);

  // Live Search State
  const [isScanning, setIsScanning] = useState(false);
  const [liveGrants, setLiveGrants] = useState<{ text: string; citations: any[] } | null>(null);

  const categories = ['All', 'Agribusiness', 'Tech', 'Women', 'Youth', 'Climate'];

  useEffect(() => {
    const savedReminders = localStorage.getItem('grant_reminders');
    if (savedReminders) setReminders(JSON.parse(savedReminders));
    const savedProgress = localStorage.getItem('grant_progress');
    if (savedProgress) setCompletedSteps(JSON.parse(savedProgress));
  }, []);

  const handleLiveScan = async () => {
    setIsScanning(true);
    setLiveGrants(null);
    try {
      const result = await searchActiveGrants();
      setLiveGrants(result);
      setShowToast("Real-time scan complete!");
    } catch (err) {
      console.error(err);
      setShowToast("Failed to fetch live data. Please try again.");
    } finally {
      setIsScanning(false);
      setTimeout(() => setShowToast(null), 3000);
    }
  };

  const toggleReminder = async (grantId: string) => {
    const isCurrentlySet = reminders.includes(grantId);
    if (!isCurrentlySet && "Notification" in window && Notification.permission !== "granted") {
      await Notification.requestPermission();
    }
    const newReminders = isCurrentlySet ? reminders.filter(id => id !== grantId) : [...reminders, grantId];
    setReminders(newReminders);
    localStorage.setItem('grant_reminders', JSON.stringify(newReminders));
    setShowToast(isCurrentlySet ? "Reminder removed" : "Reminder set successfully!");
    setTimeout(() => setShowToast(null), 3000);
  };

  const toggleStepCompletion = (grantId: string, stepIndex: number) => {
    const currentSteps = completedSteps[grantId] || [];
    const isCompleted = currentSteps.includes(stepIndex);
    const newSteps = isCompleted ? currentSteps.filter(idx => idx !== stepIndex) : [...currentSteps, stepIndex];
    const newProgress = { ...completedSteps, [grantId]: newSteps };
    setCompletedSteps(newProgress);
    localStorage.setItem('grant_progress', JSON.stringify(newProgress));
  };

  const getProgress = (grantId: string) => {
    const grant = GRANTS.find(g => g.id === grantId);
    if (!grant) return 0;
    return Math.round(((completedSteps[grantId] || []).length / grant.steps.length) * 100);
  };

  const filteredGrants = useMemo(() => {
    return GRANTS.filter(grant => {
      const matchesSearch = grant.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          grant.organization.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || grant.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[300] bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300 font-bold text-sm flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          {showToast}
        </div>
      )}

      {/* Confirmation Modal */}
      {isPortalModalOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-10 text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">Leaving RiseUp Zim</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">You are being redirected to an external portal.</p>
              <button onClick={() => { window.open(pendingUrl!, '_blank'); setIsPortalModalOpen(false); }} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-lg mb-3 shadow-xl shadow-emerald-100 transition-all hover:bg-emerald-700">Continue</button>
              <button onClick={() => setIsPortalModalOpen(false)} className="w-full py-4 rounded-2xl font-bold text-slate-400 hover:text-slate-600">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Grants & Opportunity Hub</h1>
            <p className="text-lg text-slate-500 max-w-xl">Curated and real-time funding for Zimbabwean youth.</p>
          </div>
          <button 
            onClick={handleLiveScan}
            disabled={isScanning}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all disabled:opacity-50 shadow-xl shadow-slate-200"
          >
            {isScanning ? (
              <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Scanning Web...</>
            ) : (
              <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> Live Scan for New Grants</>
            )}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div>
            <input type="text" placeholder="Search curated database..." className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all text-sm bg-white" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}>{cat}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Grant List */}
        <div className="lg:col-span-7 space-y-6">
          {/* Live Search Results */}
          {liveGrants && (
            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-100 shadow-xl animate-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
                <h2 className="text-xl font-black text-slate-900">Live Search Results (Web)</h2>
              </div>
              <div className="prose prose-sm prose-slate max-w-none mb-8 whitespace-pre-wrap leading-relaxed text-slate-600 font-medium">
                {liveGrants.text}
              </div>
              <div className="pt-6 border-t border-emerald-100">
                <h4 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-4">Official Sources</h4>
                <div className="flex flex-wrap gap-2">
                  {liveGrants.citations.map((cite, i) => (
                    cite.web && (
                      <a key={i} href={cite.web.uri} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-white border border-emerald-200 rounded-lg text-[10px] font-bold text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                        {cite.web.title || "External Portal"}
                      </a>
                    )
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Curated Grants */}
          {filteredGrants.map(grant => {
            const hasReminder = reminders.includes(grant.id);
            const progress = getProgress(grant.id);
            return (
              <div key={grant.id} onClick={() => setSelectedGrant(grant)} className={`p-6 rounded-[2rem] border transition-all cursor-pointer group relative overflow-hidden ${selectedGrant?.id === grant.id ? 'bg-white border-emerald-500 shadow-2xl ring-4 ring-emerald-50' : 'bg-white border-slate-100 hover:border-emerald-200 hover:shadow-xl shadow-sm'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded">{grant.category}</span>
                    <h3 className="text-xl font-black text-slate-900 mt-2 group-hover:text-emerald-600 transition-colors">{grant.title}</h3>
                    <p className="text-sm font-bold text-slate-400">{grant.organization}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-slate-900">{grant.amount}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Deadline: {grant.deadline}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <span className="text-emerald-600 text-xs font-black uppercase tracking-wider">View Details</span>
                  {progress > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: `${progress}%` }} /></div>
                      <span className="text-[10px] font-black text-emerald-600">{progress}%</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail Sidebar */}
        <div className="lg:col-span-5 relative">
          {selectedGrant ? (
            <div className="bg-white rounded-[2.5rem] p-8 text-slate-900 border border-slate-100 sticky top-24 shadow-2xl animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col max-h-[calc(100vh-8rem)]">
              <div className="mb-6 flex justify-between items-start">
                <div className="pr-4">
                  <h2 className="text-2xl font-black mb-1 leading-tight">{selectedGrant.title}</h2>
                  <p className="text-slate-500 text-sm">{selectedGrant.organization}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); toggleReminder(selectedGrant.id); }} className={`p-3 rounded-2xl transition-all border shrink-0 ${reminders.includes(selectedGrant.id) ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200'}`}><svg className="w-5 h-5" fill={reminders.includes(selectedGrant.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg></button>
              </div>
              <div className="mb-8 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div className="flex justify-between items-center mb-2"><span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Progress</span><span className="text-[10px] font-black text-emerald-700">{getProgress(selectedGrant.id)}%</span></div>
                <div className="w-full h-2 bg-white rounded-full overflow-hidden"><div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${getProgress(selectedGrant.id)}%` }} /></div>
              </div>
              <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                {selectedGrant.steps.map((step, idx) => {
                  const isDone = (completedSteps[selectedGrant.id] || []).includes(idx);
                  return (
                    <div key={idx} onClick={() => toggleStepCompletion(selectedGrant.id, idx)} className={`flex gap-4 p-4 rounded-2xl border transition-all cursor-pointer group ${isDone ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-100 hover:border-emerald-100'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${isDone ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{isDone ? "✓" : (idx + 1)}</div>
                      <div className="flex-1">
                        <h5 className={`font-bold text-sm mb-0.5 ${isDone ? 'text-emerald-900 line-through opacity-60' : 'text-slate-800'}`}>{step.title}</h5>
                        <p className={`text-xs ${isDone ? 'text-emerald-600/60' : 'text-slate-400'}`}>{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 pt-6 border-t border-slate-50">
                <button onClick={() => { setPendingUrl(selectedGrant.url); setIsPortalModalOpen(true); }} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200">Finalize on Portal</button>
              </div>
            </div>
          ) : (
            <div className="h-full bg-white rounded-[2.5rem] border border-slate-100 p-12 flex flex-col items-center justify-center text-center sticky top-24 opacity-60">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
              <h3 className="text-xl font-bold text-slate-400">Scan or select a grant</h3>
              <p className="text-sm text-slate-300 mt-2">Discover and track your application journey.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GrantsHub;
