const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./src/roadmap.json', 'utf8'));

// Subjects to Tracks mapping
// 0: DSA, 1: Full Stack, 2: System Design / CS / Cloud / DevOps, 3: AI/ML, 4: Behavioral
const subjectTrackMap = {
  "DSA": 0,
  "Competitive": 0,
  "Full Stack": 1,
  "System Design": 2,
  "CS Fundamentals": 2,
  "DevOps": 2,
  "Cloud (GCP)": 2,
  "Cloud (AWS)": 2,
  "Cloud": 2,
  "AI/ML": 3,
  "Behavioral": 4
};

const TRACKS = [
  { id: 0, label: "DSA", sublabel: "Morning (1.5 hrs)", color: "#A78BFA", bg: "rgba(167,139,250,0.15)", icon: "📚", tasks: "90 Days" },
  { id: 1, label: "Full Stack", sublabel: "Afternoon (2 hrs)", color: "#6EE7B7", bg: "rgba(110,231,183,0.15)", icon: "💻", tasks: "90 Days" },
  { id: 2, label: "SD / Cloud / CS", sublabel: "Evening (1 hr)", color: "#FCD34D", bg: "rgba(252,211,77,0.15)", icon: "🏗", tasks: "90 Days" },
  { id: 3, label: "AI/ML", sublabel: "Priority", color: "#60A5FA", bg: "rgba(96,165,250,0.15)", icon: "🤖", tasks: "90 Days" },
  { id: 4, label: "Behavioral", sublabel: "Prep", color: "#F87171", bg: "rgba(248,113,113,0.15)", icon: "💼", tasks: "90 Days" }
];

const RAW = [];

data.days.forEach(dayInfo => {
  const dayNum = dayInfo.day; // 1 to 90
  // week 1 is days 1-7, week 2 is days 8-14
  const w = Math.ceil(dayNum / 7);
  // day of week 0-6 (0=Mon, 6=Sun)
  const d = (dayNum - 1) % 7; 
  
  if (dayInfo.topics) {
    dayInfo.topics.forEach((topic, idx) => {
      let t = subjectTrackMap[topic.subject] !== undefined ? subjectTrackMap[topic.subject] : 2;
      
      // rich description
      let descHTML = `
      <div style="font-family: system-ui, sans-serif; padding-top: 6px;">
        <h3 style="margin-top:0; font-size:16px; color:var(--text);">${topic.subject}</h3>
        <p style="color:var(--text); line-height:1.6; font-size:14px; margin-bottom: 12px;"><strong>What to learn:</strong> ${topic.what_to_learn || ""}</p>
        <p style="color:var(--sub); line-height: 1.6; font-size:13px; margin-bottom: 12px;"><strong>Practice:</strong> ${topic.practice || ""}</p>
      </div>`;
      
      let hrs = topic.subject === "DSA" ? 1.5 : (topic.subject === "Full Stack" ? 2 : 1);
      
      let resources = [];
      if (topic.resources) {
        resources = topic.resources.map(r => r.url);
      }
      
      // format: [week, dayOfWeek, trackId, topicTitle, subTitle, hrs, diff, pri, desc, probs, res]
      RAW.push([
        w,
        d,
        t,
        dayInfo.title, // main topic
        topic.topic, // sub topic
        hrs,
        "Medium",
        "High",
        descHTML,
        [], // probs
        resources
      ]);
    });
  }
});

let out = "export const TRACKS = " + JSON.stringify(TRACKS, null, 2) + ";\n";
out += "export const RAW = " + JSON.stringify(RAW) + ";\n";

fs.writeFileSync('./src/new_data.js', out);
console.log("src/new_data.js generated!");
