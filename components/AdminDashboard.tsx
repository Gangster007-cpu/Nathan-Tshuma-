import React, { useState, useEffect } from 'react';
import { Article, Job, MusicCollabRequest } from '../types';

interface AdminDashboardProps {
  onReturnHome: () => void;
  allArticles: Article[];
  onUpdateArticles: (articles: Article[]) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onReturnHome, allArticles, onUpdateArticles }) => {
  const [activeTab, setActiveTab] = useState<'articles' | 'jobs' | 'collabs' | 'applications'>('articles');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [collabs, setCollabs] = useState<MusicCollabRequest[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [showAddArticle, setShowAddArticle] = useState(false);
  
  const [newArticle, setNewArticle] = useState<Partial<Article>>({
    title: '',
    category: 'Digital Skills',
    duration: '10 mins',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800',
    description: '',
    sections: []
  });

  useEffect(() => {
    // Load dynamic data from localStorage
    const savedJobs = JSON.parse(localStorage.getItem('user_posted_jobs') || '[]');
    const savedCollabs = JSON.parse(localStorage.getItem('user_music_collabs') || '[]');
    const savedApps = JSON.parse(localStorage.getItem('instructor_applications') || '[]');
    
    setJobs(savedJobs);
    setCollabs(savedCollabs);
    setApplications(savedApps);
  }, []);

  const handleDeleteArticle = (id: string) => {
    if (window.confirm("Delete this article?")) {
      const updated = allArticles.filter(a => a.id !== id);
      onUpdateArticles(updated);
    }
  };

  const handleDeleteJob = (id: string) => {
    if (window.confirm("Delete this job posting?")) {
      const savedJobs = JSON.parse(localStorage.getItem('user_posted_jobs') || '[]');
      const updated = savedJobs.filter((j: any) => j.id !== id);
      localStorage.setItem('user_posted_jobs', JSON.stringify(updated));
      setJobs(updated);
    }
  };

  const handleDeleteCollab = (id: string) => {
    if (window.confirm("Delete this collaboration request?")) {
      const savedCollabs = JSON.parse(localStorage.getItem('user_music_collabs') || '[]');
      const updated = savedCollabs.filter((c: any) => c.id !== id);
      localStorage.setItem('user_music_collabs', JSON.stringify(updated));
      setCollabs(updated);
    }
  };

  const handleApproveApplication = (id: string) => {
    // In a real app, this would convert the application into a formal Course/Article
    alert("Application approved! Content has been published.");
    const updated = applications.filter(a => a.id !== id);
    localStorage.setItem('instructor_applications', JSON.stringify(updated));
    setApplications(updated);
  };

  const handleAddArticle = (e: React.FormEvent) => {
    e.preventDefault();
    const article: Article = {
      id: `art-${Date.now()}`,
      title: newArticle.title || 'Untitled',
      category: newArticle.category as any || 'Digital Skills',
      duration: newArticle.duration || '10 mins',
      image: newArticle.image || '',
      description: newArticle.description || '',
      sections: [
        { id: 's1', title: 'Overview', duration: '5 mins', content: newArticle.description || '' }
      ]
    };
    onUpdateArticles([...allArticles, article]);
    setShowAddArticle(false);
    setNewArticle({ title: '', category: 'Digital Skills', duration: '10 mins', description: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Admin Dashboard</h1>
          <p className="text-lg text-slate-500">System management and content moderation portal.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
          {([
            { id: 'articles', label: 'Articles' },
            { id: 'jobs', label: 'User Jobs' },
            { id: 'collabs', label: 'Collabs' },
            { id: 'applications', label: 'Applications' }
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[600px]">
        {activeTab === 'articles' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900">Manage Skill Guides</h3>
              <button onClick={() => setShowAddArticle(true)} className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs hover:bg-emerald-700 transition-all shadow-lg">Upload New Article</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allArticles.map(art => (
                <div key={art.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col group">
                  <div className="h-40 bg-slate-100 rounded-2xl mb-4 overflow-hidden">
                    <img src={art.image} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-black text-slate-900 mb-1">{art.title}</h4>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-4">{art.category}</p>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-6">{art.description}</p>
                  <button onClick={() => handleDeleteArticle(art.id)} className="mt-auto w-full py-3 bg-red-50 text-red-600 rounded-xl font-black text-xs hover:bg-red-600 hover:text-white transition-all">Delete Article</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-slate-900">Moderating User Job Postings</h3>
            {jobs.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 text-slate-400 font-bold">No user jobs to moderate.</div>
            ) : (
              <div className="space-y-4">
                {jobs.map(job => (
                  <div key={job.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 flex items-center justify-between gap-6 shadow-sm">
                    <div>
                      <h4 className="text-xl font-black text-slate-900">{job.title}</h4>
                      <p className="text-sm font-bold text-slate-400">{job.company} • {job.location}</p>
                    </div>
                    <button onClick={() => handleDeleteJob(job.id)} className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-black text-xs hover:bg-red-600 hover:text-white transition-all">Remove Post</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'collabs' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-slate-900">Moderating Collaboration Requests</h3>
            {collabs.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 text-slate-400 font-bold">No collaboration requests to moderate.</div>
            ) : (
              <div className="space-y-4">
                {collabs.map(collab => (
                  <div key={collab.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 flex items-center justify-between gap-6 shadow-sm">
                    <div>
                      <h4 className="text-xl font-black text-slate-900">{collab.artistName} • {collab.projectType}</h4>
                      <p className="text-sm text-slate-500 line-clamp-1">{collab.description}</p>
                    </div>
                    <button onClick={() => handleDeleteCollab(collab.id)} className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-black text-xs hover:bg-red-600 hover:text-white transition-all">Remove Request</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-slate-900">Pending Instructor Course Applications</h3>
            {applications.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 text-slate-400 font-bold">No pending applications.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {applications.map((app, i) => (
                  <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">{app.courseCategory}</span>
                    </div>
                    <h4 className="text-xl font-black text-slate-900 mb-2">{app.courseTitle}</h4>
                    <p className="text-sm text-slate-500 mb-6">{app.courseDescription}</p>
                    <div className="flex gap-4">
                      <button onClick={() => handleApproveApplication(app.id)} className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">Approve & Publish</button>
                      <button onClick={() => {
                        const updated = applications.filter(a => a.id !== app.id);
                        localStorage.setItem('instructor_applications', JSON.stringify(updated));
                        setApplications(updated);
                      }} className="flex-1 py-3 bg-slate-50 text-slate-400 rounded-xl font-black text-xs hover:bg-red-50 hover:text-red-600 transition-all">Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showAddArticle && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={() => setShowAddArticle(false)}>
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900">Upload New Article</h3>
              <button onClick={() => setShowAddArticle(false)} className="text-slate-400 hover:text-slate-900">✕</button>
            </div>
            <form onSubmit={handleAddArticle} className="p-8 space-y-4">
              <input placeholder="Article Title" className="w-full px-5 py-3 rounded-xl border border-slate-200" value={newArticle.title} onChange={e => setNewArticle({...newArticle, title: e.target.value})} required />
              <select className="w-full px-5 py-3 rounded-xl border border-slate-200" value={newArticle.category} onChange={e => setNewArticle({...newArticle, category: e.target.value as any})} required>
                <option>Digital Skills</option>
                <option>Agribusiness</option>
                <option>Vocational Training</option>
                <option>Entrepreneurship</option>
              </select>
              <input placeholder="Image URL" className="w-full px-5 py-3 rounded-xl border border-slate-200" value={newArticle.image} onChange={e => setNewArticle({...newArticle, image: e.target.value})} required />
              <textarea placeholder="Description / Intro Content" className="w-full px-5 py-3 rounded-xl border border-slate-200 h-32" value={newArticle.description} onChange={e => setNewArticle({...newArticle, description: e.target.value})} required />
              <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black shadow-lg hover:bg-emerald-700 transition-all">Publish Live</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;