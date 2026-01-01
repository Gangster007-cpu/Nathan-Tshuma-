
import React, { useState, useMemo, useEffect } from 'react';
import Layout from './components/Layout';
import AICareerGuide from './components/AICareerGuide';
import PitchArena from './components/PitchArena';
import InstructorApplication from './components/InstructorApplication';
import GrantsHub from './components/GrantsHub';
import JobsBoard from './components/JobsBoard';
import EntrepreneurshipHub from './components/EntrepreneurshipHub';
import MusicHub from './components/MusicHub';
import AdminPanel from './components/AdminPanel';
import { ARTICLES } from './constants';
import { Article } from './types';
import * as authService from './services/authService';

export interface User {
  name: string;
  email: string;
  password: string;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('register');
  const [forgotStep, setForgotStep] = useState<'email' | 'code' | 'reset'>('email');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userProfile, setUserProfile] = useState<{ name: string; email: string } | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [articleCategory, setArticleCategory] = useState('All');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [onWaitlist, setOnWaitlist] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Verification Code State
  const [verificationCode, setVerificationCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulatedEmail, setSimulatedEmail] = useState<{ to: string, code: string } | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  // Dynamic Content State
  const [allArticles, setAllArticles] = useState<Article[]>([]);

  const ARTICLE_CATEGORIES = ['All', 'Digital Skills', 'Agribusiness', 'Vocational Training', 'Entrepreneurship'];

  useEffect(() => {
    let timer: any;
    if (resendTimer > 0) {
      timer = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  useEffect(() => {
    const storedArticles = JSON.parse(localStorage.getItem('admin_articles') || '[]');
    setAllArticles([...ARTICLES, ...storedArticles]);
    
    const savedUser = localStorage.getItem('current_user') || sessionStorage.getItem('current_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
        const userExists = users.some((u: User) => u.email === parsed.email);
        
        if (userExists) {
          setUserProfile({ name: parsed.name, email: parsed.email });
          setIsLoggedIn(true);
          setIsAdmin(authService.verifyAdmin(parsed.email));
          
          const waitlist = JSON.parse(localStorage.getItem('mentor_waitlist') || '[]');
          if (waitlist.includes(parsed.email)) setOnWaitlist(true);
        } else {
          localStorage.removeItem('current_user');
          sessionStorage.removeItem('current_user');
        }
      } catch (e) {
        console.error("Auth hydration failed", e);
      }
    }
  }, []);

  const updateArticles = (newArticles: Article[]) => {
    setAllArticles(newArticles);
    const custom = newArticles.filter(a => !ARTICLES.some(ca => ca.id === a.id));
    localStorage.setItem('admin_articles', JSON.stringify(custom));
  };

  const selectedArticle = allArticles.find(a => a.id === selectedArticleId);

  const filteredArticles = useMemo(() => {
    return allArticles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = articleCategory === 'All' || article.category === articleCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, articleCategory, allArticles]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedArticleId(null);
    setSearchQuery('');
    setArticleCategory('All');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUserProfile(null);
    localStorage.removeItem('current_user');
    sessionStorage.removeItem('current_user');
    setActiveTab('home');
    setSelectedArticleId(null);
  };

  const handleAuthSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    const formData = new FormData(e.currentTarget);
    const email = (formData.get('email') as string).trim();
    const password = formData.get('password') as string;
    
    if (authMode === 'login' && email === 'admin@riseupzim.com' && password === 'admin123') {
       const adminUser = { name: 'System Admin', email: 'admin@riseupzim.com' };
       if (rememberMe) localStorage.setItem('current_user', JSON.stringify(adminUser));
       else sessionStorage.setItem('current_user', JSON.stringify(adminUser));
       setUserProfile(adminUser);
       setIsLoggedIn(true);
       setIsAdmin(true);
       setIsCommunityModalOpen(false);
       return;
    }

    const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
    if (authMode === 'register') {
      const name = formData.get('name') as string;
      if (users.some((u: User) => u.email.toLowerCase() === email.toLowerCase())) {
        setAuthError('Email already registered.');
        return;
      }
      const newUser = { name, email, password };
      localStorage.setItem('registered_users', JSON.stringify([...users, newUser]));
      if (rememberMe) localStorage.setItem('current_user', JSON.stringify(newUser));
      else sessionStorage.setItem('current_user', JSON.stringify(newUser));
      setUserProfile({ name, email });
      setIsLoggedIn(true);
      setIsCommunityModalOpen(false);
    } else if (authMode === 'login') {
      const user = users.find((u: User) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (user) {
        if (rememberMe) localStorage.setItem('current_user', JSON.stringify(user));
        else sessionStorage.setItem('current_user', JSON.stringify(user));
        setUserProfile({ name: user.name, email: user.email });
        setIsLoggedIn(true);
        setIsAdmin(authService.verifyAdmin(user.email));
        setIsCommunityModalOpen(false);
      } else {
        setAuthError('Invalid email or password.');
      }
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    const formData = new FormData(e.currentTarget);
    
    if (forgotStep === 'email') {
      const email = (formData.get('email') as string).trim();
      if (!email) return;
      setIsProcessing(true);
      try {
        const response = await authService.requestPasswordReset(email);
        setResetEmail(email.toLowerCase());
        setForgotStep('code');
        setAuthSuccess(response.message);
        setResendTimer(60);
        if (response.exists) {
          const code = authService.getActiveTokenForDemo(email);
          if (code) {
            setSimulatedEmail({ to: email, code });
            setTimeout(() => setSimulatedEmail(null), 10000);
          }
        }
      } catch (err) { setAuthError('An unexpected error occurred.'); }
      finally { setIsProcessing(false); }
    } else if (forgotStep === 'code') {
      const code = (formData.get('code') as string).trim();
      if (!code) return;
      setIsProcessing(true);
      try {
        const isValid = await authService.validateResetToken(resetEmail, code);
        if (isValid) { 
          setVerificationCode(code); 
          setForgotStep('reset'); 
          setSimulatedEmail(null); 
          setAuthSuccess('Verification successful. Please enter your new password.');
        }
        else { setAuthError('Invalid or expired verification code.'); }
      } catch (err) { setAuthError('Verification failed.'); }
      finally { setIsProcessing(false); }
    } else if (forgotStep === 'reset') {
      const newPassword = formData.get('password') as string;
      const confirmPassword = formData.get('confirmPassword') as string;
      if (newPassword !== confirmPassword) {
        setAuthError('Passwords do not match.');
        return;
      }
      setIsProcessing(true);
      try {
        const success = await authService.finalizePasswordReset(resetEmail, verificationCode, newPassword);
        if (success) { 
          setAuthMode('login'); 
          setForgotStep('email'); 
          setVerificationCode(''); 
          setAuthSuccess('Password updated! You can now log in.'); 
        }
        else { 
          setAuthError('Session expired. Please start over.'); 
          setForgotStep('email'); 
        }
      } catch (err) { setAuthError('An error occurred.'); }
      finally { setIsProcessing(false); }
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0 || !resetEmail) return;
    setIsProcessing(true);
    try {
      const response = await authService.requestPasswordReset(resetEmail);
      setResendTimer(60);
      setAuthSuccess('A new security code has been sent.');
      const code = authService.getActiveTokenForDemo(resetEmail);
      if (code) {
        setSimulatedEmail({ to: resetEmail, code });
        setTimeout(() => setSimulatedEmail(null), 10000);
      }
    } catch (err) { setAuthError('Failed to resend code.'); }
    finally { setIsProcessing(false); }
  };

  const renderSectionContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('### ')) return <h3 key={i} className="text-2xl font-black text-slate-900 mt-8 mb-4">{line.replace('### ', '')}</h3>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-3xl font-black text-emerald-700 mt-10 mb-6 border-l-4 border-emerald-500 pl-4">{line.replace('## ', '')}</h2>;
      if (line.startsWith('- ')) return <li key={i} className="ml-6 list-disc text-slate-700 mb-2">{line.replace('- ', '')}</li>;
      if (line.match(/^\d+\./)) return <li key={i} className="ml-6 list-decimal text-slate-700 mb-2">{line}</li>;
      return <p key={i} className="text-lg text-slate-600 leading-relaxed mb-4">{line}</p>;
    });
  };

  const renderContent = () => {
    if (!isLoggedIn) {
      return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 bg-emerald-100 rounded-3xl flex items-center justify-center mb-8 animate-in zoom-in-50 duration-500">
             <span className="text-emerald-600 font-black text-5xl">R</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">RiseUp Zimbabwe</h1>
          <p className="text-xl text-slate-500 max-w-xl mb-12 leading-relaxed">Zimbabwe's premier platform for youth empowerment. Access knowledge, mentorship, and funding.</p>
          <div className="flex flex-col sm:flex-row gap-4">
             <button onClick={() => { setAuthMode('register'); setIsCommunityModalOpen(true); }} className="px-10 py-5 bg-emerald-600 text-white rounded-[2rem] font-black text-xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200">Get Started Free</button>
             <button onClick={() => { setAuthMode('login'); setIsCommunityModalOpen(true); }} className="px-10 py-5 bg-white text-slate-800 border border-slate-200 rounded-[2rem] font-black text-xl hover:bg-slate-50 transition-all">Sign In</button>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-20 pb-20">
            <section className="relative pt-20 pb-16 overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="text-center lg:text-left">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-6">Welcome, {userProfile?.name}!</span>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-6">Knowledge is <br /><span className="text-emerald-600">Power.</span></h1>
                    <p className="text-xl text-slate-600 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">Bridge the skills gap. Read our comprehensive guides on turning high-demand skills into fundable business startups.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                      <button onClick={() => handleTabChange('articles')} className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200">Read Articles</button>
                      <button onClick={() => handleTabChange('hub')} className="px-8 py-4 bg-white text-slate-800 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">Startup Hub</button>
                      {isAdmin && (
                         <button onClick={() => setIsAdminPanelOpen(true)} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 flex items-center gap-3">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                           Admin Hub
                         </button>
                      )}
                    </div>
                  </div>
                  <div className="relative"><AICareerGuide /></div>
                </div>
              </div>
            </section>
          </div>
        );
      case 'articles':
        if (selectedArticle) {
          return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <button onClick={() => setSelectedArticleId(null)} className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-semibold mb-8 transition-colors group">
                <div className="p-1 rounded-lg group-hover:bg-emerald-50 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></div>Back to Library
              </button>
              <article className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 pb-20">
                 <div className="relative h-[480px]">
                    <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-full object-cover saturate-[1.1] contrast-[1.02]" style={{ objectPosition: 'center' }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent"></div>
                    <div className="absolute bottom-12 left-12 right-12">
                       <span className="px-4 py-1.5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg mb-4 inline-block">{selectedArticle.category}</span>
                       <h1 className="text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-md">{selectedArticle.title}</h1>
                       <p className="text-emerald-100 mt-4 text-lg font-medium opacity-90 drop-shadow-sm">{selectedArticle.duration} reading time</p>
                    </div>
                 </div>
                 <div className="px-12 py-12">
                    <div className="prose prose-slate max-w-none text-slate-700">
                       <p className="text-2xl text-slate-500 font-medium italic mb-12 border-l-4 border-emerald-500 pl-6 bg-emerald-50/30 py-4">{selectedArticle.description}</p>
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-8">
              <div className="flex-1 max-w-2xl">
                <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Skill Library</h2>
                <p className="text-slate-500 mb-8">Master high-demand trades and digital skills tailored for the Zimbabwean economy.</p>
                <div className="relative group mb-8">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400"><svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div>
                  <input type="text" placeholder="Search by skill or keywords..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="block w-full pl-16 pr-8 py-5 rounded-[2rem] border-2 border-slate-100 focus:border-emerald-500 outline-none transition-all text-lg bg-white shadow-xl shadow-slate-200/30" />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                  {ARTICLE_CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setArticleCategory(cat)} className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${articleCategory === cat ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 scale-105' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}>{cat}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredArticles.map(article => (
                  <div key={article.id} onClick={() => { setSelectedArticleId(article.id); window.scrollTo({top:0, behavior:'smooth'}); }} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100 flex flex-col cursor-pointer">
                    <div className="relative h-64 overflow-hidden bg-slate-100">
                      <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute top-5 right-5 px-4 py-1.5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg z-10">{article.duration}</div>
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded w-fit mb-3">{article.category}</span>
                      <h3 className="font-black text-slate-800 mb-3 text-xl line-clamp-2 leading-tight group-hover:text-emerald-600 transition-colors">{article.title}</h3>
                      <p className="text-slate-500 text-sm mb-8 line-clamp-2 leading-relaxed">{article.description}</p>
                      <button className="mt-auto w-full py-4 rounded-2xl font-black bg-slate-900 text-white group-hover:bg-emerald-600 transition-all text-sm tracking-tight">Read Full Guide</button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        );
      case 'jobs': return <JobsBoard userProfile={userProfile} />;
      case 'hub': return <EntrepreneurshipHub />;
      case 'music': return <MusicHub />;
      case 'grants': return <GrantsHub />;
      case 'pitch': return <PitchArena />;
      case 'instructor': return <InstructorApplication onReturnHome={() => handleTabChange('home')} />;
      case 'mentorship': return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-in fade-in duration-500">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Personalized Mentorship</h2>
            <p className="text-xl text-slate-500 mb-12 leading-relaxed">Vetted Zimbabwean leaders to provide you with high-impact guidance.</p>
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl">
              {onWaitlist ? (
                <div className="animate-in zoom-in-95">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">✓</div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">You're on the list!</h3>
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-2xl font-black text-slate-900">Be the First to Know</h3>
                  <button onClick={() => { setOnWaitlist(true); localStorage.setItem('mentor_waitlist', JSON.stringify([...JSON.parse(localStorage.getItem('mentor_waitlist') || '[]'), userProfile?.email])); }} className="px-12 py-5 bg-emerald-600 text-white rounded-2xl font-black text-xl hover:bg-emerald-700 transition-all shadow-xl">Join Mentor Waitlist</button>
                </div>
              )}
            </div>
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={handleTabChange} onJoinCommunity={() => { setAuthMode('register'); setIsCommunityModalOpen(true); }} isLoggedIn={isLoggedIn} onLogout={handleLogout}>
      {renderContent()}

      {isAdminPanelOpen && (
        <AdminPanel 
          onClose={() => setIsAdminPanelOpen(false)} 
          onReturnHome={() => { setActiveTab('home'); setIsAdminPanelOpen(false); }}
          allArticles={allArticles} 
          onUpdateArticles={updateArticles} 
        />
      )}

      {/* Simulated Email Notification Toast */}
      {simulatedEmail && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-sm px-4 animate-in slide-in-from-top-4 duration-500">
          <div className="bg-indigo-900 text-white rounded-3xl p-6 shadow-2xl border border-indigo-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h4 className="font-black text-sm">Security Verification</h4>
              <button onClick={() => setSimulatedEmail(null)} className="ml-auto text-indigo-400 hover:text-white">✕</button>
            </div>
            <p className="text-xs text-indigo-100 mb-4 font-medium leading-relaxed">RiseUp Zim reset code below:</p>
            <div className="bg-indigo-800/50 p-4 rounded-xl text-center border border-indigo-600/50">
               <span className="text-2xl font-black tracking-[0.4em]">{simulatedEmail.code}</span>
            </div>
          </div>
        </div>
      )}

      {isCommunityModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300">
            <div className="p-8 sm:p-10 relative">
              <button onClick={() => { setIsCommunityModalOpen(false); setAuthError(''); setAuthSuccess(''); setAuthMode('register'); }} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors">✕</button>
              <div className="mb-8"><div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-4"><span className="text-white font-black text-2xl">R</span></div><h3 className="text-3xl font-black text-slate-900">{authMode === 'register' ? 'Join Community' : authMode === 'login' ? 'Welcome Back' : 'Security Reset'}</h3></div>
              
              {authMode !== 'forgot' && (
                <div className="flex bg-slate-100 p-1 rounded-2xl mb-8">
                    <button onClick={() => { setAuthMode('register'); setAuthError(''); setAuthSuccess(''); }} className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${authMode === 'register' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Register</button>
                    <button onClick={() => { setAuthMode('login'); setAuthError(''); setAuthSuccess(''); }} className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${authMode === 'login' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Login</button>
                </div>
              )}

              {authError && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 flex items-start gap-3 animate-in shake-x duration-300"><svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>{authError}</div>}
              {authSuccess && <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-bold border border-emerald-100 flex items-start gap-3 animate-in slide-in-from-top-2"><svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>{authSuccess}</div>}
              
              {authMode !== 'forgot' ? (
                <form className="space-y-4" onSubmit={handleAuthSubmit}>
                  {authMode === 'register' && (<div><label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Full Name</label><input name="name" type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all text-sm" required /></div>)}
                  <div><label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Email Address</label><input name="email" type="email" placeholder="name@example.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all text-sm" required /></div>
                  <div><label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Password</label><input name="password" type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all text-sm" required /></div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500" />
                      <span className="text-xs font-bold text-slate-500">Remember Me</span>
                    </label>
                    {authMode === 'login' && <button type="button" onClick={() => { setAuthMode('forgot'); setForgotStep('email'); setAuthError(''); setAuthSuccess(''); }} className="text-xs font-bold text-emerald-600 hover:underline">Forgot Password?</button>}
                  </div>
                  <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-700 shadow-xl mt-6">{authMode === 'register' ? 'Create Account' : 'Sign In'}</button>
                </form>
              ) : (
                <form className="space-y-5" onSubmit={handleForgotSubmit}>
                  {forgotStep === 'email' && (
                    <div>
                      <p className="text-sm text-slate-500 mb-6 leading-relaxed">Enter your email and we'll send a security code to reset your account.</p>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Registered Email</label>
                      <input name="email" type="email" placeholder="name@example.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all text-sm" required />
                    </div>
                  )}
                  {forgotStep === 'code' && (
                    <div className="text-center">
                      <p className="text-sm text-slate-500 mb-6">Enter the 6-digit code sent to <span className="font-bold text-slate-900">{resetEmail}</span>.</p>
                      <input name="code" type="text" placeholder="0 0 0 0 0 0" className="w-full px-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 outline-none transition-all text-2xl text-center font-black tracking-[0.5em]" maxLength={6} required />
                      <div className="mt-6 flex justify-center items-center gap-2">
                        <button type="button" onClick={handleResendCode} disabled={resendTimer > 0 || isProcessing} className={`text-xs font-black uppercase tracking-widest transition-all ${resendTimer > 0 ? 'text-slate-300' : 'text-emerald-600 hover:text-emerald-700 underline'}`}>
                          Resend Code {resendTimer > 0 && `(${resendTimer}s)`}
                        </button>
                      </div>
                    </div>
                  )}
                  {forgotStep === 'reset' && (
                    <div className="space-y-4">
                      <p className="text-sm text-slate-500 mb-4">Verification complete. Create your new secure password.</p>
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">New Password</label>
                        <input name="password" type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all text-sm" required />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Confirm New Password</label>
                        <input name="confirmPassword" type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all text-sm" required />
                      </div>
                    </div>
                  )}
                  <button type="submit" disabled={isProcessing} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-700 shadow-xl mt-4 flex items-center justify-center gap-3">
                    {isProcessing ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (forgotStep === 'email' ? 'Send Code' : forgotStep === 'code' ? 'Verify Code' : 'Save New Password')}
                  </button>
                  <button type="button" onClick={() => { setAuthMode('login'); setForgotStep('email'); setAuthError(''); setAuthSuccess(''); }} className="w-full text-xs font-bold text-slate-400 mt-4 hover:text-slate-600 transition-colors">Return to login</button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
