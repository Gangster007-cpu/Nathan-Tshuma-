import React, { useState, useEffect } from 'react';
import { Article, Job, MusicCollabRequest, MarketplaceAd } from '../types';

interface AdsDashboardProps {
  onReturnHome: () => void;
  allArticles: Article[];
  onUpdateArticles: (articles: Article[]) => void;
}

const AdsDashboard: React.FC<AdsDashboardProps> = ({ onReturnHome, allArticles, onUpdateArticles }) => {
  const [activeTab, setActiveTab] = useState<'articles' | 'ads' | 'jobs' | 'collabs' | 'applications'>('ads');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [collabs, setCollabs] = useState<MusicCollabRequest[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [ads, setAds] = useState<MarketplaceAd[]>([]);
  
  const [showAddArticle, setShowAddArticle] = useState(false);
  const [showAddAd, setShowAddAd] = useState(false);
  
  const [newArticle, setNewArticle] = useState<Partial<Article>>({
    title: '',
    category: 'Digital Skills',
    duration: '10 mins',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800',
    description: '',
    sections: []
  });

  const [newAd, setNewAd] = useState<Partial<MarketplaceAd>>({
    productName: '',
    entrepreneurName: '',
    price: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
    contactInfo: '',
    category: 'General'
  });

  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem('user_posted_jobs') || '[]');
    const savedCollabs = JSON.parse(localStorage.getItem('user_music_collabs') || '[]');
    const savedApps = JSON.parse(localStorage.getItem('instructor_applications') || '[]');
    const savedAds = JSON.parse(localStorage.getItem('marketplace_ads') || '[]');
    
    setJobs(savedJobs);
    setCollabs(savedCollabs);
    setApplications(savedApps);
    setAds(savedAds);
  }, []);

  const handleDeleteArticle = (id: string) => {
    if (window.confirm("Delete this article?")) {
      const updated = allArticles.filter(a => a.id !== id);
      onUpdateArticles(updated);
    }
  };

  const handleDeleteAd = (id: string) => {
    if (window.confirm("Remove this advertisement?")) {
      const updated = ads.filter(ad => ad.id !== id);
      localStorage.setItem('marketplace_ads', JSON.stringify(updated));
      setAds(updated);
    }
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

  const handleAddAd = (e: React.FormEvent) => {
    e.preventDefault();
    const ad: MarketplaceAd = {
      id: `ad-${Date.now()}`,
      productName: newAd.productName || 'Unnamed Product',
      entrepreneurName: newAd.entrepreneurName || 'Unknown Entrepreneur',
      price: newAd.price || 'Contact for Price',
      description: newAd.description || '',
      image: newAd.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
      contactInfo: newAd.contactInfo || '',
      category: newAd.category || 'General'
    };
    const updatedAds = [...ads, ad];
    setAds(updatedAds);
    localStorage.setItem('marketplace_ads', JSON.stringify(updatedAds));
    setShowAddAd(false);
    setNewAd({ productName: '', entrepreneurName: '', price: '', description: '', contactInfo: '', category: 'General' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Ads & Content Hub</h1>
          <p className="text-lg text-slate-500">Empowering youth entrepreneurs to showcase products and share knowledge.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto scrollbar-hide">
          {([
            { id: 'ads', label: 'Product Ads' },
            { id: 'articles', label: 'Articles' },
            { id: 'jobs', label: 'User Jobs' },
            { id: 'collabs', label: 'Collabs' },
            { id: 'applications', label: 'Applications' }
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[600px]">
        {activeTab === 'ads' && (
          <div className="space-y-10">
            {/* Posting Options Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-emerald-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden group hover:shadow-2xl hover:shadow-emerald-200 transition-all cursor-pointer" onClick={() => setShowAddAd(true)}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  </div>
                  <h3 className="text-3xl font-black mb-4 tracking-tight">Post New Ad</h3>
                  <p className="text-emerald-50 mb-8 max-w-xs font-medium leading-relaxed">Showcase your product or service to the RiseUp Zim community. High visibility for local youth businesses.</p>
                  <span className="inline-flex items-center gap-2 font-black text-xs uppercase tracking-widest bg-white text-emerald-600 px-6 py-3 rounded-xl shadow-lg">Start Advertising Now</span>
                </div>
              </div>

              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white flex flex-col justify-center border border-slate-800">
                <h4 className="text-xl font-black mb-2">Advertising Tips</h4>
                <ul className="space-y-4 text-slate-400 text-sm font-medium">
                  <li className="flex gap-3"><span className="text-emerald-500">●</span> Use clear, high-quality images of your product.</li>
                  <li className="flex gap-3"><span className="text-emerald-500">●</span> Be specific about pricing (USD or ZiG).</li>
                  <li className="flex gap-3"><span className="text-emerald-500">●</span> Include valid WhatsApp or Email contact info.</li>
                  <li className="flex gap-3"><span className="text-emerald-500">●</span> Keep your description concise and punchy.</li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-emerald-500 rounded-full"></span>
                Existing Marketplace Ads
              </h3>
              {ads.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 text-slate-400 font-bold">No active ads to display. Start by posting one above!</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ads.map(ad => (
                    <div key={ad.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col group hover:border-emerald-200 transition-all">
                      <div className="h-40 bg-slate-100 rounded-2xl mb-4 overflow-hidden">
                        <img src={ad.image} alt={ad.productName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      <h4 className="font-black text-slate-900 mb-1">{ad.productName}</h4>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2">{ad.price}</p>
                      <p className="text-xs text-slate-400 mb-4 font-bold italic">By {ad.entrepreneurName}</p>
                      <button onClick={() => handleDeleteAd(ad.id)} className="mt-auto w-full py-3 bg-red-50 text-red-600 rounded-xl font-black text-xs hover:bg-red-600 hover:text-white transition-all">Delete Advertisement</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'articles' && (
          <div className="space-y-10">
            <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
              <div className="flex-1 text-center md:text-left">
                 <h3 className="text-3xl font-black text-slate-900 mb-2">Share Knowledge</h3>
                 <p className="text-slate-500 max-w-md font-medium">Upload educational content or helpful articles that can benefit the Zimbabwean youth community.</p>
              </div>
              <button onClick={() => setShowAddArticle(true)} className="px-10 py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 whitespace-nowrap">Upload Beneficial Post</button>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-emerald-500 rounded-full"></span>
                Manage Library Content
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allArticles.map(art => (
                  <div key={art.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col group">
                    <div className="h-40 bg-slate-100 rounded-2xl mb-4 overflow-hidden">
                      <img src={art.image} alt={art.title} className="w-full h-full object-cover" />
                    </div>
                    <h4 className="font-black text-slate-900 mb-1">{art.title}</h4>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-4">{art.category}</p>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-6">{art.description}</p>
                    <button onClick={() => handleDeleteArticle(art.id)} className="mt-auto w-full py-3 bg-red-50 text-red-600 rounded-xl font-black text-xs hover:bg-red-600 hover:text-white transition-all">Remove Article</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-slate-900">Moderating Job Postings</h3>
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
                    <button onClick={() => {
                        const updated = jobs.filter((j: any) => j.id !== job.id);
                        localStorage.setItem('user_posted_jobs', JSON.stringify(updated));
                        setJobs(updated);
                    }} className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-black text-xs hover:bg-red-600 hover:text-white transition-all">Remove Post</button>
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
                    <button onClick={() => {
                        const updated = collabs.filter((c: any) => c.id !== collab.id);
                        localStorage.setItem('user_music_collabs', JSON.stringify(updated));
                        setCollabs(updated);
                    }} className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-black text-xs hover:bg-red-600 hover:text-white transition-all">Remove Request</button>
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
                      <button onClick={() => {
                        const updated = applications.filter(a => a.id !== app.id);
                        localStorage.setItem('instructor_applications', JSON.stringify(updated));
                        setApplications(updated);
                        alert("Application approved! (Demo functionality)");
                      }} className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">Approve & Publish</button>
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

      {showAddAd && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={() => setShowAddAd(false)}>
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Post New Advertisement</h3>
              <button onClick={() => setShowAddAd(false)} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full text-slate-400 hover:text-slate-900 transition-all">✕</button>
            </div>
            <form onSubmit={handleAddAd} className="p-8 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Product/Service Name</label>
                <input placeholder="e.g. Organic Mushroom Packs" className="w-full px-5 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all font-medium" value={newAd.productName} onChange={e => setNewAd({...newAd, productName: e.target.value})} required />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Business/Entrepreneur Name</label>
                <input placeholder="e.g. Mutasa Agri-Enterprises" className="w-full px-5 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all font-medium" value={newAd.entrepreneurName} onChange={e => setNewAd({...newAd, entrepreneurName: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Price (with Currency)</label>
                  <input placeholder="e.g. $10 USD / 150 ZiG" className="w-full px-5 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all font-medium" value={newAd.price} onChange={e => setNewAd({...newAd, price: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Contact Info (WhatsApp/Email)</label>
                  <input placeholder="e.g. +263 7..." className="w-full px-5 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all font-medium" value={newAd.contactInfo} onChange={e => setNewAd({...newAd, contactInfo: e.target.value})} required />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Brief Description</label>
                <textarea placeholder="Tell your customers why they should buy your product..." className="w-full px-5 py-3 rounded-2xl border border-slate-200 h-28 resize-none outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all font-medium" value={newAd.description} onChange={e => setNewAd({...newAd, description: e.target.value})} required />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Image URL</label>
                <input placeholder="Link to your product image" className="w-full px-5 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all font-medium" value={newAd.image} onChange={e => setNewAd({...newAd, image: e.target.value})} required />
              </div>
              <button type="submit" className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all mt-4">Launch Advertisement</button>
            </form>
          </div>
        </div>
      )}

      {showAddArticle && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={() => setShowAddArticle(false)}>
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Upload Beneficial Post</h3>
              <button onClick={() => setShowAddArticle(false)} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full text-slate-400 hover:text-slate-900 transition-all">✕</button>
            </div>
            <form onSubmit={handleAddArticle} className="p-8 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Post Title</label>
                <input placeholder="e.g. 5 Tips for Successful Farming" className="w-full px-5 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all font-medium" value={newArticle.title} onChange={e => setNewArticle({...newArticle, title: e.target.value})} required />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Category</label>
                <select className="w-full px-5 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all font-medium" value={newArticle.category} onChange={e => setNewArticle({...newArticle, category: e.target.value as any})} required>
                  <option>Digital Skills</option>
                  <option>Agribusiness</option>
                  <option>Vocational Training</option>
                  <option>Entrepreneurship</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Intro / Body Text</label>
                <textarea placeholder="Write the main content of your post here..." className="w-full px-5 py-3 rounded-2xl border border-slate-200 h-40 resize-none outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all font-medium" value={newArticle.description} onChange={e => setNewArticle({...newArticle, description: e.target.value})} required />
              </div>
              <button type="submit" className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all mt-4">Publish to Library</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdsDashboard;