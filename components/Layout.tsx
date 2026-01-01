import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onJoinCommunity: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, onJoinCommunity, isLoggedIn, onLogout }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'articles', label: 'Articles', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z' },
    { id: 'hub', label: 'Startup Hub', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'music', label: 'Music Hub', icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' },
    { id: 'jobs', label: 'Jobs', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745V6c0-1.105.895-2 2-2h14c1.105 0 2 .895 2 2v7.255z M16 8H8V6h8v2z' },
    { id: 'grants', label: 'Grants', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.407 2.67 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.407-2.67-1M12 16v-1m0 1H8m4 0h4m-4-8H8m4 0h4' },
    { id: 'mentorship', label: 'Mentors', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'pitch', label: 'Pitch Arena', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0012 18.75c-1.03 0-1.9-.4-2.593-.896l-.548-.547z' },
    { id: 'instructor', label: 'Instructor', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' }
  ];

  const contactEmail = 'tshumanathan236@gmail.com';
  const mailtoLink = `mailto:${contactEmail}?subject=Inquiry from RiseUp Zim User&body=Hello RiseUp Zim Team,`;

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onTabChange('home')}>
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-xl">R</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-800">RiseUp <span className="text-emerald-600">Zim</span></span>
            </div>
            
            {isLoggedIn && (
              <nav className="hidden md:flex space-x-4">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`px-2 py-2 text-sm font-semibold transition-colors ${
                      activeTab === item.id ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500 hover:text-emerald-500'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            )}

            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <button 
                  onClick={onLogout}
                  className="px-5 py-2 rounded-full border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"
                >
                  Logout
                </button>
              ) : (
                <>
                  <button 
                    onClick={onJoinCommunity}
                    className="hidden sm:block text-slate-500 hover:text-emerald-600 font-medium text-sm"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={onJoinCommunity}
                    className="bg-emerald-600 text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-200"
                  >
                    Join Community
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-slate-50">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-12 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-bold mb-4 text-slate-800">RiseUp Zim</h3>
              <p className="text-slate-500 max-w-sm">
                Empowering the next generation of Zimbabwean leaders, entrepreneurs, and skilled professionals. 
                Together we tackle unemployment and build a thriving digital economy.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-slate-800">Resources</h4>
              <ul className="space-y-2 text-slate-500 text-sm">
                <li><button onClick={() => onTabChange('hub')} className="hover:text-emerald-600 transition-colors text-left">Startup Hub</button></li>
                <li><button onClick={() => onTabChange('grants')} className="hover:text-emerald-600 transition-colors text-left">Micro-Grants</button></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Success Stories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-slate-800">Support</h4>
              <ul className="space-y-2 text-slate-500 text-sm">
                <li><a href="#" className="hover:text-emerald-600 transition-colors" onClick={(e) => { e.preventDefault(); onTabChange('instructor'); }}>Mentor Application</a></li>
                <li><a href={mailtoLink} className="hover:text-emerald-600 transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-100 text-center text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} RiseUp Zim Platform. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Mobile Nav */}
      {isLoggedIn && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50 overflow-x-auto scrollbar-hide">
          <div className="flex gap-6 min-w-max">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center gap-1 ${activeTab === item.id ? 'text-emerald-600' : 'text-slate-400'}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span className="text-[8px] font-bold uppercase tracking-tighter">{item.label}</span>
              </button>
            ))}
            <a
              href={mailtoLink}
              className="flex flex-col items-center gap-1 text-slate-400 pt-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-[8px] font-bold uppercase tracking-tighter">Contact</span>
            </a>
          </div>
        </nav>
      )}
    </div>
  );
};

export default Layout;