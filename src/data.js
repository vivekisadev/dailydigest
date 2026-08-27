import { TRACKS as FAANG_TRACKS, RAW as FAANG_RAW, RESOURCES as FAANG_RESOURCES } from './faangData.js';
import { CS_TRACKS, CS_RAW, CS_RESOURCES } from './csData.js';
import { DEVOPS_TRACKS, DEVOPS_RAW, DEVOPS_RESOURCES } from './devopsData.js';
import { DSA_TRACKS, DSA_RAW, DSA_RESOURCES } from './dsaData.js';

export const DAYS = ["Day 1","Day 2","Day 3","Day 4","Day 5","Day 6","Day 7 (Review)"];

// We export these for backward compatibility in App.jsx if needed
export const TRACKS = FAANG_TRACKS;
export const RAW = FAANG_RAW;
export const RESOURCES = FAANG_RESOURCES;

export const ROADMAPS = [
  {
    id: "faang-90",
    label: "90-Day MANGO Prep",
    description: "Master DSA, System Design, and ace top-tier tech interviews at MANGO (Meta, Anthropic, Google, OpenAI, X, Tesla, SpaceX) in 90 days.",
    icon: "🚀",
    color: "#A78BFA",
    gradient: "linear-gradient(135deg, #A78BFA 0%, #6366F1 100%)",
    totalWeeks: 15,
    totalDays: 90,
    difficulty: "Advanced",
    tags: ["DSA", "System Design", "Behavioral", "MANGO"],
  },
  {
    id: "cs-fundamentals-45",
    label: "CS Fundamentals",
    description: "A 45-day plan covering all core Computer Science topics to build a strong foundation.",
    icon: "🧠",
    color: "#34D399",
    gradient: "linear-gradient(135deg, #34D399 0%, #059669 100%)",
    totalWeeks: 7,
    totalDays: 45,
    difficulty: "Intermediate",
    tags: ["OS", "Databases", "Networking", "Algorithms"],
  },
  {
    id: "combined-master",
    label: "Combined Master Track",
    description: "Pursue both FAANG Prep and CS Fundamentals simultaneously. Tasks are balanced across 22 weeks to prevent burnout.",
    icon: "👑",
    color: "#F472B6",
    gradient: "linear-gradient(135deg, #F472B6 0%, #E11D48 100%)",
    totalWeeks: 22,
    totalDays: 154,
    difficulty: "Advanced",
    tags: ["Full Stack", "Balanced", "Comprehensive"],
  },
  {
    id: "devops-roadmap",
    label: "DevOps Roadmap",
    description: "A structured 8-week DevOps learning plan covering foundations to modern cloud-native practices",
    icon: "⚙️",
    color: "#60A5FA",
    gradient: "linear-gradient(135deg, #60A5FA 0%, #2563EB 100%)",
    totalWeeks: 8,
    totalDays: 60,
    difficulty: "Intermediate",
    tags: ["DevOps", "Cloud", "CI/CD", "Containers"],
  },
  {
    id: "dsa-mastery",
    label: "DSA Mastery",
    description: "A complete, dependency-ordered path through data structures & algorithms.",
    icon: "🧑‍💻",
    color: "#58A6FF",
    gradient: "linear-gradient(135deg, #58A6FF 0%, #3FB950 100%)",
    totalWeeks: Math.ceil(DSA_RAW.length / 6) || 7,
    totalDays: DSA_RAW.length,
    difficulty: "Advanced",
    tags: ["DSA", "LeetCode", "Algorithms"],
    tieredByTrack: true
  },
  {
    id: "data-analyst-roadmap",
    label: "Data Analyst Roadmap",
    description: "Master SQL, Python, Tableau, and Statistics to become a top-tier Data Analyst.",
    icon: "📊",
    color: "#FBBF24",
    gradient: "linear-gradient(135deg, #FBBF24 0%, #D97706 100%)",
    totalWeeks: 12,
    totalDays: 84,
    difficulty: "Beginner to Pro",
    tags: ["Data", "SQL", "Python", "Tableau"],
    isComingSoon: true
  }
];

const buildPlan = (rawArray, rId) => {
  const plan = {};
  rawArray.forEach(t => {
    if(!plan[t[0]]) plan[t[0]] = {};
    if(!plan[t[0]][t[1]]) plan[t[0]][t[1]] = [];
    plan[t[0]][t[1]].push({
      id: `${rId}:${t[0]}-${t[1]}-${t[2]}`,
      week: t[0],
      day: t[1],
      track: t[2],
      topic: t[3],
      subtopic: t[4],
      hrs: t[5],
      difficulty: t[6],
      priority: t[7],
      desc: t[8],
      probs: t[9],
      res: t[10]
    });
  });
  return plan;
};

export const PLAN = buildPlan(FAANG_RAW, 'faang-90');
export const CS_PLAN = buildPlan(CS_RAW, 'cs-fundamentals-45');

// Build combined master logic if needed
const COMBINED_TRACKS = [];
let tIdx = 0;
const mapF = {}, mapC = {};
FAANG_TRACKS.forEach(t => { mapF[t.id] = tIdx; COMBINED_TRACKS.push({...t, id: tIdx++}); });
CS_TRACKS.forEach(t => { mapC[t.id] = tIdx; COMBINED_TRACKS.push({...t, id: tIdx++}); });

const COMBINED_RAW = [];
let curW = 1, curD = 0;
const fTasks = [...FAANG_RAW];
const cTasks = [...CS_RAW];

while(fTasks.length > 0 || cTasks.length > 0) {
  const daily = [];
  if (fTasks.length > 0) {
     const ft = [...fTasks.shift()];
     ft[2] = mapF[ft[2]];
     daily.push(ft);
  }
  if (cTasks.length > 0) {
     const ct = [...cTasks.shift()];
     ct[2] = mapC[ct[2]];
     daily.push(ct);
  }
  if (fTasks.length > 0) {
     const ft = [...fTasks.shift()];
     ft[2] = mapF[ft[2]];
     daily.push(ft);
  }
  
  daily.forEach(t => {
     t[0] = curW;
     t[1] = curD;
     COMBINED_RAW.push(t);
  });
  
  curD++;
  if (curD === 6) { // Day 7 is rest
    curD = 0;
    curW++;
  }
}
export const COMBINED_PLAN = buildPlan(COMBINED_RAW, 'combined-master');

export const PLANS = { 
  "faang-90": PLAN, 
  "cs-fundamentals-45": CS_PLAN, 
  "combined-master": COMBINED_PLAN, 
  "devops-roadmap": buildPlan(DEVOPS_RAW, "devops-roadmap"),
  "dsa-mastery": buildPlan(DSA_RAW, "dsa-mastery")
};

export const ALL_TRACKS = { 
  "faang-90": FAANG_TRACKS, 
  "cs-fundamentals-45": CS_TRACKS, 
  "combined-master": COMBINED_TRACKS, 
  "devops-roadmap": DEVOPS_TRACKS,
  "dsa-mastery": DSA_TRACKS
};

export const ALL_RAW = { 
  "faang-90": FAANG_RAW, 
  "cs-fundamentals-45": CS_RAW, 
  "combined-master": COMBINED_RAW, 
  "devops-roadmap": DEVOPS_RAW,
  "dsa-mastery": DSA_RAW
};

const injectDSA = (baseResources) => {
  const merged = { ...baseResources };
  Object.keys(merged).forEach(topic => {
    // Direct match
    if (DSA_RESOURCES[topic]) {
      // Create a set of existing problem titles to avoid duplicates
      const existingTitles = new Set(merged[topic].map(r => r.title || r.name || r));
      const toAdd = DSA_RESOURCES[topic].filter(p => !existingTitles.has(p.title));
      merged[topic] = [...merged[topic], ...toAdd];
    } else {
      // Fuzzy match
      const topicLower = topic.toLowerCase();
      const dsaKey = Object.keys(DSA_RESOURCES).find(k => 
        (topicLower.includes(k.toLowerCase()) || k.toLowerCase().includes(topicLower)) && k.length > 4
      );
      if (dsaKey) {
        const existingTitles = new Set(merged[topic].map(r => r.title || r.name || r));
        const toAdd = DSA_RESOURCES[dsaKey].filter(p => !existingTitles.has(p.title));
        merged[topic] = [...merged[topic], ...toAdd];
      }
    }
  });
  return merged;
};

export const ALL_RESOURCES = { 
  "faang-90": injectDSA(FAANG_RESOURCES), 
  "cs-fundamentals-45": injectDSA(CS_RESOURCES), 
  "combined-master": injectDSA({ ...FAANG_RESOURCES, ...CS_RESOURCES }), 
  "devops-roadmap": DEVOPS_RESOURCES, // DevOps probably doesn't need DSA
  "dsa-mastery": DSA_RESOURCES
};
