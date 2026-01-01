import { GoogleGenAI, Type } from "@google/genai";
import { AIAdviceResponse, StartupIdea, ResumeData, Job, JobMatchResult, JobApplication } from "../types";
import { getApiKey } from "./apiKey";

/**
 * Create a GoogleGenAI client using the configured API key.
 * Throws a helpful error if no API key is present.
 */
export const createClient = (): GoogleGenAI => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error(
      'No GenAI API key found. Set VITE_GENAI_API_KEY (or VITE_API_KEY) in your environment, set window.__GENAI_API_KEY in the browser, or use the aistudio key selector if available.'
    );
  }
  return new GoogleGenAI({ apiKey });
};

export const getCareerAdvice = async (background: string, interests: string): Promise<string> => {
  const ai = createClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `As a professional career coach specializing in the Zimbabwean economy, analyze this user profile: 
    Background: ${background}
    Interests: ${interests}
    
    Provide a concise roadmap for success in Zimbabwe. Suggest 3 specific high-demand vocational or digital skills and 2 potential business opportunities.`,
  });
  return response.text || "Advice generation unavailable.";
};

export const matchJobsToUser = async (userProfile: { background: string; interests: string }, jobs: Job[]): Promise<JobMatchResult[]> => {
  const ai = createClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Match user to jobs in Zimbabwe.
    Profile: Background: ${userProfile.background}, Interests: ${userProfile.interests}
    Jobs: ${JSON.stringify(jobs.map(j => ({ id: j.id, title: j.title, category: j.category, requirements: j.requirements })))}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            jobId: { type: Type.STRING },
            matchScore: { type: Type.NUMBER },
            reason: { type: Type.STRING }
          },
          required: ["jobId", "matchScore", "reason"]
        }
      }
    }
  });
  try { return JSON.parse(response.text || "[]"); } catch { return []; }
};

export const analyzeCandidateMatch = async (jobDetails: Job, application: JobApplication): Promise<string> => {
  const ai = createClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze if this candidate is a good fit for the job in Zimbabwe. 
    JOB: ${jobDetails.title} at ${jobDetails.company}. Requirements: ${jobDetails.requirements.join(", ")}.
    CANDIDATE: ${application.candidateName}. Qualifications provided: ${application.qualifications}.
    Provide a 2-sentence professional verdict for the recruiter.`,
  });
  return response.text || "Analysis unavailable.";
};

export const optimizeResumeContent = async (data: ResumeData): Promise<{ experience: string; skills: string }> => {
  const ai = createClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Optimize CV for Zim SME sector. Role: ${data.targetRole}. Exp: ${data.experience}, Skills: ${data.skills}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          experience: { type: Type.STRING },
          skills: { type: Type.STRING }
        },
        required: ["experience", "skills"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const getInterviewFeedback = async (history: any[], lastAnswer: string, industry: string): Promise<{ question: string; feedback: string }> => {
  const ai = createClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Mock interview for ${industry} role in Zimbabwe. History: ${JSON.stringify(history)}. Last Answer: ${lastAnswer}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          feedback: { type: Type.STRING },
          question: { type: Type.STRING }
        },
        required: ["feedback", "question"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const analyzeAptitude = async (answers: string): Promise<string> => {
  const ai = createClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Analyze Zim career aptitude: ${answers}. Map to 3 career paths with local certification suggestions.`,
  });
  return response.text || "Analysis failed.";
};

export const searchActiveGrants = async () => {
  const ai = createClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Search for active business/education grants for Zimbabweans closing after ${new Date().toISOString().split('T')[0]}.`,
    config: { tools: [{ googleSearch: {} }] },
  });
  return { 
    text: response.text || "No active grants found.", 
    citations: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] 
  };
};

export const analyzeStartupPitch = async (idea: StartupIdea): Promise<AIAdviceResponse> => {
  const ai = createClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Analyze Zimbabwean startup idea: ${JSON.stringify(idea)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          analysis: { type: Type.STRING },
          nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestedCourses: { type: Type.ARRAY, items: { type: Type.STRING } },
          marketReadiness: { type: Type.NUMBER }
        },
        required: ["analysis", "nextSteps", "suggestedCourses", "marketReadiness"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};
