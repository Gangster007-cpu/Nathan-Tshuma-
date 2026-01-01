
export interface Section {
  id: string;
  title: string;
  duration: string;
  content: string;
  videoUrl?: string;
}

export interface Article {
  id: string;
  title: string;
  category: 'Entrepreneurship' | 'Digital Skills' | 'Vocational Training' | 'Agribusiness' | 'Music';
  duration: string;
  image: string;
  description: string;
  prerequisites?: string[];
  sections: Section[];
}

export interface Mentor {
  id: string;
  name: string;
  expertise: string;
  company: string;
  bio: string;
  image: string;
  tags: string[];
}

export interface StartupIdea {
  title: string;
  industry: string;
  problem: string;
  solution: string;
  targetMarket: string;
}

export interface AIAdviceResponse {
  analysis: string;
  nextSteps: string[];
  suggestedCourses: string[];
  marketReadiness: number;
}

export interface GrantStep {
  title: string;
  description: string;
}

export interface Grant {
  id: string;
  title: string;
  organization: string;
  category: 'Agribusiness' | 'Tech' | 'Women' | 'Youth' | 'Climate' | 'Arts';
  amount: string;
  deadline: string;
  description: string;
  steps: GrantStep[];
  status: 'Active' | 'Closing Soon';
  url: string;
}

export interface ResumeData {
  fullName: string;
  education: string;
  experience: string;
  skills: string;
  targetRole: string;
}

export interface AptitudeAnswer {
  questionId: number;
  answer: string;
}

export interface InterviewMessage {
  role: 'interviewer' | 'candidate';
  text: string;
  feedback?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Internship' | 'Apprenticeship' | 'Remote' | 'Freelance';
  category: string;
  salaryRange?: string;
  description: string;
  postedDate: string;
  requirements: string[];
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  candidateName: string;
  candidateEmail: string;
  qualifications: string;
  cvFileName: string;
  appliedDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface JobMatchResult {
  jobId: string;
  matchScore: number;
  reason: string;
}

export interface MarketTrend {
  id: string;
  sector: string;
  trend: string;
  opportunity: string;
  analysis: string;
  growthPotential: 'High' | 'Medium' | 'Emerging';
}

export interface BusinessTemplate {
  id: string;
  title: string;
  description: string;
  fields: string[];
  guidance?: Record<string, string>;
}

export interface Track {
  id: string;
  title: string;
  genre: string;
  duration: string;
  url: string; 
  plays: number;
}

export interface MusicArtist {
  id: string;
  name: string;
  genre: string;
  location: string;
  bio: string;
  image: string;
  tracks: Track[];
  socialLinks: { platform: string; url: string }[];
}

export interface MusicArticle extends Article {}

export interface MusicEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  type: 'Showcase' | 'Festival' | 'Workshop' | 'Networking';
  price: string;
}

export interface MusicGig {
  id: string;
  title: string;
  venue: string;
  date: string;
  pay: string;
  requirements: string[];
}

export interface MusicGigApplication {
  id: string;
  gigId: string;
  gigTitle: string;
  artistName: string;
  artistEmail: string;
  sampleLink: string;
  sampleFileName: string;
  appliedDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface MusicCollabRequest {
  id: string;
  artistName: string;
  projectType: string;
  skillsNeeded: string[];
  description: string;
  postedDate: string;
}

export interface MarketplaceAd {
  id: string;
  productName: string;
  entrepreneurName: string;
  price: string;
  description: string;
  image: string;
  contactInfo: string;
  category: string;
}
