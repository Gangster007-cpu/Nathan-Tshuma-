import React, { useState } from 'react';

interface InstructorApplicationProps {
  onReturnHome?: () => void;
}

const InstructorApplication: React.FC<InstructorApplicationProps> = ({ onReturnHome }) => {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    expertise: '',
    experience: '',
    bio: '',
    courseTitle: '',
    courseCategory: 'Digital Skills',
    courseDescription: '',
    modules: [{ title: '', duration: '', content: '' }]
  });

  const handleModuleChange = (index: number, field: string, value: string) => {
    const newModules = [...formData.modules];
    newModules[index] = { ...newModules[index], [field]: value };
    setFormData({ ...formData, modules: newModules });
  };

  const addModule = () => {
    setFormData({
      ...formData,
      modules: [...formData.modules, { title: '', duration: '', content: '' }]
    });
  };

  const removeModule = (index: number) => {
    if (formData.modules.length > 1) {
      setFormData({
        ...formData,
        modules: formData.modules.filter((_, i) => i !== index)
      });
    }
  };

  const isStep1Valid = formData.expertise.trim() !== '' && formData.experience.trim() !== '' && formData.bio.trim() !== '';
  const isStep2Valid = formData.courseTitle.trim() !== '' && formData.courseDescription.trim() !== '';
  const isStep3Valid = formData.modules.every(m => m.title.trim() !== '' && m.duration.trim() !== '' && m.content.trim() !== '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isStep3Valid) {
      // Save application for Admin to see
      const applications = JSON.parse(localStorage.getItem('instructor_applications') || '[]');
      const newApp = { 
        ...formData, 
        id: `app-${Date.now()}`,
        status: 'pending',
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('instructor_applications', JSON.stringify([...applications, newApp]));
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-6 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-4">Course Uploaded!</h2>
        <p className="text-xl text-slate-500 mb-10 leading-relaxed">
          Thank you for contributing to RiseUp Zim. Your course is now under review and it will take 2-3 days for our academic board to approve it for publication.
        </p>
        <button 
          onClick={onReturnHome}
          className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200"
        >
          Return to Portal
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Instructor Portal</h1>
        <p className="text-lg text-slate-500 leading-relaxed max-w-2xl">
          Upload your courses and share your skills with thousands of Zimbabwean youth. Help us bridge the skills mismatch and build a stronger economy.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-4 mb-12">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1">
            <div className={`h-2 rounded-full transition-all duration-500 ${step >= s ? 'bg-emerald-600' : 'bg-slate-200'}`} />
            <p className={`mt-2 text-[10px] font-black uppercase tracking-widest ${step >= s ? 'text-emerald-600' : 'text-slate-400'}`}>
              {s === 1 ? 'Expertise' : s === 2 ? 'Course Profile' : 'Curriculum Builder'}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
        {step === 1 && (
          <div className="p-10 space-y-8 animate-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Primary Expertise</label>
                <input 
                  type="text" 
                  placeholder="e.g. Agri-Business, Python Coding, Solar PV"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all"
                  value={formData.expertise}
                  onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Professional Experience</label>
                <input 
                  type="text" 
                  placeholder="e.g. 5+ Years in Telecoms"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Short Professional Bio</label>
              <textarea 
                placeholder="Tell us about your background and why you are qualified to teach this course..."
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all h-32 resize-none"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                required
              />
            </div>
            <button 
              type="button"
              disabled={!isStep1Valid}
              onClick={() => isStep1Valid && setStep(2)}
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next: Define Course Content
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="p-10 space-y-8 animate-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Full Course Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Masterclass in Mushroom Farming"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all"
                  value={formData.courseTitle}
                  onChange={(e) => setFormData({ ...formData, courseTitle: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Sector Category</label>
                <select 
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all"
                  value={formData.courseCategory}
                  onChange={(e) => setFormData({ ...formData, courseCategory: e.target.value })}
                  required
                >
                  <option>Digital Skills</option>
                  <option>Agribusiness</option>
                  <option>Vocational Training</option>
                  <option>Entrepreneurship</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Course Summary & Outcomes</label>
              <textarea 
                placeholder="Describe the key skills students will gain and the potential business opportunities this course unlocks..."
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all h-40 resize-none"
                value={formData.courseDescription}
                onChange={(e) => setFormData({ ...formData, courseDescription: e.target.value })}
                required
              />
            </div>
            <div className="flex gap-4">
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black text-lg hover:bg-slate-200 transition-all"
              >
                Back
              </button>
              <button 
                type="button"
                disabled={!isStep2Valid}
                onClick={() => isStep2Valid && setStep(3)}
                className="flex-[2] py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Curriculum
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-10 space-y-8 animate-in slide-in-from-right-4 duration-300">
            <h4 className="text-xl font-black text-slate-900">Upload Learning Modules</h4>
            <div className="space-y-6">
              {formData.modules.map((module, idx) => (
                <div key={idx} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 relative group">
                  <button 
                    type="button"
                    onClick={() => removeModule(idx)}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Module {idx + 1} Heading</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Introduction to Tilapia Breeding"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
                        value={module.title}
                        onChange={(e) => handleModuleChange(idx, 'title', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Estimated Duration</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 45 mins"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
                        value={module.duration}
                        onChange={(e) => handleModuleChange(idx, 'duration', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Detailed Module Content (Text/Markdown)</label>
                    <textarea 
                      placeholder="Enter the full lesson content, key takeaways, or step-by-step instructions..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all h-32 text-sm resize-none"
                      value={module.content}
                      onChange={(e) => handleModuleChange(idx, 'content', e.target.value)}
                      required
                    />
                  </div>
                </div>
              ))}
            </div>

            <button 
              type="button"
              onClick={addModule}
              className="w-full py-4 border-2 border-dashed border-slate-300 text-slate-500 rounded-3xl font-bold hover:border-emerald-400 hover:text-emerald-600 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              Add Another Module
            </button>

            <div className="flex gap-4 pt-6 border-t border-slate-100">
              <button 
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black text-lg hover:bg-slate-200 transition-all"
              >
                Back
              </button>
              <button 
                type="submit"
                disabled={!isStep3Valid}
                className="flex-[2] py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upload & Submit Course
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default InstructorApplication;