import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import { getCareerAdvice, optimizeResumeContent, getInterviewFeedback, analyzeAptitude, createClient } from '../services/geminiService';
import { ResumeData, InterviewMessage } from '../types';

type ToolTab = 'roadmap' | 'resume' | 'interview' | 'aptitude';

const AICareerGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ToolTab>('roadmap');

  // Roadmap States
  const [background, setBackground] = useState('');
  const [interests, setInterests] = useState('');
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);

  // Resume States
  const [resumeData, setResumeData] = useState<ResumeData>({ fullName: '', education: '', experience: '', skills: '', targetRole: '' });
  const [optimizing, setOptimizing] = useState(false);

  // Interview States
  const [industry, setIndustry] = useState('');
  const [chat, setChat] = useState<InterviewMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isLiveSession, setIsLiveSession] = useState(false);
  const [liveTranscriptions, setLiveTranscriptions] = useState<string[]>([]);
  
  // Audio Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const streamRef = useRef<MediaStream | null>(null);

  // Aptitude States
  const [aptitudeStep, setAptitudeStep] = useState(0);
  const [aptitudeAnswers, setAptitudeAnswers] = useState<string[]>([]);
  const [aptitudeResult, setAptitudeResult] = useState<string | null>(null);

  const handleRoadmapSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await getCareerAdvice(background, interests);
      setAdvice(result);
    } catch (err) { 
      console.error(err);
      alert((err as Error).message || 'Failed to generate roadmap. Check API key.');
    } finally { setLoading(false); }
  };

  const handleResumeOptimize = async () => {
    setOptimizing(true);
    try {
      const optimized = await optimizeResumeContent(resumeData);
      setResumeData({ ...resumeData, experience: optimized.experience, skills: optimized.skills });
    } catch (err) { 
      console.error(err);
      alert((err as Error).message || 'Resume optimization failed. Check API key.');
    } finally { setOptimizing(false); }
  };

  const startInterview = async () => {
    if (!industry) return;
    setInterviewStarted(true);
    setLoading(true);
    try {
      const firstQ = await getInterviewFeedback([], "Start the interview", industry);
      setChat([{ role: 'interviewer', text: firstQ.question }]);
    } catch (err) {
      console.error(err);
      alert((err as Error).message || 'Interview initiation failed. Check API key.');
    } finally {
      setLoading(false);
    }
  };

  const startLiveInterview = async () => {
    if (!industry) return;

    // If the repo host provides aistudio flow, prefer that for API key selection
    if ((window as any).aistudio && !(await (window as any).aistudio.hasSelectedApiKey())) {
      await (window as any).aistudio.openSelectKey();
    }

    // Create the client via createClient helper (throws with helpful message if missing)
    let ai: GoogleGenAI;
    try {
      ai = createClient();
    } catch (err) {
      console.error(err);
      alert((err as Error).message || 'No API key available for live interview.');
      return;
    }

    setIsLiveSession(true);
    setInterviewStarted(true);
    setLoading(true);

    const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    audioContextRef.current = outputAudioContext;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setLoading(false);
            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
              
              const bytes = new Uint8Array(int16.buffer);
              let b64 = '';
              for (let i = 0; i < bytes.byteLength; i++) b64 += String.fromCharCode(bytes[i]);
              
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: { data: btoa(b64), mimeType: 'audio/pcm;rate=16000' } });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              setLiveTranscriptions(prev => [...prev.slice(0, -1), (prev[prev.length - 1] || '') + text]);
            }
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              setLiveTranscriptions(prev => [...prev.slice(0, -1), (prev[prev.length - 1] || '') + text]);
            }
            if (message.serverContent?.turnComplete) {
              setLiveTranscriptions(prev => [...prev, '']);
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              const binaryString = atob(base64Audio);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
              
              const dataInt16 = new Int16Array(bytes.buffer);
              const buffer = outputAudioContext.createBuffer(1, dataInt16.length, 24000);
              const channelData = buffer.getChannelData(0);
              for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;

              const source = outputAudioContext.createBufferSource();
              source.buffer = buffer;
              source.connect(outputAudioContext.destination);
              
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContext.currentTime);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }
          },
          onclose: () => {
            setIsLiveSession(false);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: `You are an expert Zimbabwean career coach. Conduct a realistic job interview for a ${industry} position. Be encouraging but professional. Use local context where appropriate.`
        }
      });
    } catch (err) {
      console.error("Live Audio Error:", err);
      setLoading(false);
      setIsLiveSession(false);
      alert((err as Error).message || 'Live interview failed. Check microphone permissions and API key.');
    }
  };

  const stopLiveSession = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    sourcesRef.current.forEach(s => s.stop());
    setIsLiveSession(false);
    setInterviewStarted(false);
  };

  const sendInterviewResponse = async () => {
    if (!userInput.trim()) return;
    const currentInput = userInput;
    setUserInput('');
    setChat(prev => [...prev, { role: 'candidate', text: currentInput }]);
    setLoading(true);
    try {
      const nextStep = await getInterviewFeedback(chat, currentInput, industry);
      setChat(prev => [...prev, { role: 'interviewer', text: nextStep.question, feedback: nextStep.feedback }]);
    } catch (err) { 
      console.error(err);
      alert((err as Error).message || 'Failed to get interview feedback. Check API key.');
    } finally { setLoading(false); }
  };

  const APTITUDE_QUESTIONS = [
    "What do you enjoy doing most in your spare time?",
    "If you were to start a small business in your community today, what would it be?",
    "Which school subject or topic do you find easiest to understand?",
    "Do you prefer working with tools/nature or with computers/data?",
    "How do you feel about working in a team versus working alone?"
  ];

  const handleAptitudeNext = async (answer: string) => {
    const newAnswers = [...aptitudeAnswers, answer];
    if (aptitudeStep < APTITUDE_QUESTIONS.length - 1) {
      setAptitudeAnswers(newAnswers);
      setAptitudeStep(prev => prev + 1);
    } else {
      setLoading(true);
      try {
        const result = await analyzeAptitude(newAnswers.join(" | "));
        setAptitudeResult(result);
      } catch (err) {
        console.error(err);
        alert((err as Error).message || 'Aptitude analysis failed. Check API key.');
      } finally {
        setLoading(false);
      }
    }
  };

  const renderTabs = () => (
    <div className="flex bg-slate-100 p-1 rounded-2xl mb-8 overflow-x-auto scrollbar-hide">
      {[
        { id: 'roadmap', label: 'Roadmap', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13' },
        { id: 'resume', label: 'Resume', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { id: 'interview', label: 'Interview', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
        { id: 'aptitude', label: 'Aptitude', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00' },
      ].map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as ToolTab)}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} /></svg>
          {tab.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 p-6 md:p-10 border border-slate-100 flex flex-col h-full animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Career Success Suite</h3>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Bridging the Zim Skills Gap</p>
        </div>
      </div>

      {renderTabs()}

      <div className="flex-grow">
        {activeTab === 'roadmap' && (
          <div className="animate-in slide-in-from-right-4 duration-300">
            {!advice ? (
              <form onSubmit={handleRoadmapSubmit} className="space-y-4">
                <textarea
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  placeholder="Your Background (e.g., Grade 7 grad, High school, or Trade diploma...)"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all h-32 resize-none"
                  required
                />
                <textarea
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder="Interests & Hobbies (e.g., Fixing phones, Solar panels, Farming...)"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all h-32 resize-none"
                  required
                />
                <button type="submit" disabled={loading} className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200">
                  {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Generate My Zim Roadmap'}
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-slate-700 leading-relaxed whitespace-pre-wrap max-h-[400px] overflow-y-auto custom-scrollbar shadow-inner">
                  {advice}
                </div>
                <button onClick={() => setAdvice(null)} className="w-full py-4 border-2 border-slate-200 text-slate-500 rounded-2xl font-bold hover:bg-slate-50 transition-all">Create New Roadmap</button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'resume' && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" value={resumeData.fullName} onChange={e => setResumeData({...resumeData, fullName: e.target.value})} className="w-full px-5 py-3 rounded-xl border" />
              <input type="text" placeholder="Target Role" value={resumeData.targetRole} onChange={e => setResumeData({...resumeData, targetRole: e.target.value})} className="w-full px-5 py-3 rounded-xl border" />
            </div>
            <textarea placeholder="Experience (List your past jobs/tasks)" value={resumeData.experience} onChange={e => setResumeData({...resumeData, experience: e.target.value})} className="w-full px-5 py-3 rounded-xl border h-28" />
            <textarea placeholder="Skills (Tools you can use)" value={resumeData.skills} onChange={e => setResumeData({...resumeData, skills: e.target.value})} className="w-full px-5 py-3 rounded-xl border h-24" />
            <button onClick={handleResumeOptimize} disabled={optimizing} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-3">
              {optimizing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Optimize Resume for Zim Market'}
            </button>
          </div>
        )}

        {activeTab === 'interview' && (
          <div className="h-full flex flex-col animate-in slide-in-from-right-4 duration-300">
            {!interviewStarted ? (
              <div className="space-y-6 text-center py-10">
                <h4 className="text-xl font-black text-slate-800">Practice for Success</h4>
                <p className="text-slate-500">Select an industry to start a mock session with an AI hiring manager.</p>
                <select value={industry} onChange={e => setIndustry(e.target.value)} className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 outline-none focus:border-emerald-500">
                  <option value="">Select Industry...</option>
                  <option value="Agribusiness">Agribusiness</option>
                  <option value="Solar Energy">Solar Energy</option>
                  <option value="Fintech">Fintech</option>
                  <option value="Vocational Trades">Vocational Trades</option>
                </select>
                <div className="flex flex-col gap-3">
                  <button onClick={startInterview} disabled={!industry || loading} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl shadow-slate-100">
                    Text Interview Session
                  </button>
                  <button onClick={startLiveInterview} disabled={!industry || loading} className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-100 flex items-center justify-center gap-3">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5"/></svg>
                    Start Live Voice Interview
                  </button>
                </div>
              </div>
            ) : isLiveSession ? (
              <div className="flex flex-col h-[500px] items-center justify-center text-center">
                <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center mb-8 relative">
                   <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-25"></div>
                   <svg className="w-12 h-12 text-emerald-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/></svg>
                </div>
                <h4 className="text-2xl font-black text-slate-800 mb-2">Live Session Active</h4>
                <p className="text-slate-500 mb-8 max-w-xs">Speak naturally. The interviewer is listening and will respond with audio.</p>
                <div className="w-full bg-slate-50 rounded-2xl p-6 mb-8 max-h-40 overflow-y-auto custom-scrollbar">
                   {liveTranscriptions.map((t, i) => (
                     <p key={i} className={`text-xs mb-2 ${i % 2 === 0 ? 'text-emerald-600 font-bold' : 'text-slate-600'}`}>
                       {t}
                     </p>
                   ))}
                </div>
                <button onClick={stopLiveSession} className="px-10 py-4 bg-red-500 text-white rounded-2xl font-black shadow-xl shadow-red-100">End Session</button>
              </div>
            ) : (
              <div className="flex flex-col h-[500px]">
                <div className="flex-grow overflow-y-auto mb-4 space-y-4 pr-2 custom-scrollbar">
                  {chat.map((msg, i) => (
                    <div key={i} className={`flex flex-col ${msg.role === 'interviewer' ? 'items-start' : 'items-end'}`}>
                      <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${msg.role === 'interviewer' ? 'bg-slate-100 text-slate-800 rounded-tl-none' : 'bg-emerald-600 text-white rounded-tr-none'}`}>
                        {msg.text}
                      </div>
                      {msg.feedback && (
                        <div className="mt-2 text-[10px] font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 max-w-[80%]">
                          💡 Tip: {msg.feedback}
                        </div>
                      )}
                    </div>
                  ))}
                  {loading && <div className="bg-slate-50 text-slate-400 p-4 rounded-xl text-xs animate-pulse">Hiring manager is typing...</div>}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={userInput} onChange={e => setUserInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && sendInterviewResponse()} placeholder="Type your answer..." className="flex-1 px-4 py-3 rounded-2xl border border-slate-200" />
                  <button onClick={sendInterviewResponse} className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-100"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg></button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'aptitude' && (
          <div className="animate-in slide-in-from-right-4 duration-300">
            {!aptitudeResult ? (
              <div className="space-y-8">
                <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100 text-center">
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Question {aptitudeStep + 1} of {APTITUDE_QUESTIONS.length}</p>
                  <h4 className="text-xl font-black text-slate-900 leading-tight">{APTITUDE_QUESTIONS[aptitudeStep]}</h4>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <textarea 
                    placeholder="Tell us your thoughts..." 
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-emerald-50 outline-none h-32 resize-none"
                    id="apt-answer"
                  />
                  <button 
                    onClick={() => {
                      const val = (document.getElementById('apt-answer') as HTMLTextAreaElement).value;
                      if(val) {
                        handleAptitudeNext(val);
                        (document.getElementById('apt-answer') as HTMLTextAreaElement).value = '';
                      }
                    }} 
                    disabled={loading}
                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
                  >
                    {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (aptitudeStep === APTITUDE_QUESTIONS.length - 1 ? 'See Results' : 'Next Question')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100 text-slate-700 leading-relaxed whitespace-pre-wrap max-h-[400px] overflow-y-auto custom-scrollbar">
                  <h4 className="text-xl font-black text-emerald-900 mb-4">Your Career Matching Analysis</h4>
                  {aptitudeResult}
                </div>
                <button onClick={() => {setAptitudeResult(null); setAptitudeStep(0); setAptitudeAnswers([]);}} className="w-full py-4 border-2 border-slate-200 text-slate-500 rounded-2xl font-bold">Retake Assessment</button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-10 pt-8 border-t border-slate-100">
        <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">
          <span>Career Empowerment</span>
          <span className="text-emerald-500">Zim National Workforce</span>
        </div>
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <p className="text-xs text-slate-600 italic leading-relaxed mb-3">
            "RiseUp Zim bridges the gap between potential and opportunity, transforming the NEET statistic into a powerhouse of innovation."
          </p>
          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">&copy; {new Date().getFullYear()} RiseUp Zim. Empowering the Future of Zimbabwe.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICareerGuide;
              
