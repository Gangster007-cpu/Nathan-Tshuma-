import { Article, Mentor, Grant, Job, MarketTrend, BusinessTemplate, MusicArtist, MusicArticle, MusicEvent, MusicGig } from './types';

const generateArticleSections = (title: string, category: string, grantUsage: string) => [
  { 
    id: 's1', 
    title: 'Getting Started: The Essentials', 
    duration: '2 mins', 
    content: `## How to Start in ${title}\nBreaking into ${category} in Zimbabwe requires a mix of formal training and local grit. \n\n### Step 1: Market Research\nIdentify the gap in your local community. For ${title}, this often means looking at supply chain inefficiencies in Harare, Bulawayo, or rural hubs.\n\n### Step 2: Essential Tools\nAcquire the minimum viable equipment. We outline the local suppliers where you can find quality gear at Zimbabwean prices.` 
  },
  { 
    id: 's2', 
    title: 'The Benefits of this Skill', 
    duration: '2 mins', 
    content: `## Why ${title}?\nThis skill is currently ranked in the top 5 high-demand sectors for the 2025 Zimbabwean economy.\n\n1. **Foreign Currency Earnings**: Many ${category} roles allow for USD-denominated contracts.\n2. **Low Entry Barrier**: You can start small and scale as you earn.\n3. **Community Impact**: Solving local problems leads to sustainable business growth.` 
  },
  { 
    id: 's3', 
    title: 'Your Professional Roadmap', 
    duration: '3 mins', 
    content: `## From Beginner to Expert\n### Month 1: Foundation\nFocus on mastering the core technical skills and safety protocols.\n\n### Month 3: Specialization\nNiche down. If you are in ${title}, specialize in a specific sub-sector that has fewer competitors.\n\n### Year 1: Business Integration\nTransition from a skilled freelancer/worker to a registered business owner.` 
  },
  { 
    id: 's4', 
    title: 'Technical Mastery Deep Dive', 
    duration: '4 mins', 
    content: `## Core Techniques & Safety\n### Mastering the Craft\nWe dive into the advanced methodologies used by industry leaders. This includes troubleshooting common issues faced in the Zimbabwean environment (power cuts, water shortages, etc.).` 
  },
  { 
    id: 's5', 
    title: 'Applying for Startup Grants', 
    duration: '3 mins', 
    content: `## Using ${title} to Secure Funding\nGrants like the Youth Enterprise Fund and ZimTrade export facilities prioritize businesses with technical expertise. \n\n### ${grantUsage}\n### Writing the Winning Proposal\n- **Problem Statement**: Clearly define the local issue ${title} solves.\n- **Sustainability**: Show how your ${category} skills ensure long-term viability.\n- **Scalability**: Demonstrate how your startup will create more jobs for Zim youth.` 
  },
  { 
    id: 's6', 
    title: 'Business Startup Strategy', 
    duration: '3 mins', 
    content: `## Launching Your Startup\n### Operational Setup\nFrom ZIMRA registration to finding your first 10 customers.\n\n### Final Summary\nSuccess in ${title} is a marathon. Stay consistent with your quality and customer service to build a lasting brand in the Zimbabwean landscape.` 
  }
];

export const ARTICLES: Article[] = [
  {
    id: '11',
    title: 'Mushroom Farming for Profit',
    category: 'Agribusiness',
    duration: '15 mins',
    image: 'https://images.unsplash.com/photo-1591261730799-ee4e6c2d16d7?auto=format&fit=crop&q=80&w=1200',
    description: 'A lucrative venture for small spaces. Learn to cultivate, package, and sell mushrooms to supermarkets and restaurants.',
    sections: generateArticleSections('Mushroom Farming', 'Agribusiness', 'Focus your grant application on "Value Addition". Explain how you process raw mushrooms into dried products or soups to extend shelf life.')
  },
  {
    id: '12',
    title: 'Commercial Poultry Management',
    category: 'Agribusiness',
    duration: '22 mins',
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80&w=1200',
    description: 'Master the science of broiler and layer production. From biosecurity to feed conversion ratios.',
    sections: generateArticleSections('Poultry Management', 'Agribusiness', 'Emphasize "Import Substitution" in your grant pitch. Show how local poultry production reduces the need for expensive frozen imports.')
  },
  {
    id: '17',
    title: 'Aquaculture: Fish Farming 101',
    category: 'Agribusiness',
    duration: '18 mins',
    image: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?auto=format&fit=crop&q=80&w=1200',
    description: 'Start your own fish pond or tank-based tilapia system. A high-protein, high-demand business for Zimbabwe.',
    sections: generateArticleSections('Fish Farming', 'Agribusiness', 'Focus on "Blue Economy" and "Food Security". Mention how pond water recycling can be used for vegetable irrigation.')
  },
  {
    id: '6',
    title: 'Mining & Mineral Processing',
    category: 'Vocational Training',
    duration: '25 mins',
    image: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?auto=format&fit=crop&q=80&w=1200',
    description: 'Foundation for the mining sector. Learn safety, mineral identification, and processing for gold and chrome using advanced drilling techniques.',
    sections: generateArticleSections('Mining & Processing', 'Vocational Training', 'Apply for "Resource Management" grants. Emphasize safe and environmentally compliant small-scale mining.')
  },
  {
    id: '13',
    title: 'Auto Electrics & Hybrid Repairs',
    category: 'Vocational Training',
    duration: '25 mins',
    image: 'https://images.unsplash.com/photo-1504222490345-c075b6008014?auto=format&fit=crop&q=80&w=1200',
    description: 'Specialized skills for the modern mechanic. Diagnose and repair electronics in the latest vehicle models common in Zim.',
    sections: generateArticleSections('Auto Electrics', 'Vocational Training', 'Target "SME Industrialization" grants. Highlight how your specialized workshop provides essential services.')
  },
  {
    id: '18',
    title: 'Professional Tailoring & Fashion Design',
    category: 'Vocational Training',
    duration: '20 mins',
    image: 'https://images.unsplash.com/photo-1558603668-6570496b66f8?auto=format&fit=crop&q=80&w=1200',
    description: 'Build a fashion brand or a mass-production tailoring unit. Focus on local market school uniforms and corporate wear.',
    sections: generateArticleSections('Tailoring & Fashion', 'Vocational Training', 'Target "Women & Youth Empowerment" grants. Explain how your tailoring unit reduces imports of cheap finished goods.')
  },
  {
    id: '8',
    title: 'Solar PV Installation & Design',
    category: 'Vocational Training',
    duration: '20 mins',
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=1200',
    description: 'Become a certified solar technician. Master off-grid system design to combat the energy crisis.',
    sections: generateArticleSections('Solar PV', 'Vocational Training', 'Target "Green Energy" and "Climate Adaptation" grants.')
  },
  {
    id: '14',
    title: 'Graphic Design & Digital Branding',
    category: 'Digital Skills',
    duration: '18 mins',
    image: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&q=80&w=1200',
    description: 'Visual storytelling for the modern economy. Learn to build brands for Zimbabwean SMEs and global clients.',
    sections: generateArticleSections('Graphic Design', 'Digital Skills', 'Pitch your business as a "Digital Marketing Agency".')
  },
  {
    id: '16',
    title: 'Cybersecurity for Fintech',
    category: 'Digital Skills',
    duration: '30 mins',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200',
    description: 'Defend digital infrastructure. A high-demand skill as Zimbabwe shifts toward mobile money.',
    sections: generateArticleSections('Cybersecurity', 'Digital Skills', 'Focus on "Risk Mitigation" and "Consumer Protection".')
  },
  {
    id: '2',
    title: 'Freelancing with Global Clients',
    category: 'Entrepreneurship',
    duration: '15 mins',
    image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=1200',
    description: 'Master global platforms like Upwork and Fiverr. Handle cross-border payments and build a world-class portfolio.',
    sections: generateArticleSections('Global Freelancing', 'Entrepreneurship', 'Position your startup as a "Digital Services Export" hub.')
  }
];

export const MENTORS: Mentor[] = [];

export const GRANTS: Grant[] = [
  {
    id: 'g1',
    title: 'Youth Enterprise Fund (ZIM)',
    organization: 'Ministry of Youth & Empowerment',
    category: 'Youth',
    amount: 'Up to $10,000',
    deadline: 'Ongoing 2025',
    status: 'Active',
    description: 'A revolving fund aimed at financing youth-led businesses across all sectors in Zimbabwe.',
    url: 'https://www.empowerbank.co.zw/loans/',
    steps: [
      { title: 'Project Proposal', description: 'Draft a detailed business plan outlining your idea.' },
      { title: 'Local Office Submission', description: 'Submit proposal to the nearest Ministry of Youth office.' }
    ]
  }
];

export const JOBS: Job[] = [];

export const MARKET_TRENDS: MarketTrend[] = [
  {
    id: 't1',
    sector: 'Energy',
    trend: 'De-centralized Solar Hubs',
    opportunity: 'Local communities pooling resources for independent power grids.',
    growthPotential: 'High',
    analysis: 'Zimbabwe\'s energy deficit has created a massive opportunity for micro-grid operators. With residential solar adoption up 40% in 2024, the next phase is community-owned energy clusters. Key challenges include initial capital outlay and technical maintenance, but the ROI is high due to consistent demand.'
  },
  {
    id: 't2',
    sector: 'Creative Arts',
    trend: 'Afro-Beats Digital Export',
    opportunity: 'Monetizing traditional sounds through global streaming platforms.',
    growthPotential: 'High',
    analysis: 'The global appetite for Afro-Beats and Amapiano has created an "Export of Culture" economy. Zimbabwean artists using Mbira-infused beats are seeing higher international retention. Monetization is shifting from live events to digital royalties and licensing for global streaming networks.'
  },
  {
    id: 't3',
    sector: 'Agribusiness',
    trend: 'Blueberry Export Clusters',
    opportunity: 'Small-scale farmers joining export consortiums for high-value berries.',
    growthPotential: 'High',
    analysis: 'Blueberry exports from Zimbabwe to Europe and the Middle East have peaked. Small-scale farmers can join "out-grower" schemes to bypass logistics hurdles. Strict quality control and global certification (GlobalGAP) are the primary entry requirements.'
  }
];

export const BIZ_TEMPLATES: BusinessTemplate[] = [
  {
    id: 'bt1',
    title: 'Lean Canvas (Zim-Focus)',
    description: 'A 1-page business model tailored for lean startups in volatile markets.',
    fields: ['Problem (Local Context)', 'Solution', 'Unique Value Prop', 'Unfair Advantage', 'Customer Segments', 'Revenue (USD vs ZIG)', 'Cost Structure'],
    guidance: {
      'Problem (Local Context)': 'List the top 3 problems you are solving. Focus on specific Zimbabwean pain points (e.g., currency fluctuation, power outages).',
      'Solution': 'Outline your MVP. How does your product solve the identified problems simply and effectively?',
      'Unique Value Prop': 'Single, clear, compelling message that states why you are different and worth paying for.',
      'Unfair Advantage': 'Something that cannot easily be bought or copied (e.g., exclusive local supply chain, proprietary tech).',
      'Customer Segments': 'Who are your first 100 customers? Be specific (e.g., "SMEs in Bulawayo needing off-grid power").',
      'Revenue (USD vs ZIG)': 'How will you price? Detail your strategy for handling multiple currencies and mobile money integration.',
      'Cost Structure': 'List your fixed and variable costs. Focus on keeping operations lean in the first 6 months.'
    }
  },
  {
    id: 'bt2',
    title: 'Agri-Export Plan',
    description: 'Comprehensive template for exporting produce to regional or global markets.',
    fields: ['Crop Type', 'ZimTrade Compliance', 'Logistics Partner', 'Quality Assurance', 'International Buyer Segment'],
    guidance: {
      'Crop Type': 'Define your primary crop and variety. Mention seasonal cycles and yield estimates per hectare.',
      'ZimTrade Compliance': 'List specific export permits and certificates needed (e.g., Phytosanitary, EuroGAP).',
      'Logistics Partner': 'Identify cold-chain solutions and freight forwarders specialized in perishable exports.',
      'Quality Assurance': 'Describe your post-harvest handling processes and grading standards.',
      'International Buyer Segment': 'Target markets (e.g., EU supermarkets, Dubai wholesale) and your outreach strategy.'
    }
  }
];

export const MUSIC_ARTISTS: MusicArtist[] = [
  {
    id: 'a1',
    name: 'Kudzai Beats',
    genre: 'Afro-Fusion',
    location: 'Harare',
    bio: 'Pioneer of the "Highveld Sound", combining traditional shona rhythms with modern basslines.',
    image: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?auto=format&fit=crop&q=80&w=800',
    tracks: [
      { id: 't1', title: 'Savanna Sunset', genre: 'Afro-Fusion', duration: '3:20', url: '#', plays: 15400 },
      { id: 't3', title: 'Rainy Harare', genre: 'Afro-Fusion', duration: '4:10', url: '#', plays: 12000 }
    ],
    socialLinks: [{ platform: 'Instagram', url: '#' }, { platform: 'YouTube', url: '#' }]
  },
  {
    id: 'a2',
    name: 'Musa Flow',
    genre: 'ZimDancehall',
    location: 'Bulawayo',
    bio: 'The new voice of Bulawayo street culture, bringing conscious lyrics to the youth.',
    image: 'https://images.unsplash.com/photo-1594122230689-45899d9e6f69?auto=format&fit=crop&q=80&w=800',
    tracks: [
      { id: 't2', title: 'Bulawayo Nights', genre: 'ZimDancehall', duration: '2:55', url: '#', plays: 9800 }
    ],
    socialLinks: [{ platform: 'Facebook', url: '#' }, { platform: 'Twitter', url: '#' }]
  }
];

export const MUSIC_ARTICLES: MusicArticle[] = [
  {
    id: 'ma1',
    title: 'The Blueprint: Music Theory for Producers',
    category: 'Music',
    duration: '20 mins',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800',
    description: 'Unlock your creative potential by mastering the essential scales and chord progressions used in global and local hits.',
    sections: [
      {
        id: 'mas1',
        title: 'Emotional Foundations',
        duration: '5 mins',
        content: `## The Language of Vibe\nMusic theory isn't about rules; it's about tools. In the context of Afro-Fusion, understanding the "Dorian" mode and "Pentatonic" scales is crucial for creating that soulful, traditional Zimbabwean sound with a modern edge.\n\n### Chords that Move\nLearn the 1-4-5 progression and how to spice it up with 7th and 9th chords to give your beats a jazzier, more professional feel. This is common in "Sungura" and high-life rhythms.`
      },
      {
        id: 'mas2',
        title: 'Melodic Counterpoint',
        duration: '15 mins',
        content: `## Layering for Depth\nAdvanced producers use "Counter-Melodies" to fill the spectral space. \n\n1. **The Lead**: Catchy, high-frequency.\n2. **The Hook**: Mid-range, rhythmic.\n3. **The Response**: Low-mid, answering the lead. \n\n### Rhythm as Melody\nIn genres like ZimDancehall, your kick pattern and bassline often act as the melodic core. Ensure they are in the same key as your synths to avoid "clashing" frequencies.`
      }
    ]
  },
  {
    id: 'ma2',
    title: 'Advanced Mixing Techniques',
    category: 'Music',
    duration: '25 mins',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800',
    description: 'Take your sound from "bedroom demo" to "radio ready" with surgical EQ, sidechaining, and parallel processing.',
    sections: [
      {
        id: 'mas3',
        title: 'Surgical EQ & Frequency Masking',
        duration: '10 mins',
        content: `## Cleaning the Mud\nEvery instrument needs its own "house". Use a high-pass filter on everything except your kick and sub-bass (usually cutting below 100Hz). \n\n### The "Vocal Pocket"\nTo make vocals sit perfectly, identify the "presence" frequency of the singer (usually 2kHz-5kHz) and subtly cut that same range from your main melody instruments using a narrow Q factor.`
      },
      {
        id: 'mas4',
        title: 'The Art of Sidechaining',
        duration: '15 mins',
        content: `## Letting the Kick Breathe\nIn modern club music, the kick must punch through. Use sidechain compression to automatically duck the volume of your bass or chords whenever the kick hits.\n\n### Parallel Compression\nApply heavy compression to a "bus" and blend it back in with the dry signal. This adds "weight" and "density" to your drums without losing the initial transient snap.`
      }
    ]
  },
  {
    id: 'ma3',
    title: 'Navigating Music Distribution & Deals in Zimbabwe',
    category: 'Music',
    duration: '18 mins',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800',
    description: 'A strategic guide to monetizing your music, protecting your IP, and choosing between local and global aggregators.',
    sections: [
      {
        id: 'mas5',
        title: 'Distribution Strategy 2.0',
        duration: '8 mins',
        content: `## Local vs. Global\nWhile DistroKid and Tunecore get you on Spotify, local platforms like Gateway Stream and Buddie Beatz are vital for the Zimbabwean market where USD data is expensive.\n\n### Rights & Royalties\nRegister with ZIMURA (Zimbabwe Music Rights Association). They collect royalties for public performances (Radio, TV, Clubs). Don't leave money on the table.`
      },
      {
        id: 'mas6',
        title: 'Contract Red Flags',
        duration: '10 mins',
        content: `## Understanding the Paperwork\nNever sign away your "Master Rights" unless it's a massive advance. \n\n1. **Sunset Clauses**: When does the deal end?\n2. **Territory**: Is this worldwide or just Africa?\n3. **Audit Rights**: Can you see their accounting books?\n\n### The Independent Route\nBuilding your own "Label" as an LLC in Zimbabwe allows you to keep 100% of your earnings while scaling your brand globally via social media marketing.`
      }
    ]
  }
];

export const MUSIC_GIGS: MusicGig[] = [];