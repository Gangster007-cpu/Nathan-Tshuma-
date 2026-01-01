
import React, { useState, useMemo, useEffect } from 'react';
import { JOBS } from '../constants';
import { Job, JobMatchResult, JobApplication } from '../types';
import { matchJobsToUser } from '../services/geminiService';

const JobsBoard: React.FC<{ userProfile: { name: string; email: string } | null }> = ({ userProfile }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState('All');
  const [matching, setMatching] = useState(false);
  const [matchResults, setMatchResults] = useState<JobMatchResult[]>([]);
  const [showApplySuccess, setShowApplySuccess] = useState<string | null>(null);
  const [userJobs, setUserJobs] = useState<Job[]>([]);
  const [showJobForm, setShowJobForm] = useState(false);
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);
  
  const [newJob, setNewJob] = useState({ title: '', company: '', location: '', type: 'Full-time', category: 'General', salaryRange: '', description: '', requirements: '' });
  const [applicationData, setApplicationData] = useState({ qualifications: '', cvFile: null as File | null });

  const [userBio, setUserBio] = useState('');
  const [userInterests, setUserInterests] = useState('');
  const [showProfileEditor, setShowProfileEditor] = useState(false);

  const jobTypes = ['All', 'Full-time', 'Internship', 'Apprenticeship', 'Remote'];

  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem('user_posted_jobs') || '[]');
    setUserJobs(savedJobs);
  }, []);

  const allAvailableJobs = useMemo(() => [...JOBS, ...userJobs], [userJobs]);

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    const job: Job = {
      id: `ujob-${Date.now()}`,
      title: newJob.title,
      company: newJob.company,
      location: newJob.location,
      type: newJob.type as any,
      category: newJob.category,
      salaryRange: newJob.salaryRange,
      description: newJob.description,
      postedDate: new Date().toISOString().split('T')[0],
      requirements: newJob.requirements.split(',').map(r => r.trim())
    };
    const updated = [job, ...userJobs];
    setUserJobs(updated);
    localStorage.setItem('user_posted_jobs', JSON.stringify(updated));
    setShowJobForm(false);
    setNewJob({ title: '', company: '', location: '', type: 'Full-time', category: 'General', salaryRange: '', description: '', requirements: '' });
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingJob || !userProfile) return;

    const application: JobApplication = {
      id: `app-${Date.now()}`,
      jobId: applyingJob.id,
      jobTitle: applyingJob.title,
      candidateName: userProfile.name,
      candidateEmail: userProfile.email,
      qualifications: applicationData.qualifications,
      cvFileName: applicationData.cvFile?.name || 'No file attached',
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    const currentApps = JSON.parse(localStorage.getItem('job_applications') || '[]');
    localStorage.setItem('job_applications', JSON.stringify([application, ...currentApps]));

    setShowApplySuccess(applyingJob.id);
    setApplyingJob(null);
    setApplicationData({ qualifications: '', cvFile: null });
    setTimeout(() => setShowApplySuccess(null), 3000);
  };

  const filteredJobs = useMemo(() => {
    let list = allAvailableJobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = activeType === 'All' || job.type === activeType;
      return matchesSearch && matchesType;
    });

    if (matchResults.length > 0) {
      return [...list].sort((a, b) => {
        const scoreA = matchResults.find(m => m.jobId === a.id)?.matchScore || 0;
        const scoreB = matchResults.find(m => m.jobId === b.id)?.matchScore || 0;
        return scoreB - scoreA;
      });
    }
    return list;
  }, [searchQuery, activeType, matchResults, allAvailableJobs]);

  const handleAIMatch = async () => {
    if (!userProfile) return;
    if (!userBio || !userInterests) {
      setShowProfileEditor(true);
      return;
    }
    setMatching(true);
    try {
      const profileInfo = { background: userBio, interests: userInterests };
      const results = await matchJobsToUser(profileInfo, allAvailableJobs);
      setMatchResults(results);
      setShowProfileEditor(false);
    } catch (err) {
      console.error(err);
    } finally {
      setMatching(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Opportunity Board</h1>
          <p className="text-lg text-slate-500 max-w-xl">Find roles or post offerings tailored to your professional identity.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setShowJobForm(true)} className="px-6 py-4 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100">Post a Job Offering</button>
          <button onClick={() => setShowProfileEditor(!showProfileEditor)} className="flex items-center gap-3 px-6 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-black hover:bg-slate-50 transition-all shadow-sm">My Profile Identity</button>
          <button onClick={handleAIMatch} disabled={matching} className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50">
            {matching ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> AI Matcher</>}
          </button>
        </div>
      </div>

      {showProfileEditor && (
        <div className="mb-12 p-10 bg-white rounded-[3rem] border border-emerald-100 shadow-2xl animate-in slide-in-from-top-4 duration-500">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black text-slate-900">Professional Identity</h3>
            <button onClick={() => setShowProfileEditor(false)} className="text-slate-400 hover:text-slate-900">✕</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Bio & Background</label>
              <textarea value={userBio} onChange={(e) => setUserBio(e.target.value)} placeholder="Describe your experience..." className="w-full px-6 py-4 rounded-2xl border border-slate-200 h-32 focus:ring-4 focus:ring-emerald-50 outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Interests & Goals</label>
              <textarea value={userInterests} onChange={(e) => setUserInterests(e.target.value)} placeholder="What roles are you looking for?" className="w-full px-6 py-4 rounded-2xl border border-slate-200 h-32 focus:ring-4 focus:ring-emerald-50 outline-none" />
            </div>
          </div>
          <button onClick={handleAIMatch} className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black shadow-lg">Refresh AI Matches</button>
        </div>
      )}

      {/* Application Modal */}
      {applyingJob && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-emerald-600 text-white">
              <div>
                <h3 className="text-xl font-black">Apply for {applyingJob.title}</h3>
                <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest">{applyingJob.company}</p>
              </div>
              <button onClick={() => setApplyingJob(null)} className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-full">✕</button>
            </div>
            <form onSubmit={handleApplySubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Qualifications & Experience Summary</label>
                <textarea 
                  placeholder="Summarize your best skills for this specific role..." 
                  className="w-full px-5 py-3 rounded-xl border border-slate-200 h-32 resize-none outline-none focus:ring-4 focus:ring-emerald-50 font-medium text-sm" 
                  value={applicationData.qualifications} 
                  onChange={e => setApplicationData({...applicationData, qualifications: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Attach Professional CV (PDF/Word)</label>
                <div className="relative group">
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    onChange={e => setApplicationData({...applicationData, cvFile: e.target.files?.[0] || null})} 
                    required 
                  />
                  <div className="w-full py-4 px-5 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center gap-2 group-hover:border-emerald-400 transition-all">
                    <svg className="w-5 h-5 text-slate-400 group-hover:text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M16 8l-4-4m0 0l-4 4m4-4v12" /></svg>
                    <span className="text-sm font-bold text-slate-500 group-hover:text-emerald-600">
                      {applicationData.cvFile ? applicationData.cvFile.name : 'Choose file to upload'}
                    </span>
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-100">Submit Official Application</button>
            </form>
          </div>
        </div>
      )}

      {showJobForm && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={() => setShowJobForm(false)}>
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900">Post a Job Offering</h3>
              <button onClick={() => setShowJobForm(false)} className="text-slate-400 hover:text-slate-900">✕</button>
            </div>
            <form onSubmit={handlePostJob} className="p-8 space-y-4">
              <input placeholder="Job Title" className="w-full px-5 py-3 rounded-xl border border-slate-200" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} required />
              <input placeholder="Company Name" className="w-full px-5 py-3 rounded-xl border border-slate-200" value={newJob.company} onChange={e => setNewJob({...newJob, company: e.target.value})} required />
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Location" className="w-full px-5 py-3 rounded-xl border border-slate-200" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} required />
                <input placeholder="Salary / Wage (e.g. $600 USD/mo)" className="w-full px-5 py-3 rounded-xl border border-slate-200" value={newJob.salaryRange} onChange={e => setNewJob({...newJob, salaryRange: e.target.value})} required />
              </div>
              <textarea placeholder="Job Description" className="w-full px-5 py-3 rounded-xl border border-slate-200 h-24" value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} required />
              <input placeholder="Requirements (comma separated)" className="w-full px-5 py-3 rounded-xl border border-slate-200" value={newJob.requirements} onChange={e => setNewJob({...newJob, requirements: e.target.value})} required />
              <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-xl font-black hover:bg-emerald-600 transition-all shadow-xl">Submit Job Posting</button>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 mb-12">
        <div className="relative flex-1">
          <input type="text" placeholder="Search for opportunities..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-14 pr-6 py-5 rounded-[2rem] border border-slate-200 outline-none transition-all bg-white font-medium focus:ring-4 focus:ring-emerald-50" />
          <svg className="absolute left-6 top-5 w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 md:pb-0">
          {jobTypes.map(type => (
            <button key={type} onClick={() => setActiveType(type)} className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeType === type ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}>{type}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredJobs.map(job => {
          const match = matchResults.find(m => m.jobId === job.id);
          return (
            <div key={job.id} className={`bg-white rounded-[2.5rem] p-10 border transition-all flex flex-col hover:shadow-2xl ${match ? 'border-emerald-200 ring-4 ring-emerald-50 shadow-emerald-100' : 'border-slate-100 shadow-sm'}`}>
              <div className="flex justify-between items-start mb-8"><div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-slate-300 text-2xl border border-slate-100">{job.company.charAt(0)}</div></div>
              <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight">{job.title}</h3>
              <p className="text-emerald-600 font-black text-sm mb-6 uppercase tracking-widest">{job.company}</p>
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="bg-slate-50 text-slate-500 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100">{job.location}</span>
                {job.salaryRange && <span className="bg-amber-50 text-amber-700 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-100">{job.salaryRange}</span>}
              </div>
              <p className="text-slate-500 text-sm mb-8 line-clamp-4 leading-relaxed font-medium">{job.description}</p>
              <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Added {job.postedDate}</span>
                {showApplySuccess === job.id ? <span className="text-emerald-600 font-black text-sm">Application Sent ✓</span> : <button onClick={() => setApplyingJob(job)} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-xs hover:bg-emerald-600 shadow-lg">Apply Now</button>}
              </div>
            </div>
          );
        })}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
          <h3 className="text-2xl font-black text-slate-400 mb-4 tracking-tighter">No job offerings posted yet.</h3>
          <button onClick={() => setShowJobForm(true)} className="text-emerald-600 font-black uppercase tracking-widest hover:underline text-sm">Post the First Job Offering</button>
        </div>
      )}
    </div>
  );
};

export default JobsBoard;
