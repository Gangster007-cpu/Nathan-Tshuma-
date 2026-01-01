
import React, { useState, useEffect } from 'react';
import { MARKET_TRENDS, BIZ_TEMPLATES } from '../constants';
import { MarketTrend, BusinessTemplate } from '../types';

const EntrepreneurshipHub: React.FC = () => {
  const [activeView, setActiveView] = useState<'trends' | 'templates' | 'microfinance' | 'incubator' | 'toolkit'>('trends');
  const [selectedTemplate, setSelectedTemplate] = useState<BusinessTemplate | null>(null);
  const [selectedTrend, setSelectedTrend] = useState<MarketTrend | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  
  // Cohort & Notification State
  const [hasApplied, setHasApplied] = useState(false);
  const [reminders, setReminders] = useState<string[]>([]);
  const [showToast, setShowToast] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('current_user') || sessionStorage.getItem('current_user') || 'null');
    const waitlist = JSON.parse(localStorage.getItem('incubator_waitlist') || '[]');
    if (savedUser && waitlist.includes(savedUser.email)) {
      setHasApplied(true);
    }
    const savedReminders = JSON.parse(localStorage.getItem('webinar_reminders') || '[]');
    setReminders(savedReminders);
  }, []);

  const webinars = [
    { id: 'w1', title: "ZIMRA for Startups: Tax Compliance 101", date: "June 15, 2026", duration: "45 mins", speaker: "T. Mutasa (CPA)", category: "Legal" },
    { id: 'w2', title: "Navigating the Informal Sector Logistics", date: "June 22, 2026", duration: "60 mins", speaker: "L. Sibanda", category: "Operations" },
    { id: 'w3', title: "Pricing Strategies in a Volatile Economy", date: "July 05, 2026", duration: "50 mins", speaker: "Dr. Moyo", category: "Finance" }
  ];

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleApplyForCohort = () => {
    const savedUser = JSON.parse(localStorage.getItem('current_user') || sessionStorage.getItem('current_user') || 'null');
    if (!savedUser) return;

    const waitlist = JSON.parse(localStorage.getItem('incubator_waitlist') || '[]');
    if (!waitlist.includes(savedUser.email)) {
      localStorage.setItem('incubator_waitlist', JSON.stringify([...waitlist, savedUser.email]));
    }
    setHasApplied(true);
    triggerToast("Application Confirmed! You are now on the JULY 2026 Waiting List.");
  };

  const toggleWebinarReminder = (id: string) => {
    const updated = reminders.includes(id) 
      ? reminders.filter(r => r !== id)
      : [...reminders, id];
    
    setReminders(updated);
    localStorage.setItem('webinar_reminders', JSON.stringify(updated));
    triggerToast(reminders.includes(id) ? "Reminder Removed" : "Reminder Set! We will notify you when the session starts.");
  };

  const handleDownload = (type: 'template' | 'guide', data: any) => {
    setDownloading(data.id);
    
    setTimeout(() => {
      const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
      const isTemplate = type === 'template';
      
      const sectionsHtml = isTemplate 
        ? data.fields.map((f: string, i: number) => {
            const guidanceText = data.guidance?.[f] || 'Provide detailed strategic information for this section of your business plan.';
            return `
            <div class="mb-10 page-break-inside-avoid">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center font-black text-xs shrink-0">${i + 1}</div>
                <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest">${f}</h3>
              </div>
              <div class="p-8 bg-slate-50 border border-slate-100 rounded-[2rem] relative">
                <div class="mb-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100 italic text-xs text-emerald-700">
                  <strong>Professional Guidance:</strong> ${guidanceText}
                </div>
                <div class="h-48 border-b border-dashed border-slate-200"></div>
                <p class="mt-4 text-[10px] text-slate-300 font-bold uppercase tracking-widest">Official Entry Field & bull; RiseUp Zim Strategy Hub</p>
              </div>
            </div>`;
          }).join('')
        : `
          <div class="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-200">
            <h3 class="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tighter">Detailed Strategic Content</h3>
            <div class="space-y-8 text-slate-600 leading-relaxed">
              <section>
                <h4 class="font-black text-slate-800 text-sm uppercase tracking-widest mb-2">1. Executive Overview</h4>
                <p>${data.desc} This guide serves as the primary operational framework for youth entrepreneurs entering this specific sector in the Zimbabwean market landscape of 2025.</p>
              </section>
              <section>
                <h4 class="font-black text-slate-800 text-sm uppercase tracking-widest mb-2">2. Market Compliance & Legalities</h4>
                <p>Ensuring compliance with local authorities is paramount. This includes proper ZIMRA registration, local council licensing for physical premises, and adhering to sectoral standards set by regulatory bodies.</p>
              </section>
              <section>
                <h4 class="font-black text-slate-800 text-sm uppercase tracking-widest mb-2">3. Scaling & Sustainability</h4>
                <p>Growth in Zimbabwe requires agility. Entrepreneurs must balance USD-ZiG pricing strategies, maintain lean overheads, and build strong community networks to ensure long-term viability against market volatility.</p>
              </section>
            </div>
            <div class="mt-12 p-6 bg-white rounded-2xl border border-slate-100 italic text-sm text-slate-400 text-center">
              Official reference guide provided by the RiseUp Zim Empowerment Foundation. Authorized for educational and startup development use.
            </div>
          </div>
        `;

      const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RiseUp Zim | ${data.title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap'); 
      body { font-family: 'Inter', sans-serif; }
      @media print { .no-print { display: none; } }
    </style>
</head>
<body class="p-4 md:p-12 bg-slate-50 min-h-screen">
    <div class="max-w-4xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        <div class="bg-emerald-600 p-8 md:p-16 text-white relative">
            <div class="absolute top-8 right-8 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            <div class="relative z-10">
              <div class="flex items-center gap-2 mb-6">
                <div class="w-10 h-10 bg-white text-emerald-600 rounded-lg flex items-center justify-center font-black">R</div>
                <span class="text-xl font-bold tracking-tighter">RiseUp Zim</span>
              </div>
              <h1 class="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-tight">${data.title}</h1>
              <div class="flex items-center gap-6 mt-6">
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-widest text-emerald-200">Category</p>
                  <p class="font-bold">${isTemplate ? 'Professional Business Plan Template' : 'Resource Guide'}</p>
                </div>
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-widest text-emerald-200">Issue Date</p>
                  <p class="font-bold">${date}</p>
                </div>
              </div>
            </div>
        </div>
        <div class="p-8 md:p-16">${sectionsHtml}</div>
        <div class="bg-slate-900 p-12 text-center">
          <p class="text-emerald-500 font-black text-xs uppercase tracking-[0.3em]">Building Zimbabwe's Future &bull; Together</p>
        </div>
    </div>
    <div class="text-center mt-12 no-print">
      <button onclick="window.print()" class="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-2xl shadow-slate-200 flex items-center gap-3 mx-auto">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
        Download as PDF / Print
      </button>
      <p class="mt-4 text-slate-400 text-sm font-bold">RiseUp Zim Empowerment Foundation Portal</p>
    </div>
</body>
</html>`;
      
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `RiseUpZim_${data.title.replace(/\s+/g, '_')}.html`;
      a.click();
      setDownloading(null);
      setSelectedTemplate(null);
    }, 1500);
  };

  const renderTrends = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
      {MARKET_TRENDS.map((trend) => (
        <div key={trend.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
          <div className="flex justify-between items-start mb-4">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-lg">{trend.sector}</span>
            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${
              trend.growthPotential === 'High' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
            }`}>{trend.growthPotential} Potential</span>
          </div>
          <h4 className="text-xl font-black text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">{trend.trend}</h4>
          <p className="text-sm text-slate-500 leading-relaxed mb-6 line-clamp-2">{trend.opportunity}</p>
          <button onClick={() => setSelectedTrend(trend)} className="text-xs font-black text-emerald-600 uppercase tracking-widest hover:underline">Read Analysis →</button>
        </div>
      ))}
    </div>
  );

  const renderTemplates = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      {BIZ_TEMPLATES.map((tpl) => (
        <div key={tpl.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <h4 className="text-2xl font-black text-slate-900 mb-2">{tpl.title}</h4>
            <p className="text-slate-500 text-sm mb-4">{tpl.description}</p>
            <div className="flex flex-wrap gap-2">
              {tpl.fields.slice(0, 4).map((f, i) => (
                <span key={i} className="px-3 py-1 bg-slate-50 text-slate-400 text-[9px] font-bold rounded-lg uppercase tracking-wider">{f}</span>
              ))}
            </div>
          </div>
          <button 
            onClick={() => setSelectedTemplate(tpl)} 
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-lg whitespace-nowrap"
          >
            Review & Export
          </button>
        </div>
      ))}
    </div>
  );

  const renderMicrofinance = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-emerald-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full -mr-32 -mt-32 opacity-50"></div>
        <div className="relative z-10">
          <h3 className="text-3xl font-black mb-4">Financial Readiness Roadmap</h3>
          <p className="text-emerald-100 max-w-xl mb-8">Secure the funding your business deserves. Follow our verified checklist to become eligible for local micro-loans.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Registered PVT LTD / PBC', 'ZIMRA Tax Clearance (ITF263)', 'Market Lead Letters', '3-Month Cash Flow Projection'].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-emerald-800/50 p-4 rounded-2xl border border-emerald-700/50">
                <span className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] font-black">✓</span>
                <span className="text-sm font-bold">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[
          { name: "EmpowerBank", focus: "Youth Focused", rate: "Market Competitive", link: "https://www.empowerbank.co.zw" },
          { name: "ZWMB", focus: "Women Entrepreneurs", rate: "Subsidized", link: "https://www.zwmb.co.zw" },
          { name: "SMEDCO", focus: "Small Enterprises", rate: "Government Backed", link: "https://www.smedco.co.zw" }
        ].map((bank) => (
          <div key={bank.name} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col">
            <h4 className="text-xl font-black text-slate-900 mb-1">{bank.name}</h4>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-4">{bank.focus}</p>
            <div className="bg-slate-50 p-4 rounded-2xl mb-6">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Interest Profile</p>
              <p className="font-bold text-slate-700">{bank.rate}</p>
            </div>
            <a href={bank.link} target="_blank" rel="noopener noreferrer" className="mt-auto w-full py-3 bg-slate-900 text-white text-center rounded-xl font-black text-xs hover:bg-emerald-600 transition-all">Visit Portal</a>
          </div>
        ))}
      </div>
    </div>
  );

  const renderIncubator = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-3xl font-black text-slate-900">Virtual Incubator</h3>
          <p className="text-slate-500">Master Zimbabwe-specific market navigation with live sessions.</p>
        </div>
        <span className="px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">Next Cohort: JULY 2026</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Webinar Series</h4>
          {webinars.map((webinar, i) => {
            const isReminderSet = reminders.includes(webinar.id);
            return (
              <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6 group hover:border-emerald-500 transition-all">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h5 className="font-black text-slate-900">{webinar.title}</h5>
                    <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase">{webinar.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                      <span className="flex items-center gap-1">📅 {webinar.date}</span>
                      <span className="flex items-center gap-1">⏱️ {webinar.duration}</span>
                    </div>
                    <button 
                      onClick={() => toggleWebinarReminder(webinar.id)}
                      className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all ${
                        isReminderSet 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-slate-50 text-slate-400 hover:text-emerald-600'
                      }`}
                    >
                      {isReminderSet ? '✓ Reminder Set' : 'Set Reminder'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white flex flex-col justify-center text-center relative overflow-hidden group">
          {hasApplied && (
            <div className="absolute inset-0 bg-emerald-600/95 flex flex-col items-center justify-center p-10 z-10 animate-in fade-in zoom-in">
              <div className="w-20 h-20 bg-white text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-2xl">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h4 className="text-2xl font-black mb-2">Waitlist Confirmed!</h4>
              <p className="text-emerald-50 mb-8 text-sm opacity-90 leading-relaxed">You are officially registered for the JULY 2026 cohort seminar. We will notify you via email as the date approaches.</p>
              <button onClick={() => { 
                const savedUser = JSON.parse(localStorage.getItem('current_user') || sessionStorage.getItem('current_user') || 'null');
                if (savedUser) {
                  const waitlist = JSON.parse(localStorage.getItem('incubator_waitlist') || '[]');
                  localStorage.setItem('incubator_waitlist', JSON.stringify(waitlist.filter((e: string) => e !== savedUser.email)));
                }
                setHasApplied(false); 
              }} className="text-emerald-200 text-xs font-bold hover:underline">Cancel Application</button>
            </div>
          )}
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/30 group-hover:bg-emerald-500 transition-colors"></div>
          <h4 className="text-2xl font-black mb-4">Incubator Cohort 5</h4>
          <p className="text-slate-400 mb-8 text-sm leading-relaxed">Join founders for an intensive 8-week virtual sprint. Access dedicated mentors and pressure-test your business model.</p>
          <button 
            onClick={handleApplyForCohort}
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20"
          >
            Apply for JULY 2026 Cohort
          </button>
          <p className="mt-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">No fees required for approved candidates</p>
        </div>
      </div>

      {/* Global Notification Toast */}
      {showToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900 text-white px-8 py-4 rounded-3xl shadow-2xl animate-in slide-in-from-bottom-6 duration-500 flex items-center gap-4 border border-slate-700">
          <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          </div>
          <div className="text-sm font-black tracking-tight">{showToast}</div>
        </div>
      )}
    </div>
  );

  const renderToolkit = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
      {[
        { id: 'tk1', title: "Zim-Legal Checklist", desc: "Every step to register and stay compliant in Zimbabwe.", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
        { id: 'tk2', title: "Informal Market Playbook", desc: "Scaling your business beyond formal retail channels.", icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" },
        { id: 'tk3', title: "Agri-Export Guide", desc: "ZimTrade compliance and international buyer sourcing.", icon: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8" }
      ].map((item) => (
        <div key={item.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col">
          <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
          </div>
          <h4 className="text-xl font-black text-slate-900 mb-2">{item.title}</h4>
          <p className="text-sm text-slate-500 leading-relaxed mb-8">{item.desc}</p>
          <button 
            onClick={() => handleDownload('guide', item)}
            disabled={downloading === item.id}
            className="mt-auto flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-widest hover:gap-4 transition-all disabled:opacity-50"
          >
            {downloading === item.id ? 'Preparing...' : 'Download Guide →'}
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Entrepreneurship Hub</h1>
        <p className="text-lg text-slate-500 max-w-2xl">Tools, capital guides, and market analytics for Zimbabwe's next generation of business owners.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-72 shrink-0">
          <div className="bg-white p-3 rounded-3xl border border-slate-100 shadow-sm sticky top-24">
            {[
              { id: 'trends', label: 'Market Trends', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
              { id: 'toolkit', label: 'Starter Toolkit', icon: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z' },
              { id: 'templates', label: 'BP Templates', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
              { id: 'microfinance', label: 'Micro-Finance', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.407 2.67 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.407-2.67-1M12 16v-1m0 1H8m4 0h4m-4-8H8m4 0h4' },
              { id: 'incubator', label: 'Virtual Incubator', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as any)}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-sm transition-all mb-1 ${
                  activeView === item.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-h-[600px]">
          {activeView === 'trends' && renderTrends()}
          {activeView === 'templates' && renderTemplates()}
          {activeView === 'microfinance' && renderMicrofinance()}
          {activeView === 'incubator' && renderIncubator()}
          {activeView === 'toolkit' && renderToolkit()}
        </div>
      </div>

      {/* Trend Analysis Modal */}
      {selectedTrend && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={() => setSelectedTrend(null)}>
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <div className="p-10 border-b border-slate-100 bg-emerald-600 text-white">
              <h3 className="text-3xl font-black mb-2">{selectedTrend.trend}</h3>
              <p className="text-emerald-100 font-bold uppercase tracking-widest text-[10px]">Market Deep Dive Analysis</p>
            </div>
            <div className="p-10">
              <p className="text-slate-600 text-lg leading-relaxed mb-8">{selectedTrend.analysis}</p>
              <button onClick={() => setSelectedTrend(null)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black">Close Analysis</button>
            </div>
          </div>
        </div>
      )}

      {selectedTemplate && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={() => setSelectedTemplate(null)}>
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <div className="p-8 border-b border-slate-100"><h3 className="text-2xl font-black text-slate-900">Document Export</h3></div>
            <div className="p-8"><button onClick={() => handleDownload('template', selectedTemplate)} className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black">Download Business Template</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntrepreneurshipHub;
