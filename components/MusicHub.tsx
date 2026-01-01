
import React, { useState, useEffect } from 'react';
import { MUSIC_ARTISTS, MUSIC_ARTICLES, MUSIC_GIGS } from '../constants';
import { MusicArtist, MusicArticle, MusicGig, MusicCollabRequest, MusicGigApplication } from '../types';

type MusicTab = 'discover' | 'learn' | 'collaborate' | 'gigs' | 'profile';

const SocialIcon = ({ platform, className = "w-5 h-5" }: { platform: string, className?: string }) => {
  const p = platform.toLowerCase();
  if (p.includes('instagram')) return <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>;
  if (p.includes('youtube')) return <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>;
  if (p.includes('facebook')) return <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-8.784h-2.956v-3.427h2.956v-2.529c0-2.93 1.789-4.524 4.404-4.524 1.252 0 2.329.093 2.643.135v3.064h-1.813c-1.422 0-1.697.676-1.697 1.666v2.188h3.393l-.442 3.427h-2.951v8.784h6.075c.731 0 1.325-.593 1.325-1.324v-21.351c0-.732-.594-1.325-1.325-1.325z"/></svg>;
  if (p.includes('twitter')) return <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>;
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 10-5.656-5.656l-1.102 1.101" /></svg>;
};

const MusicHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MusicTab>('discover');
  const [selectedArtist, setSelectedArtist] = useState<MusicArtist | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<MusicArticle | null>(null);
  const [userGigs, setUserGigs] = useState<MusicGig[]>([]);
  const [showGigForm, setShowGigForm] = useState(false);
  const [applyingGig, setApplyingGig] = useState<MusicGig | null>(null);
  const [showApplySuccess, setShowApplySuccess] = useState<string | null>(null);

  const [newGig, setNewGig] = useState({ title: '', venue: '', date: '', pay: '', requirements: '' });
  const [gigApplication, setGigApplication] = useState({ sampleLink: '', sampleFile: null as File | null });

  const [userCollabs, setUserCollabs] = useState<MusicCollabRequest[]>([]);
  const [showCollabForm, setShowCollabForm] = useState(false);
  const [newCollab, setNewCollab] = useState({ projectType: '', skillsNeeded: '', description: '' });
  const [connectionSent, setConnectionSent] = useState<string | null>(null);

  useEffect(() => {
    const savedCollabs = JSON.parse(localStorage.getItem('user_music_collabs') || '[]');
    const savedGigs = JSON.parse(localStorage.getItem('user_music_gigs') || '[]');
    setUserCollabs(savedCollabs);
    setUserGigs(savedGigs);
  }, []);

  const allGigs = [...MUSIC_GIGS, ...userGigs];

  const handlePostGig = (e: React.FormEvent) => {
    e.preventDefault();
    const gig: MusicGig = {
      id: `ug-${Date.now()}`,
      title: newGig.title,
      venue: newGig.venue,
      date: newGig.date,
      pay: newGig.pay,
      requirements: newGig.requirements.split(',').map(r => r.trim())
    };
    const updated = [gig, ...userGigs];
    setUserGigs(updated);
    localStorage.setItem('user_music_gigs', JSON.stringify(updated));
    setShowGigForm(false);
    setNewGig({ title: '', venue: '', date: '', pay: '', requirements: '' });
  };

  const handleGigApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userProfile = JSON.parse(localStorage.getItem('current_user') || sessionStorage.getItem('current_user') || 'null');
    if (!applyingGig || !userProfile) return;

    const application: MusicGigApplication = {
      id: `gig-app-${Date.now()}`,
      gigId: applyingGig.id,
      gigTitle: applyingGig.title,
      artistName: userProfile.name,
      artistEmail: userProfile.email,
      sampleLink: gigApplication.sampleLink,
      sampleFileName: gigApplication.sampleFile?.name || 'No file attached',
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    const currentApps = JSON.parse(localStorage.getItem('music_gig_applications') || '[]');
    localStorage.setItem('music_gig_applications', JSON.stringify([application, ...currentApps]));

    setShowApplySuccess(applyingGig.id);
    setApplyingGig(null);
    setGigApplication({ sampleLink: '', sampleFile: null });
    setTimeout(() => setShowApplySuccess(null), 3000);
  };

  const handlePostCollab = (e: React.FormEvent) => {
    e.preventDefault();
    const collab: MusicCollabRequest = {
      id: `uc-${Date.now()}`,
      artistName: 'Anonymous Artist',
      projectType: newCollab.projectType,
      skillsNeeded: newCollab.skillsNeeded.split(',').map(s => s.trim()),
      description: newCollab.description,
      postedDate: new Date().toISOString().split('T')[0]
    };
    const updated = [collab, ...userCollabs];
    setUserCollabs(updated);
    localStorage.setItem('user_music_collabs', JSON.stringify(updated));
    setShowCollabForm(false);
    setNewCollab({ projectType: '', skillsNeeded: '', description: '' });
  };

  const handleConnect = (collabId: string) => {
    setConnectionSent(collabId);
    setTimeout(() => setConnectionSent(null), 3000);
  };

  const renderSectionContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('### ')) return <h3 key={i} className="text-2xl font-black text-slate-900 mt-8 mb-4">{line.replace('### ', '')}</h3>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-3xl font-black text-indigo-700 mt-10 mb-6 border-l-4 border-indigo-500 pl-4">{line.replace('## ', '')}</h2>;
      if (line.startsWith('- ')) return <li key={i} className="ml-6 list-disc text-slate-700 mb-2">{line.replace('- ', '')}</li>;
      return <p key={i} className="text-lg text-slate-600 leading-relaxed mb-4">{line}</p>;
    });
  };

  const renderDiscover = () => (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-2xl font-black text-slate-900">Trending Artists</h3>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Based on Weekly Streams</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {MUSIC_ARTISTS.map(artist => (
          <div key={artist.id} onClick={() => setSelectedArtist(artist)} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all cursor-pointer group">
            <div className="relative h-64 overflow-hidden">
              <img src={artist.image} alt={artist.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">{artist.genre}</span>
                <h3 className="text-2xl font-black text-white mt-2 leading-tight">{artist.name}</h3>
              </div>
            </div>
            <div className="p-8">
              <p className="text-slate-500 text-sm mb-6 line-clamp-2">{artist.bio}</p>
              <div className="flex gap-2 mb-4">
                {artist.socialLinks?.map((s, idx) => (
                  <div key={idx} className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors">
                    <SocialIcon platform={s.platform} className="w-4 h-4" />
                  </div>
                ))}
              </div>
              <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{artist.tracks[0].plays.toLocaleString()} Listens</span>
                <button className="text-indigo-600 text-xs font-black uppercase tracking-widest group-hover:underline">View Portfolio →</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /**
   * Fix: Added missing renderLearn function.
   */
  const renderLearn = () => {
    if (selectedArticle) {
      return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button onClick={() => setSelectedArticle(null)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold mb-8 transition-colors group">
            <div className="p-1 rounded-lg group-hover:bg-indigo-50 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></div>Back to Academy
          </button>
          <article className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 pb-20">
             <div className="relative h-[400px]">
                <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                <div className="absolute bottom-12 left-12 right-12">
                   <h1 className="text-4xl font-black text-white leading-tight">{selectedArticle.title}</h1>
                </div>
             </div>
             <div className="px-12 py-12">
                <div className="prose prose-slate max-w-none text-slate-700">
                   <p className="text-xl text-slate-500 font-medium italic mb-12 border-l-4 border-indigo-500 pl-6 bg-indigo-50/30 py-4">{selectedArticle.description}</p>
                   {selectedArticle.sections.map((section) => (
                     <div key={section.id} className="mb-16 last:mb-0">{renderSectionContent(section.content)}</div>
                   ))}
                </div>
             </div>
          </article>
        </div>
      );
    }

    return (
      <div className="animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-2xl font-black text-slate-900">Music Academy</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Master your craft</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MUSIC_ARTICLES.map(article => (
            <div key={article.id} onClick={() => setSelectedArticle(article)} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100 flex flex-col cursor-pointer">
              <div className="relative h-64 overflow-hidden bg-slate-100">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-5 right-5 px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg z-10">{article.duration}</div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="font-black text-slate-800 mb-3 text-xl line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">{article.title}</h3>
                <p className="text-slate-500 text-sm mb-8 line-clamp-2 leading-relaxed">{article.description}</p>
                <button className="mt-auto w-full py-4 rounded-2xl font-black bg-slate-900 text-white group-hover:bg-indigo-600 transition-all text-sm tracking-tight">Open Masterclass</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /**
   * Fix: Added missing renderCollaborate function.
   */
  const renderCollaborate = () => (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-3xl font-black text-slate-900">Collaboration Hub</h3>
          <p className="text-slate-500">Find your next creative partner in Zimbabwe.</p>
        </div>
        <button onClick={() => setShowCollabForm(true)} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-indigo-600 transition-all shadow-xl">Post Collab Request</button>
      </div>

      {showCollabForm && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={() => setShowCollabForm(false)}>
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900">Request a Collaboration</h3>
              <button onClick={() => setShowCollabForm(false)} className="text-slate-400 hover:text-slate-900">✕</button>
            </div>
            <form onSubmit={handlePostCollab} className="p-8 space-y-4">
              <input placeholder="Project Type (e.g. EP Vocalist, Beatmaker for Single)" className="w-full px-5 py-3 rounded-xl border border-slate-200" value={newCollab.projectType} onChange={e => setNewCollab({...newCollab, projectType: e.target.value})} required />
              <input placeholder="Skills Needed (comma separated)" className="w-full px-5 py-3 rounded-xl border border-slate-200" value={newCollab.skillsNeeded} onChange={e => setNewCollab({...newCollab, skillsNeeded: e.target.value})} required />
              <textarea placeholder="Describe the project and your vision..." className="w-full px-5 py-3 rounded-xl border border-slate-200 h-32" value={newCollab.description} onChange={e => setNewCollab({...newCollab, description: e.target.value})} required />
              <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black shadow-lg hover:bg-indigo-700 transition-all mt-4">Post Request</button>
            </form>
          </div>
        </div>
      )}

      {userCollabs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
           <h3 className="text-xl font-black text-slate-400">No active collaboration requests.</h3>
           <p className="text-slate-300 mt-2">Start a project and find partners!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {userCollabs.map(collab => (
            <div key={collab.id} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-2xl font-black text-slate-900 mb-1">{collab.projectType}</h4>
                  <p className="text-sm font-bold text-slate-400">{collab.artistName}</p>
                </div>
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded">New Request</span>
              </div>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed line-clamp-3">{collab.description}</p>
              <div className="flex flex-wrap gap-2 mb-8">
                {collab.skillsNeeded.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-bold rounded-lg uppercase tracking-wider">{skill}</span>
                ))}
              </div>
              <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Posted {collab.postedDate}</span>
                {connectionSent === collab.id ? (
                  <span className="text-emerald-600 font-black text-sm">Connection Request Sent!</span>
                ) : (
                  <button onClick={() => handleConnect(collab.id)} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-xs hover:bg-indigo-600 transition-all">Connect</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderGigs = () => (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-3xl font-black text-slate-900">Live Postings</h3>
          <p className="text-slate-500">Real opportunities for artists and session players.</p>
        </div>
        <button onClick={() => setShowGigForm(true)} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-indigo-600 transition-all shadow-xl">Post a Gig Offer</button>
      </div>

      {applyingGig && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white">
              <div>
                <h3 className="text-xl font-black">Apply for {applyingGig.title}</h3>
                <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest">{applyingGig.venue}</p>
              </div>
              <button onClick={() => setApplyingGig(null)} className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-full">✕</button>
            </div>
            <form onSubmit={handleGigApplySubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Portfolio Link / Spotify / SoundCloud</label>
                <input 
                  type="url"
                  placeholder="Link to your music or portfolio..." 
                  className="w-full px-5 py-3 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-indigo-50 font-medium text-sm" 
                  value={gigApplication.sampleLink} 
                  onChange={e => setGigApplication({...gigApplication, sampleLink: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Upload Sample Track / Demo</label>
                <div className="relative group">
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    onChange={e => setGigApplication({...gigApplication, sampleFile: e.target.files?.[0] || null})} 
                    required 
                  />
                  <div className="w-full py-4 px-5 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center gap-2 group-hover:border-indigo-400 transition-all">
                    <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" /></svg>
                    <span className="text-sm font-bold text-slate-500 group-hover:text-indigo-600">
                      {gigApplication.sampleFile ? gigApplication.sampleFile.name : 'Choose audio sample'}
                    </span>
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100">Send Gig Application</button>
            </form>
          </div>
        </div>
      )}

      {allGigs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <h3 className="text-xl font-black text-slate-400">There aren't any gigs posted yet.</h3>
          <p className="text-slate-300 max-w-xs mx-auto mt-2">Be the first to hire local talent! Click "Post a Gig Offer" above.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {allGigs.map(gig => (
            <div key={gig.id} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <h4 className="text-2xl font-black text-slate-900 mb-2">{gig.title}</h4>
                <div className="flex gap-4 text-xs font-bold text-slate-400 uppercase mb-4">
                  <span>{gig.venue}</span> &bull; <span>{gig.date}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {gig.requirements.map((req, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-lg">{req}</span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-slate-900 mb-4">{gig.pay}</p>
                {showApplySuccess === gig.id ? (
                  <span className="px-10 py-3 block text-emerald-600 font-black text-xs uppercase">Application Sent ✓</span>
                ) : (
                  <button onClick={() => setApplyingGig(gig)} className="px-10 py-3 bg-slate-900 text-white rounded-xl font-black text-xs hover:bg-indigo-600 transition-all shadow-lg">Apply Now</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showGigForm && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={() => setShowGigForm(false)}>
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900">Offer a New Gig</h3>
              <button onClick={() => setShowGigForm(false)} className="text-slate-400 hover:text-slate-900">✕</button>
            </div>
            <form onSubmit={handlePostGig} className="p-8 space-y-4">
              <input placeholder="Gig Title (e.g. Session Bassist Needed)" className="w-full px-5 py-3 rounded-xl border border-slate-200" value={newGig.title} onChange={e => setNewGig({...newGig, title: e.target.value})} required />
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Venue/Location" className="w-full px-5 py-3 rounded-xl border border-slate-200" value={newGig.venue} onChange={e => setNewGig({...newGig, venue: e.target.value})} required />
                <input placeholder="Date" className="w-full px-5 py-3 rounded-xl border border-slate-200" value={newGig.date} onChange={e => setNewGig({...newGig, date: e.target.value})} required />
              </div>
              <input placeholder="Payment Amount (e.g. $50 USD / 500 ZiG)" className="w-full px-5 py-3 rounded-xl border border-slate-200" value={newGig.pay} onChange={e => setNewGig({...newGig, pay: e.target.value})} required />
              <textarea placeholder="Requirements (comma separated)" className="w-full px-5 py-3 rounded-xl border border-slate-200 h-24" value={newGig.requirements} onChange={e => setNewGig({...newGig, requirements: e.target.value})} required />
              <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black shadow-lg hover:bg-indigo-700 transition-all mt-4">Submit Post</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">Music Hub</h1>
          <p className="text-xl text-slate-500 max-w-2xl leading-relaxed">Fueling Zimbabwe's creative economy through education, networking, and direct monetization.</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto scrollbar-hide w-full md:w-auto">
          {(['discover', 'learn', 'collaborate', 'gigs', 'profile'] as MusicTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); }}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex-1 md:flex-none ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab === 'learn' ? 'Music Academy' : tab}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[600px] pb-20">
        {activeTab === 'discover' && renderDiscover()}
        {activeTab === 'learn' && renderLearn()}
        {activeTab === 'collaborate' && renderCollaborate()}
        {activeTab === 'gigs' && renderGigs()}
      </div>
    </div>
  );
};

export default MusicHub;
