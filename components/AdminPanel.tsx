
import React, { useState, useEffect } from 'react';
import { Article, Job, MarketplaceAd, MusicGig, JobApplication, MusicGigApplication } from '../types';
import { analyzeCandidateMatch } from '../services/geminiService';

interface AdminPanelProps {
  onClose: () => void;
  onReturnHome: () => void;
  allArticles: Article[];
  onUpdateArticles: (articles: Article[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, onReturnHome, allArticles, onUpdateArticles }) => {
  const [activeMenu, setActiveMenu] = useState<'overview' | 'articles' | 'jobs' | 'gigs' | 'vetting' | 'ads' | 'reviews' | 'waitlists'>('overview');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [gigs, setGigs] = useState<MusicGig[]>([]);
  const [jobApps, setJobApps] = useState<JobApplication[]>([]);
  const [gigApps, setGigApps] = useState<MusicGigApplication[]>([]);
  const [ads, setAds] = useState<MarketplaceAd[]>([]);
  const [apps, setApps] = useState<any[]>([]);
  const [mentorWaitlist, setMentorWaitlist] = useState<string[]>([]);
  
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isGigModalOpen, setIsGigModalOpen] = useState(false);
  const [analyzingAppId, setAnalyzingAppId] = useState<string | null>(null);
  const [appAnalysis, setAppAnalysis] = useState<Record<string, string>>({});

  useEffect(() => {
    setJobs(JSON.parse(localStorage.getItem('user_posted_jobs') || '[]'));
    setGigs(JSON.parse(localStorage.getItem('user_music_gigs') || '[]'));
    setJobApps(JSON.parse(localStorage.getItem('job_applications') || '[]'));
    setGigApps(JSON.parse(localStorage.getItem('music_gig_applications') || '[]'));
    setAds(JSON.parse(localStorage.getItem('marketplace_ads') || '[]'));
    setApps(JSON.parse(localStorage.getItem('instructor_applications') || '[]'));
    setMentorWaitlist(JSON.parse(localStorage.getItem('mentor_waitlist') || '[]'));
  }, []);

  const stats = [
    { label: 'Articles', value: allArticles.length, color: 'text-emerald-600' },
    { label: 'Active Jobs', value: jobs.length, color: 'text-purple-600' },
    { label: 'Applicants', value: jobApps.length + gigApps.length, color: 'text-indigo-600' },
    { label: 'Ads', value: ads.length, color: 'text-amber-600' },
  ];

  const handleAIReview = async (app: JobApplication) => {
    setAnalyzingAppId(app.id);
    const targetJob = jobs.find(j => j.id === app.jobId) || { title: app.jobTitle, company: 'N/A', requirements: [] } as any;
    try {
      const verdict = await analyzeCandidateMatch(targetJob, app);
      setAppAnalysis(prev => ({ ...prev, [app.id]: verdict }));
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzingAppId(null);
    }
  };

  const handleDelete = (type: string, id: string) => {
    if (!window.confirm(`Permanently delete this ${type}?`)) return;

    if (type === 'article') {
      onUpdateArticles(allArticles.filter(a => a.id !== id));
    } else {
      const storageKey = type === 'job' ? 'user_posted_jobs' : 
                         type === 'gig' ? 'user_music_gigs' :
                         type === 'ad' ? 'marketplace_ads' : 
                         type === 'job-app' ? 'job_applications' :
                         type === 'gig-app' ? 'music_gig_applications' : 'instructor_applications';
      const current = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const updated = current.filter((item: any) => item.id !== id);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      if (type === 'job') setJobs(updated);
      if (type === 'gig') setGigs(updated);
      if (type === 'ad') setAds(updated);
      if (type === 'job-app') setJobApps(updated);
      if (type === 'gig-app') setGigApps(updated);
      if (type === 'app') setApps(updated);
    }
  };

  const updateAppStatus = (type: 'job' | 'gig', id: string, status: 'approved' | 'rejected') => {
    const storageKey = type === 'job' ? 'job_applications' : 'music_gig_applications';
    const current = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updated = current.map((app: any) => app.id === id ? { ...app, status } : app);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    if (type === 'job') setJobApps(updated);
    else setGigApps(updated);
  };

  const renderOverview = () => (
    <div className="animate-in fade-in duration-500">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-md">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h4 className={`text-3xl md:text-4xl font-black ${stat.color}`}>{stat.value}</h4>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="bg-slate-900 rounded-[3rem] p-10 text-white flex flex-col justify-center shadow-xl shadow-slate-200">
            <h3 className="text-2xl font-black mb-3">Vetting Center</h3>
            <p className="text-slate-400 mb-8 text-sm leading-relaxed">Review pending job and gig applications with AI matching assistance.</p>
            <button onClick={() => setActiveMenu('vetting')} className="w-fit px-8 py-3.5 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition-all text-xs uppercase tracking-widest">Open Vetting</button>
        </div>
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-10 flex flex-col justify-center">
            <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Post New Content</h3>
            <p className="text-slate-500 mb-8 text-sm font-medium">Inject new articles, jobs, or opportunities directly into the ecosystem.</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setIsJobModalOpen(true)} className="px-5 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase">New Job</button>
              <button onClick={() => setIsGigModalOpen(true)} className="px-5 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase">New Gig</button>
            </div>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-[3rem] p-10 flex flex-col justify-center">
            <h3 className="text-2xl font-black text-emerald-900 mb-3 tracking-tight">Course Review</h3>
            <p className="text-emerald-700/70 mb-8 text-sm font-medium">Manage incoming course proposals from industry experts.</p>
            <button onClick={() => setActiveMenu('reviews')} className="w-fit px-8 py-3.5 bg-white text-emerald-600 border border-emerald-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-100">Review Apps</button>
        </div>
      </div>
    </div>
  );

  const renderVetting = () => (
    <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-black text-xl">J</div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">Job Applications</h3>
          </div>
          <span className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">{jobApps.length} Pending</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {jobApps.length === 0 ? (
            <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-200 text-slate-300 font-bold italic">No pending job applications</div>
          ) : jobApps.map((app) => (
            <div key={app.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 font-black text-2xl">{app.candidateName.charAt(0)}</div>
                   <div>
                    <h4 className="text-xl font-black text-slate-900 leading-tight">{app.candidateName}</h4>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{app.candidateEmail}</p>
                  </div>
                </div>
                <span className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full shadow-sm ${
                  app.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 
                  app.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {app.status}
                </span>
              </div>
              <div className="bg-slate-50/80 p-6 rounded-2xl mb-6 flex-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Targeting: <span className="text-emerald-600 font-black">{app.jobTitle}</span></p>
                <p className="text-sm text-slate-600 leading-relaxed font-medium mb-4">{app.qualifications}</p>
                
                {appAnalysis[app.id] ? (
                   <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 animate-in zoom-in-95">
                      <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1 flex items-center gap-2"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg> AI Verdict</p>
                      <p className="text-xs text-indigo-900 font-bold italic">"{appAnalysis[app.id]}"</p>
                   </div>
                ) : (
                  <button 
                    onClick={() => handleAIReview(app)} 
                    disabled={analyzingAppId === app.id}
                    className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 disabled:opacity-50"
                  >
                    {analyzingAppId === app.id ? <div className="w-3 h-3 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" /> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                    AI Match Analysis
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => updateAppStatus('job', app.id, 'approved')} className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-emerald-100 hover:bg-emerald-700">Approve & Hire</button>
                <button onClick={() => updateAppStatus('job', app.id, 'rejected')} className="flex-1 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black text-[10px] uppercase hover:bg-red-50 hover:text-red-500">Reject</button>
                <button onClick={() => handleDelete('job-app', app.id)} className="px-5 py-4 bg-slate-50 text-slate-300 rounded-2xl hover:text-red-500 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderList = (type: string, data: any[], columns: string[]) => (
    <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
      <div className="md:hidden space-y-4">
        {data.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] border border-slate-100 text-center text-slate-300 font-bold italic">No records</div>
        ) : data.map((item, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            {columns.map((col, i) => (
              <div key={i} className="mb-4 last:mb-0">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">{col}</span>
                <span className="text-sm font-bold text-slate-800">{item[col.toLowerCase().replace(/\s+/g, '')] || item[col.toLowerCase()] || 'N/A'}</span>
              </div>
            ))}
            <div className="mt-6 pt-6 border-t border-slate-50 flex justify-end">
               <button onClick={() => handleDelete(type, item.id)} className="text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-50 px-6 py-2.5 rounded-xl">Delete Record</button>
            </div>
          </div>
        ))}
      </div>
      <div className="hidden md:block bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {columns.map((col, i) => <th key={i} className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{col}</th>)}
              <th className="px-10 py-6 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                {columns.map((col, i) => (
                  <td key={i} className="px-10 py-5 text-sm font-bold text-slate-600">
                    {item[col.toLowerCase().replace(/\s+/g, '')] || item[col.toLowerCase()] || 'N/A'}
                  </td>
                ))}
                <td className="px-10 py-5 text-right">
                  <button onClick={() => handleDelete(type, item.id)} className="opacity-0 group-hover:opacity-100 transition-all text-[10px] font-black text-red-500 uppercase tracking-widest">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-50 flex flex-col md:flex-row overflow-hidden animate-in fade-in">
      {/* Sidebar Nav */}
      <aside className="w-full md:w-80 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-8 md:p-10 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center font-black">R</div>
             <span className="font-black text-xl tracking-tighter">Admin <span className="text-emerald-500">PRO</span></span>
          </div>
          <button onClick={onClose} className="md:hidden text-slate-400">✕</button>
        </div>
        
        <nav className="flex-1 p-4 md:p-6 space-y-1 overflow-y-auto scrollbar-hide flex md:flex-col overflow-x-auto md:overflow-y-auto">
          {[
            { id: 'overview', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z' },
            { id: 'vetting', label: 'Vetting', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
            { id: 'articles', label: 'Library', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.168.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
            { id: 'jobs', label: 'Job Posts', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745V6c0-1.105.895-2 2-2h14c1.105 0 2 .895 2 2v7.255z' },
            { id: 'gigs', label: 'Music Gigs', icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z' },
            { id: 'ads', label: 'Ads Control', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id as any)}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-xs md:text-sm transition-all whitespace-nowrap md:whitespace-normal ${
                activeMenu === item.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/5 hover:text-white'
              }`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-8 md:p-10 bg-white/5 flex flex-col gap-3">
          <button onClick={onReturnHome} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 text-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            Live Site
          </button>
          <button onClick={onClose} className="w-full py-3 bg-white/5 text-slate-400 rounded-xl font-bold hover:text-white transition-all text-xs uppercase tracking-widest">Logout Session</button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50">
        <div className="p-8 md:p-16 max-w-6xl mx-auto">
          <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12 animate-in slide-in-from-top-4 duration-500">
            <div>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-2">Management Terminal</p>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter capitalize">{activeMenu === 'overview' ? 'Hub Overview' : activeMenu}</h2>
            </div>
            <div className="flex items-center gap-4">
               {activeMenu === 'vetting' && <span className="flex items-center gap-2 text-xs font-bold text-slate-400"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span> Live Sync Active</span>}
            </div>
          </header>

          <div className="min-h-[600px]">
            {activeMenu === 'overview' && renderOverview()}
            {activeMenu === 'vetting' && renderVetting()}
            {activeMenu === 'articles' && renderList('article', allArticles, ['Title', 'Category', 'Duration'])}
            {activeMenu === 'jobs' && renderList('job', jobs, ['Title', 'Company', 'Location', 'Type'])}
            {activeMenu === 'gigs' && renderList('gig', gigs, ['Title', 'Venue', 'Date', 'Pay'])}
            {activeMenu === 'ads' && renderList('ad', ads, ['ProductName', 'EntrepreneurName', 'Price'])}
            
            {activeMenu === 'reviews' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in zoom-in-95 duration-500">
                 {apps.length === 0 ? (
                   <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-200 text-slate-300 font-bold italic">No pending applications</div>
                 ) : apps.map((app, i) => (
                   <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col group hover:shadow-2xl transition-all">
                      <div className="flex justify-between items-start mb-8">
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">{app.courseCategory}</span>
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{new Date(app.timestamp).toLocaleDateString()}</span>
                      </div>
                      <h4 className="text-2xl font-black text-slate-900 mb-3 leading-tight">{app.courseTitle}</h4>
                      <p className="text-slate-500 text-sm mb-10 leading-relaxed line-clamp-3 font-medium flex-1">{app.courseDescription}</p>
                      
                      <div className="flex gap-2">
                        <button onClick={() => {
                            const newArt: Article = { 
                              id: `art-${Date.now()}`, 
                              title: app.courseTitle, 
                              category: app.courseCategory, 
                              duration: '15 mins', 
                              description: app.courseDescription, 
                              image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81', 
                              sections: app.modules || [] 
                            };
                            onUpdateArticles([...allArticles, newArt]);
                            handleDelete('app', app.id);
                            alert("Article Published Successfully!");
                        }} className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-emerald-100">Approve & Publish</button>
                        <button onClick={() => handleDelete('app', app.id)} className="flex-1 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black text-[10px] uppercase hover:bg-red-50 hover:text-red-500">Reject</button>
                      </div>
                   </div>
                 ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Reusable Post Modals */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-[3rem] w-full max-w-xl overflow-y-auto max-h-[90vh] shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
              <h3 className="text-3xl font-black tracking-tighter">System Job Injector</h3>
              <button onClick={() => setIsJobModalOpen(false)} className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-all">✕</button>
            </div>
            <form onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const newJob: Job = {
                  id: `job-${Date.now()}`,
                  title: fd.get('title') as string,
                  company: fd.get('company') as string,
                  location: fd.get('location') as string,
                  type: fd.get('type') as any,
                  category: 'General',
                  salaryRange: fd.get('salary') as string,
                  description: fd.get('description') as string,
                  postedDate: new Date().toISOString().split('T')[0],
                  requirements: (fd.get('requirements') as string).split(',').map(r => r.trim())
                };
                const updated = [newJob, ...jobs];
                setJobs(updated);
                localStorage.setItem('user_posted_jobs', JSON.stringify(updated));
                setIsJobModalOpen(false);
                alert("Live Injected!");
            }} className="p-10 space-y-6">
              <div className="space-y-4">
                <input name="title" placeholder="Professional Job Title" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 font-bold text-sm outline-none transition-all" required />
                <input name="company" placeholder="Official Company Name" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 font-bold text-sm outline-none transition-all" required />
                <div className="grid grid-cols-2 gap-4">
                  <input name="location" placeholder="City / Region" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 font-bold text-sm outline-none transition-all" required />
                  <select name="type" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 font-bold text-sm outline-none transition-all bg-white">
                    <option>Full-time</option>
                    <option>Internship</option>
                    <option>Apprenticeship</option>
                    <option>Remote</option>
                  </select>
                </div>
                <textarea name="description" placeholder="Full Job Description..." className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 h-32 resize-none font-medium text-sm outline-none transition-all" required />
                <input name="requirements" placeholder="Key Requirements (comma separated)" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 font-bold text-sm outline-none transition-all" required />
              </div>
              <button type="submit" className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all">Push to Ecosystem</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
