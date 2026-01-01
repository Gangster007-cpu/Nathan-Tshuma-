
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { analyzeStartupPitch } from '../services/geminiService';
import { StartupIdea, AIAdviceResponse } from '../types';

const PitchArena: React.FC = () => {
  const [idea, setIdea] = useState<StartupIdea>({
    title: '',
    industry: '',
    problem: '',
    solution: '',
    targetMarket: ''
  });
  const [loading, setLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [feedback, setFeedback] = useState<AIAdviceResponse | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await analyzeStartupPitch(idea);
      setFeedback(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generatePitchVideo = async () => {
    if (!feedback) return;
    
    // API Key Selection check for Veo
    if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
      await window.aistudio.openSelectKey();
    }

    setVideoLoading(true);
    setVideoStatus('Initiating cinematic render engine...');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `A cinematic high-quality 3D promotional animation for a Zimbabwean startup named "${idea.title}" in the ${idea.industry} sector. The video should showcase the solution: ${idea.solution}. Use modern aesthetics with subtle Zimbabwean motifs. Professional lighting, 4k detail, smooth camera panning.`;
      
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      setVideoStatus('Our AI director is crafting your visual story. This typically takes 1-2 minutes...');

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        setVideoUrl(URL.createObjectURL(blob));
      }
    } catch (err) {
      console.error("Video Generation Error:", err);
      setVideoStatus('Generation failed. Please ensure you have selected a valid paid API key and try again.');
    } finally {
      setVideoLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-4">The Pitch Arena</h2>
        <p className="text-lg text-slate-600 mb-8">
          Submit your startup idea and get instant feedback from our AI-Investor, trained on the Zimbabwean economic landscape.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Idea Title</label>
              <input
                type="text"
                value={idea.title}
                onChange={(e) => setIdea({ ...idea, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Industry</label>
              <select
                value={idea.industry}
                onChange={(e) => setIdea({ ...idea, industry: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                required
              >
                <option value="">Select...</option>
                <option value="AgriTech">AgriTech</option>
                <option value="FinTech">FinTech</option>
                <option value="EduTech">EduTech</option>
                <option value="HealthTech">HealthTech</option>
                <option value="Retail">Retail</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Problem You're Solving</label>
            <textarea
              value={idea.problem}
              onChange={(e) => setIdea({ ...idea, problem: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 h-24 resize-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Your Solution</label>
            <textarea
              value={idea.solution}
              onChange={(e) => setIdea({ ...idea, solution: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 h-24 resize-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : 'Analyze Pitch'}
          </button>
        </form>
      </div>

      <div className="relative">
        {feedback ? (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col h-full">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Investor Analysis</h3>
                <p className="text-slate-500">Instant evaluation complete</p>
              </div>
              <div className="bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100 flex flex-col items-center">
                <span className="text-2xl font-black text-emerald-600">{feedback.marketReadiness}%</span>
                <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-500">Market Ready</span>
              </div>
            </div>

            <div className="space-y-6 flex-grow">
              <div>
                <h4 className="text-sm uppercase tracking-widest font-bold text-slate-400 mb-2">Deep Dive</h4>
                <p className="text-slate-700 leading-relaxed text-sm">{feedback.analysis}</p>
              </div>

              {videoUrl ? (
                <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-inner bg-black">
                  <video src={videoUrl} controls className="w-full aspect-video" />
                </div>
              ) : videoLoading ? (
                <div className="bg-slate-900 rounded-2xl p-8 text-center animate-pulse">
                  <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-white font-bold text-sm mb-2">Generating Promo Video</p>
                  <p className="text-slate-400 text-xs">{videoStatus}</p>
                </div>
              ) : (
                <button 
                  onClick={generatePitchVideo}
                  className="w-full py-6 bg-gradient-to-r from-indigo-600 to-emerald-600 text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] transition-all"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
                  Generate AI Promo Video
                </button>
              )}
            </div>
            
            <button
              onClick={() => { setFeedback(null); setVideoUrl(null); }}
              className="mt-8 w-full py-3 text-slate-400 font-medium hover:text-slate-600 transition-colors"
            >
              Clear Feedback
            </button>
          </div>
        ) : (
          <div className="h-full bg-slate-100/50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-400">Ready to Review</h3>
            <p className="text-slate-400 max-w-xs mt-2 text-sm leading-relaxed">
              Fill out the form to get strategic feedback and an AI-generated promotional video.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PitchArena;
