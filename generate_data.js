import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TRACKS = [
  { id: 0, label: "DSA", sublabel: "Patterns & Problems", color: "#A78BFA", bg: "rgba(167,139,250,0.13)", icon: "📚" },
  { id: 1, label: "System Design", sublabel: "Architecture & Scale", color: "#6EE7B7", bg: "rgba(110,231,183,0.13)", icon: "🏗" },
  { id: 2, label: "CS Fundamentals", sublabel: "OS, DB, Networks", color: "#FCD34D", bg: "rgba(252,211,77,0.13)", icon: "💻" },
  { id: 3, label: "Behavioral", sublabel: "STAR & LPs", color: "#60A5FA", bg: "rgba(96,165,250,0.13)", icon: "💼" },
  { id: 4, label: "Mock & Review", sublabel: "Simulations", color: "#F87171", bg: "rgba(248,113,113,0.13)", icon: "🎯" }
];

const dsaTopics = ["Arrays & Hashing", "Two Pointers", "Sliding Window", "Binary Search", "Prefix Sum & Subarrays", "Linked List Basics", "Linked List Fast/Slow", "Stack Basics", "Monotonic Stack", "Queue & Deque", "Trees Traversal", "BST Operations", "LCA & Paths", "Heap Basics", "Advanced Heaps", "Tries", "Graph BFS", "Graph DFS", "Topological Sort", "Dijkstra Algorithm", "Union Find", "MST (Kruskal/Prim)", "1D DP Intro", "1D DP Advanced", "2D DP Grid", "2D DP Strings", "DP Knapsack", "DP Bitmask/Digit", "Greedy Intervals", "Greedy Advanced", "Backtracking Subsets", "Backtracking Queens/Sudoku", "Bit Manipulation Tricks", "Math & Geometry", "String KMP", "String Rabin-Karp", "Segment Tree", "Fenwick Tree", "Graph Hard Paths", "Tarjan & SCCs", "Eulerian Paths", "Advanced DP Optimizations", "Matrix Exponentiation", "Game Theory Basics", "Advanced Tries"];
while(dsaTopics.length < 90) {
  dsaTopics.push(`Hard Topic Deep Dive: ${dsaTopics[dsaTopics.length % 45]}`);
}

const sdTopics = ["SD Framework", "Scalability", "Load Balancing", "CAP Theorem", "Consistent Hashing", "Database Indexing", "SQL vs NoSQL", "Caching Strategies", "Message Queues", "Kafka Deep Dive", "Microservices", "API Gateway", "Rate Limiting", "URL Shortener", "Pastebin Design", "Twitter Feed", "Instagram Design", "WhatsApp Chat", "Uber Design", "Tinder Design", "Ticketmaster", "Google Maps", "Netflix Video Streaming", "YouTube Storage", "Web Crawler", "Search Autocomplete", "Google Search", "Notification System", "Distributed Locks", "Event Sourcing & CQRS", "Saga Pattern", "Two-Phase Commit", "Distributed Transactions", "Sharding Deep Dive", "Data Partitioning", "Data Replication", "Leader Election", "Paxos & Raft", "Gossip Protocols", "Vector Clocks", "CDN Architecture", "DNS & Edge Computing", "Observability (Logs/Metrics)", "Distributed Tracing", "Security & Auth"];
while(sdTopics.length < 90) {
  sdTopics.push(`Case Study: ${sdTopics[sdTopics.length % 45]} at Scale`);
}

const csTopics = ["OS Memory Management", "OS Processes & Threads", "OS Scheduling", "Virtual Memory", "Deadlocks", "Concurrency Primitives", "Mutex vs Semaphore", "Linux Basics", "Networking OSI Model", "TCP/IP vs UDP", "HTTP 1.1/2/3", "DNS & DHCP", "TLS/SSL Handshake", "REST vs gRPC vs GraphQL", "Database ACID properties", "Isolation Levels", "MVCC", "B+ Trees", "Database Normalization", "OOP SOLID Principles", "Design Patterns: Factory/Builder", "Design Patterns: Singleton/Prototype", "Design Patterns: Observer/Strategy", "Design Patterns: Decorator/Adapter", "Behavioral: Tell Me About Yourself", "Behavioral: Amazon LP 1-4", "Behavioral: Amazon LP 5-8", "Behavioral: Conflict Resolution", "Behavioral: Biggest Failure", "Resume Review", "Negotiation Tactics", "Company Research", "Mock: Peer Interview", "Mock: System Design", "Mock: Behavioral", "Mock: FAANG Full Loop", "Mock: Google Format", "Mock: Meta Format", "Mock: Amazon Format", "Mental Toughness", "Mock: System Design 2", "Mock: Coding Sprints", "Mock: Object Oriented Design", "Mock: LLD Deep Dive"];
while(csTopics.length < 90) {
  csTopics.push(`Review & Practice: ${csTopics[csTopics.length % 45]}`);
}

const RAW = [];
let dayCounter = 1;
for (let w = 1; w <= 15; w++) {
  for (let d = 0; d < 6; d++) {
    const dsa = dsaTopics[dayCounter - 1];
    const sd = sdTopics[dayCounter - 1];
    const cs = csTopics[dayCounter - 1];
    
    // DSA task
    RAW.push([w, d, 0, dsa, "Core Algorithms", w>10 ? 3 : 2, w>10 ? "Hard" : "Medium", "High", `Master ${dsa} with focus on optimal time & space complexity. Identify edge cases and implement cleanly.`, ["LC 121", "LC 456"], ["https://neetcode.io/roadmap", "https://takeuforward.org/"]]);
    
    // SD task (On saturdays, do Mock)
    const sdTrack = d === 5 ? 4 : 1;
    RAW.push([w, d, sdTrack, d === 5 ? `Mock: ${sd}` : sd, "Architecture", w>8 ? 3 : 2, "Hard", "High", `Deep dive into ${sd}. Draw diagrams, calculate estimations (QPS, Storage), and discuss trade-offs (e.g. SQL vs NoSQL, Push vs Pull).`, [], ["https://bytebytego.com/", "https://github.com/donnemartin/system-design-primer"]]);
    
    // CS / Behav task
    let csTrack = 2; // CS Fund
    if (cs.includes("Behavioral") || cs.includes("Resume") || cs.includes("Negotiation") || cs.includes("Company Research")) csTrack = 3;
    if (cs.includes("Mock")) csTrack = 4;
    RAW.push([w, d, csTrack, cs, "Fundamentals & Prep", 1, "Medium", "Medium", `Understand the core principles of ${cs}. For behavioral, use the STAR format to build your stories.`, [], ["https://www.youtube.com/c/DanCroitor", "https://pages.cs.wisc.edu/~remzi/OSTEP/"]]);
    
    dayCounter++;
  }
}

const RESOURCES = {
  "DSA": ["https://neetcode.io/roadmap", "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/"],
  "System Design": ["https://bytebytego.com/", "https://www.hellointerview.com/learn/system-design"],
  "CS Fundamentals": ["https://pages.cs.wisc.edu/~remzi/OSTEP/", "https://gaia.cs.umass.edu/kurose_ross/"],
  "Behavioral": ["https://www.pramp.com/", "https://www.amazon.jobs/content/en/our-workplace/leadership-principles"]
};

let out = `export const DAYS = ${JSON.stringify(DAYS)};\n`;
out += `export const TRACKS = ${JSON.stringify(TRACKS, null, 2)};\n`;
out += `export const RAW = ${JSON.stringify(RAW)};\n`;
out += `export const RESOURCES = ${JSON.stringify(RESOURCES, null, 2)};\n`;
out += `export const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];\n`;
out += `export function buildPlan() {
  const p = {};
  RAW.forEach(([w, d, t, topic, sub, hrs, diff, pri, desc, probs, res]) => {
    if (!p[w]) p[w] = {};
    if (!p[w][d]) p[w][d] = [];
    p[w][d].push({ track: t, topic, sub, hrs, diff, pri, desc, probs, res, id: \`\${w}-\${d}-\${t}\` });
  });
  return p;
}\nexport const PLAN = buildPlan();\n`;

fs.writeFileSync(path.join(__dirname, 'src', 'data.js'), out);
console.log("data.js written successfully with extended 90-day plan");
