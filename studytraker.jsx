import { useState, useEffect, useCallback } from "react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TRACKS = [
    { id: 0, label: "DSA", sublabel: "College hours", color: "#A78BFA", bg: "rgba(167,139,250,0.15)", icon: "📚", tasks: "60 Tasks" },
    { id: 1, label: "Full Stack", sublabel: "6:00 – 8:00 PM", color: "#6EE7B7", bg: "rgba(110,231,183,0.15)", icon: "💻", tasks: "60 Tasks" },
    { id: 2, label: "SD / DevOps", sublabel: "8:00 – 10:00 PM", color: "#FCD34D", bg: "rgba(252,211,77,0.15)", icon: "🏗", tasks: "60 Tasks" },
];

const RAW = [
    [1,0,0,"Arrays","Memory Model & Basics",2],[1,0,1,"HTML5","Semantic Markup",2],[1,0,2,"System Design","Scalability Basics",2],
    [1,1,0,"Arrays","Two Pointers",2],[1,1,1,"CSS","Grid & Flexbox",2],[1,1,2,"System Design","CAP Theorem",2],
    [1,2,0,"Arrays","Sliding Window",2],[1,2,1,"JavaScript","Closures & Scope",2],[1,2,2,"System Design","Load Balancing",2],
    [1,3,0,"Hashing","HashMaps & Sets",2],[1,3,1,"JavaScript","Event Loop & Async",2],[1,3,2,"System Design","CDN & Caching",2],
    [1,4,0,"Arrays","Prefix Sum & Intervals",2],[1,4,1,"JavaScript","Functional JS",2],[1,4,2,"DevOps","Linux Basics",2],
    [1,5,0,"Arrays","Week Review & Mock",2],[1,5,1,"JavaScript","OOP & Prototypes",2],[1,5,2,"DevOps","Shell Scripting",2],
    [2,0,0,"Linked Lists","Singly LL Basics",2],[2,0,1,"React","Core Concepts & JSX",2],[2,0,2,"System Design","DB Replication",2],
    [2,1,0,"Linked Lists","Slow-Fast Pointers",2],[2,1,1,"React","Hooks Deep Dive",2],[2,1,2,"System Design","Sharding Strategies",2],
    [2,2,0,"Linked Lists","Advanced LL Problems",2],[2,2,1,"React","Performance Hooks",2],[2,2,2,"DevOps","Docker Fundamentals",2],
    [2,3,0,"Stacks","Monotonic Stack",2],[2,3,1,"React","Context API & State",2],[2,3,2,"DevOps","Dockerfile & Images",2],
    [2,4,0,"Stacks","Hard Stack Problems",2],[2,4,1,"React","Custom Hooks",2],[2,4,2,"DevOps","Docker Compose",2],
    [2,5,0,"Queues","Queue & Deque",2],[2,5,1,"React","Mini Project",3],[2,5,2,"DevOps","Containerize App",2],
    [3,0,0,"Binary Trees","Traversals",2],[3,0,1,"Next.js","App Router",2],[3,0,2,"System Design","URL Shortener",2],
    [3,1,0,"Binary Trees","Path & LCA",2],[3,1,1,"Next.js","Server Components",2],[3,1,2,"System Design","Pastebin Design",2],
    [3,2,0,"BST","BST Operations",2],[3,2,1,"Next.js","Server Actions",2],[3,2,2,"DevOps","GitHub Actions",2],
    [3,3,0,"Heaps","Heap Fundamentals",2],[3,3,1,"Next.js","NextAuth",2],[3,3,2,"DevOps","Build & Test Pipeline",2],
    [3,4,0,"Heaps","Advanced Heap",2],[3,4,1,"Next.js","Performance & SEO",2],[3,4,2,"DevOps","Deploy Pipeline",2],
    [3,5,0,"Tries","Trie Data Structure",2],[3,5,1,"TypeScript","TS Fundamentals",2],[3,5,2,"DevOps","Docker in CI",2],
    [4,0,0,"Graphs","BFS & Basics",2],[4,0,1,"Node.js","Node Internals",2],[4,0,2,"System Design","Chat App",2],
    [4,1,0,"Graphs","DFS & Topo Sort",2],[4,1,1,"Node.js","Express Deep Dive",2],[4,1,2,"DevOps","Kubernetes Basics",2],
    [4,2,0,"Graphs","Union-Find",2],[4,2,1,"Node.js","REST API Build",2],[4,2,2,"DevOps","kubectl & Workloads",2],
    [4,3,0,"Graphs","Dijkstra & SP",2],[4,3,1,"Node.js","JWT Auth",2],[4,3,2,"DevOps","K8s Networking",2],
    [4,4,0,"Graphs","MST & Advanced",2],[4,4,1,"Node.js","File Upload & Email",2],[4,4,2,"DevOps","Deploy to K8s",2],
    [4,5,0,"Graphs","Graph Review",2],[4,5,1,"Node.js","Production API",3],[4,5,2,"DevOps","Helm Charts",2],
    [5,0,0,"Dynamic Programming","1D DP Patterns",2],[5,0,1,"Databases","SQL Mastery",2],[5,0,2,"System Design","Notification System",2],
    [5,1,0,"Dynamic Programming","String DP",2],[5,1,1,"Databases","PostgreSQL Deep Dive",2],[5,1,2,"DevOps","Prometheus & Grafana",2],
    [5,2,0,"Dynamic Programming","Knapsack Variants",2],[5,2,1,"Databases","MongoDB",2],[5,2,2,"DevOps","Structured Logging",2],
    [5,3,0,"Dynamic Programming","2D Grid DP",2],[5,3,1,"Databases","Redis Mastery",2],[5,3,2,"DevOps","Distributed Tracing",2],
    [5,4,0,"Dynamic Programming","Interval DP",2],[5,4,1,"Databases","DB Integration",2],[5,4,2,"DevOps","Alerting & SRE",2],
    [5,5,0,"Dynamic Programming","DP Review",2],[5,5,1,"Databases","DB Refactor Project",3],[5,5,2,"DevOps","Observability Setup",2],
    [6,0,0,"Backtracking","Fundamentals",2],[6,0,1,"GraphQL","GraphQL Basics",2],[6,0,2,"System Design","Rate Limiter Design",2],
    [6,1,0,"Backtracking","Hard Problems",2],[6,1,1,"GraphQL","GraphQL Advanced",2],[6,1,2,"DevOps","Terraform Basics",2],
    [6,2,0,"Greedy","Greedy Algorithms",2],[6,2,1,"WebSockets","Socket.io",2],[6,2,2,"DevOps","Terraform Advanced",2],
    [6,3,0,"Greedy","Hard Greedy",2],[6,3,1,"WebSockets","Real-Time Features",2],[6,3,2,"System Design","Distributed Cache",2],
    [6,4,0,"Binary Search","Advanced BS",2],[6,4,1,"Message Queues","BullMQ",2],[6,4,2,"DevOps","Ansible",2],
    [6,5,0,"Bit Manipulation","Bit Tricks",2],[6,5,1,"Full Stack","Integration Project",3],[6,5,2,"DevOps","Provision Cloud",2],
    [7,0,0,"String Algorithms","KMP & Rabin-Karp",2],[7,0,1,"Microservices","Architecture",2],[7,0,2,"System Design","News Feed Design",2],
    [7,1,0,"Advanced DS","Segment Tree",2],[7,1,1,"Microservices","gRPC & Protobuf",2],[7,1,2,"System Design","Typeahead Design",2],
    [7,2,0,"Advanced DS","Fenwick Tree",2],[7,2,1,"Microservices","Kafka Events",2],[7,2,2,"DevOps","DevSecOps",2],
    [7,3,0,"Advanced DS","Hard Graph Problems",2],[7,3,1,"Microservices","Service Mesh",2],[7,3,2,"System Design","Video Streaming",2],
    [7,4,0,"Competitive","Codeforces Practice",2],[7,4,1,"Testing","Backend Testing",2],[7,4,2,"DevOps","Infra Security",2],
    [7,5,0,"Advanced DS","DSA Review",2],[7,5,1,"Testing","E2E Playwright",2],[7,5,2,"DevOps","Harden K8s",2],
    [8,0,0,"Mock Practice","Timed Mock 1",2],[8,0,1,"Full Stack Project","Architecture Plan",2],[8,0,2,"System Design","Raft & Paxos",2],
    [8,1,0,"Mock Practice","Timed Mock 2",2],[8,1,1,"Full Stack Project","Auth + DB Core",3],[8,1,2,"System Design","Distributed Storage",2],
    [8,2,0,"Mock Practice","Timed Mock 3",2],[8,2,1,"Full Stack Project","Real-Time + Upload",3],[8,2,2,"DevOps","GitOps & ArgoCD",2],
    [8,3,0,"Mock Practice","Weakness Drill",2],[8,3,1,"Full Stack Project","Frontend Dashboard",3],[8,3,2,"System Design","SD Mock: Payments",3],
    [8,4,0,"Mock Practice","90-min Full Mock",3],[8,4,1,"Full Stack Project","Testing & Polish",2],[8,4,2,"System Design","SD Mock: Google Docs",3],
    [8,5,0,"Mock Practice","Final DSA Review",3],[8,5,1,"Full Stack Project","Deploy to Production",3],[8,5,2,"System Design","SD Mock: WhatsApp",3],
    [9,0,0,"Competitive","Hard Problems #1",2],[9,0,1,"Performance","Web Vitals & Perf",2],[9,0,2,"System Design","Uber Design",2],
    [9,1,0,"Competitive","Hard Problems #2",2],[9,1,1,"TypeScript","Advanced TypeScript",2],[9,1,2,"System Design","Search Engine Design",2],
    [9,2,0,"Competitive","Contest Simulation",2],[9,2,1,"TypeScript","TS in Production",2],[9,2,2,"DevOps","Chaos Engineering",2],
    [9,3,0,"Competitive","Speed Drill",2],[9,3,1,"Architecture","Clean Architecture",2],[9,3,2,"System Design","Object Storage (S3)",2],
    [9,4,0,"Competitive","Hard Problems #3",2],[9,4,1,"Architecture","Turborepo Monorepo",2],[9,4,2,"DevOps","Cloud Cost Optimization",2],
    [9,5,0,"Competitive","DSA Cheat Sheet",3],[9,5,1,"Architecture","Clean Arch Refactor",2],[9,5,2,"System Design","SD Cheat Sheet",3],
    [10,0,0,"Final Mock","DSA Full Mock 1",3],[10,0,1,"Portfolio","GitHub Polish",2],[10,0,2,"System Design","SD Mock: Twitter",3],
    [10,1,0,"Final Mock","DSA Full Mock 2",3],[10,1,1,"Portfolio","Resume & LinkedIn",2],[10,1,2,"System Design","SD Mock: WhatsApp",3],
    [10,2,0,"Final Mock","Weak Area Drill",2],[10,2,1,"Portfolio","Open Source PR",3],[10,2,2,"DevOps","DevOps Reference Doc",2],
    [10,3,0,"Final Mock","Speed Round",2],[10,3,1,"Portfolio","FS Mock Interview",3],[10,3,2,"System Design","SD Mock: Dropbox",3],
    [10,4,0,"Final Mock","Grand Simulation",3],[10,4,1,"Interview Prep","Behavioural Prep",2],[10,4,2,"System Design","SD Mock: YouTube",3],
    [10,5,0,"Celebration","Plan Next 3 Months",2],[10,5,1,"Celebration","Deploy & Share Work",2],[10,5,2,"Celebration","Write Your Learnings",2],
];

function buildPlan() {
    const p = {};
    RAW.forEach(([w, d, t, topic, sub, hrs]) => {
        if (!p[w]) p[w] = {};
        if (!p[w][d]) p[w][d] = [];
        p[w][d].push({ track: t, topic, sub, hrs, id: `${w}-${d}-${t}` });
    });
    return p;
}
const PLAN = buildPlan();

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
:root{--bg:#0A0A0F;--card:#161620;--card2:#1E1E2A;--text:#EEEEF0;--sub:#7A7A8E;--accent:#D4A853;--accent2:#E8C97A;--purple:#A78BFA;--green:#6EE7B7;--yellow:#FCD34D;--red:#F87171;--border:rgba(255,255,255,0.06);}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased;overflow-x:hidden;}
.app{max-width:430px;margin:0 auto;min-height:100vh;position:relative;padding-bottom:90px;background:var(--bg);}
.page{padding:0 20px 20px;animation:fadeUp .35s ease;}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
.bottom-nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);max-width:430px;width:100%;z-index:100;background:rgba(10,10,15,0.92);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-top:1px solid var(--border);display:flex;padding:10px 8px 28px;gap:0;}
.nav-btn{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;background:none;border:none;cursor:pointer;padding:6px 0;transition:all .2s;}
.nav-btn svg{width:22px;height:22px;transition:all .2s;}
.nav-btn span{font-size:10px;font-weight:500;letter-spacing:.02em;transition:all .2s;}
.fab{position:fixed;bottom:70px;left:50%;transform:translateX(-50%);width:54px;height:54px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));border:none;cursor:pointer;z-index:101;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(212,168,83,0.35);transition:all .2s;}
.fab:hover{transform:translateX(-50%) scale(1.08);}
.fab:active{transform:translateX(-50%) scale(0.95);}
.task-card{background:var(--card);border-radius:16px;padding:16px;margin-bottom:10px;cursor:pointer;transition:all .2s;border:1px solid var(--border);}
.task-card:hover{border-color:rgba(255,255,255,0.1);transform:translateY(-1px);}
.task-card:active{transform:scale(0.98);}
.chip{display:inline-flex;align-items:center;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:.02em;}
.pbar{height:4px;border-radius:2px;background:rgba(255,255,255,0.08);overflow:hidden;}
.pfill{height:100%;border-radius:2px;transition:width .7s cubic-bezier(.4,0,.2,1);}
.date-pill{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;cursor:pointer;transition:all .2s;color:var(--sub);background:transparent;border:none;flex-shrink:0;}
.date-pill.active{background:var(--accent);color:#0A0A0F;box-shadow:0 2px 12px rgba(212,168,83,0.3);}
.date-pill.today:not(.active){border:2px solid var(--accent);color:var(--accent);}
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:200;display:flex;align-items:flex-end;justify-content:center;animation:fadeIn .2s;}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.modal{background:var(--card);border-radius:24px 24px 0 0;max-width:430px;width:100%;max-height:85vh;overflow-y:auto;padding:24px 20px 40px;animation:slideUp .3s ease;}
@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
.detail-page{position:fixed;inset:0;background:var(--bg);z-index:150;overflow-y:auto;animation:slideIn .3s ease;max-width:430px;margin:0 auto;}
@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}
.toast-wrap{position:fixed;top:60px;left:50%;transform:translateX(-50%);z-index:999;pointer-events:none;}
.toast{background:rgba(30,30,42,0.95);backdrop-filter:blur(12px);color:#fff;padding:12px 22px;border-radius:14px;font-size:14px;font-weight:500;animation:tin .28s ease,tout .3s ease 2.6s forwards;white-space:nowrap;}
@keyframes tin{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
@keyframes tout{to{opacity:0;transform:translateY(-8px)}}
.input-field{width:100%;background:var(--card2);border:1px solid var(--border);border-radius:12px;padding:14px 16px;color:var(--text);font-size:14px;font-family:'Inter',sans-serif;outline:none;transition:border-color .2s;}
.input-field:focus{border-color:var(--accent);}
.input-field::placeholder{color:var(--sub);}
textarea.input-field{resize:vertical;min-height:100px;}
.priority-badge{display:inline-flex;align-items:center;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;}
.notif-item{display:flex;gap:14px;padding:16px 0;border-bottom:1px solid var(--border);align-items:flex-start;}
.notif-item:last-child{border-bottom:none;}
.avatar{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}
`;

export default function App() {
    const now = new Date();
    const rawDay = now.getDay();
    const todayIdx = rawDay === 0 ? 5 : rawDay - 1;
    const clampedToday = Math.min(todayIdx, 5);
    const hr = now.getHours();
    const greeting = hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening";

    const [week, setWeek] = useState(1);
    const [selDay, setSelDay] = useState(clampedToday);
    const [done, setDone] = useState({});
    const [tab, setTab] = useState("home");
    const [toast, setToast] = useState(null);
    const [detailTask, setDetailTask] = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    const [customTasks, setCustomTasks] = useState([]);
    const [newTask, setNewTask] = useState({ name: "", desc: "", priority: "Medium", color: 0 });

    useEffect(() => {
        try {
            const saved = localStorage.getItem("vtask_dark_v3");
            if (saved) setDone(JSON.parse(saved));
            const ct = localStorage.getItem("vtask_custom_v3");
            if (ct) setCustomTasks(JSON.parse(ct));
        } catch (e) {}
    }, []);

    const persist = useCallback(d => {
        try { localStorage.setItem("vtask_dark_v3", JSON.stringify(d)); } catch (e) {}
    }, []);

    const toggle = (id, e) => {
        if (e) e.stopPropagation();
        const n = { ...done };
        n[id] ? delete n[id] : (n[id] = true);
        setDone(n);
        persist(n);
    };

    const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 3000); };

    const todayTasks = PLAN[week]?.[selDay] || [];
    const todayDone = todayTasks.filter(t => done[t.id]).length;
    const todayPct = todayTasks.length ? todayDone / todayTasks.length : 0;
    const wkAll = DAYS.flatMap((_, d) => PLAN[week]?.[d] || []);
    const wkDone = wkAll.filter(t => done[t.id]).length;
    const totalAll = RAW.length;
    const totalDone = Object.keys(done).filter(k => done[k]).length;
    const totalPct = totalAll ? totalDone / totalAll : 0;

    const priorityColors = { High: "#F87171", Medium: "#FCD34D", Low: "#6EE7B7" };

    const handleCreateTask = () => {
        if (!newTask.name.trim()) { showToast("Please enter a task name"); return; }
        const ct = [...customTasks, { ...newTask, id: `custom-${Date.now()}`, createdAt: new Date().toISOString() }];
        setCustomTasks(ct);
        localStorage.setItem("vtask_custom_v3", JSON.stringify(ct));
        setNewTask({ name: "", desc: "", priority: "Medium", color: 0 });
        setShowCreate(false);
        showToast("Task created! ✨");
    };

    const timeSlots = [
        { start: "College Hours", end: "", track: 0 },
        { start: "6:00 PM", end: "8:00 PM", track: 1 },
        { start: "8:00 PM", end: "10:00 PM", track: 2 },
    ];

    const navItems = [
        { id: "home", label: "Home", path: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" },
        { id: "calendar", label: "Calendar", path: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
        { id: "spacer" },
        { id: "notif", label: "Alerts", path: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
        { id: "profile", label: "Profile", path: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    ];

    return (
        <>
            <style>{CSS}</style>
            {toast && <div className="toast-wrap"><div className="toast">{toast}</div></div>}

            <div className="app">
                {/* ═══ HOME ═══ */}
                {tab === "home" && (
                    <div className="page">
                        <div style={{ paddingTop: 20, marginBottom: 28 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div>
                                    <p style={{ fontSize: 14, color: "var(--sub)", marginBottom: 4 }}>Hello Vivek 👋</p>
                                    <h1 style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.5px" }}>
                                        Manage Your<br />Daily Tasks
                                    </h1>
                                </div>
                                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                    <div style={{ background: "var(--card)", borderRadius: 12, padding: "8px 14px", fontSize: 13, fontWeight: 600, color: "var(--accent)", border: "1px solid var(--border)" }}>
                                        Week {week}/10
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Week Slider */}
                        <div style={{ display: "flex", gap: 6, marginBottom: 24, overflowX: "auto", paddingBottom: 4 }}>
                            {Array.from({ length: 10 }, (_, i) => {
                                const w = i + 1;
                                const sel = w === week;
                                return (
                                    <button key={w} onClick={() => setWeek(w)} style={{
                                        background: sel ? "var(--accent)" : "var(--card)",
                                        color: sel ? "#0A0A0F" : "var(--sub)",
                                        border: "1px solid " + (sel ? "var(--accent)" : "var(--border)"),
                                        borderRadius: 12, padding: "8px 16px", fontSize: 13, fontWeight: 600,
                                        cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit", transition: "all .2s",
                                    }}>W{w}</button>
                                );
                            })}
                        </div>

                        {/* Track Categories */}
                        <div style={{ display: "flex", gap: 10, marginBottom: 28, overflowX: "auto" }}>
                            {TRACKS.map(tr => {
                                const allTr = RAW.filter(r => r[2] === tr.id);
                                const doneTr = allTr.filter(r => done[`${r[0]}-${r[1]}-${r[2]}`]).length;
                                return (
                                    <div key={tr.id} style={{
                                        background: tr.bg, borderRadius: 18, padding: "18px 16px", minWidth: 130, flex: 1,
                                        border: `1px solid ${tr.color}22`, cursor: "pointer", transition: "all .2s",
                                    }}>
                                        <div style={{ fontSize: 28, marginBottom: 10 }}>{tr.icon}</div>
                                        <div style={{ fontSize: 15, fontWeight: 700, color: tr.color, marginBottom: 4 }}>{tr.label}</div>
                                        <div style={{ fontSize: 12, color: "var(--sub)" }}>{doneTr}/{allTr.length} Tasks</div>
                                        <div className="pbar" style={{ marginTop: 10 }}>
                                            <div className="pfill" style={{ width: `${allTr.length ? doneTr / allTr.length * 100 : 0}%`, background: tr.color }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Ongoing Section */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                            <h2 style={{ fontSize: 18, fontWeight: 700 }}>Ongoing</h2>
                            <button onClick={() => setTab("calendar")} style={{ background: "none", border: "none", color: "var(--accent)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>See All</button>
                        </div>

                        {todayTasks.map(task => {
                            const tr = TRACKS[task.track];
                            const isDone = !!done[task.id];
                            const pct = isDone ? 100 : Math.floor(Math.random() * 60 + 20);
                            return (
                                <div key={task.id} className="task-card" onClick={() => setDetailTask(task)}
                                    style={{ borderLeft: `3px solid ${tr.color}`, opacity: isDone ? 0.5 : 1 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                                        <span className="priority-badge" style={{
                                            background: task.hrs >= 3 ? "rgba(248,113,113,0.15)" : "rgba(252,211,77,0.15)",
                                            color: task.hrs >= 3 ? "#F87171" : "#FCD34D"
                                        }}>{task.hrs >= 3 ? "High" : "Medium"}</span>
                                        <span style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)" }}>{pct}%</span>
                                    </div>
                                    <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, color: isDone ? "var(--sub)" : "var(--text)", textDecoration: isDone ? "line-through" : "none" }}>
                                        {task.topic}
                                    </div>
                                    <div style={{ fontSize: 13, color: "var(--sub)", marginBottom: 10 }}>{task.sub}</div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <span style={{ fontSize: 12, color: "var(--sub)" }}>⏰ {tr.sublabel}</span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                            <span className="chip" style={{ background: tr.bg, color: tr.color, fontSize: 10 }}>{tr.label}</span>
                                            <button onClick={(e) => toggle(task.id, e)} style={{
                                                width: 26, height: 26, borderRadius: 8, border: `2px solid ${tr.color}`,
                                                background: isDone ? tr.color : "transparent", cursor: "pointer",
                                                display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s",
                                            }}>
                                                {isDone && <svg width="12" height="10" viewBox="0 0 12 10"><path d="M1 5L4.5 8.5L11 1" stroke="#0A0A0F" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Overall Progress */}
                        <div style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)", borderRadius: 20, padding: 20, marginTop: 12, border: "1px solid var(--border)" }}>
                            <div style={{ fontSize: 14, color: "var(--sub)", marginBottom: 8, fontWeight: 500 }}>Overall Journey</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                <div style={{ fontSize: 36, fontWeight: 800, color: "var(--accent)" }}>{Math.round(totalPct * 100)}%</div>
                                <div style={{ flex: 1 }}>
                                    <div className="pbar" style={{ height: 6, marginBottom: 8 }}>
                                        <div className="pfill" style={{ width: `${totalPct * 100}%`, background: "linear-gradient(90deg, var(--accent), var(--accent2))" }} />
                                    </div>
                                    <div style={{ fontSize: 12, color: "var(--sub)" }}>{totalDone} of {totalAll} tasks · Week {week}/10</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══ CALENDAR ═══ */}
                {tab === "calendar" && (
                    <div className="page">
                        <div style={{ paddingTop: 20, marginBottom: 20 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <h2 style={{ fontSize: 22, fontWeight: 700 }}>{MONTHS[now.getMonth()]} {now.getFullYear()}</h2>
                                    <span style={{ color: "var(--sub)", fontSize: 18 }}>▾</span>
                                </div>
                                <div style={{ display: "flex", gap: 8 }}>
                                    {[["☰", false], ["⊞", true]].map(([icon, active], i) => (
                                        <div key={i} style={{
                                            width: 36, height: 36, borderRadius: 10, background: active ? "var(--accent)" : "var(--card)",
                                            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                                            color: active ? "#0A0A0F" : "var(--sub)", cursor: "pointer", border: "1px solid var(--border)",
                                        }}>{icon}</div>
                                    ))}
                                </div>
                            </div>

                            {/* Day Labels */}
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, padding: "0 4px" }}>
                                {DAYS.map(d => (
                                    <span key={d} style={{ fontSize: 12, color: "var(--sub)", fontWeight: 500, width: 38, textAlign: "center" }}>{d}</span>
                                ))}
                            </div>

                            {/* Date Pills */}
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
                                {DAYS.map((d, i) => (
                                    <button key={d} onClick={() => setSelDay(i)}
                                        className={`date-pill${i === selDay ? " active" : ""}${i === clampedToday && i !== selDay ? " today" : ""}`}>
                                        {13 + i}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Time Range Header */}
                        <div style={{ fontSize: 13, color: "var(--sub)", marginBottom: 16, textAlign: "center", fontWeight: 500 }}>
                            College Hours — 10:00 PM
                        </div>

                        {/* Day Section with Timeline */}
                        <div style={{ position: "relative", paddingLeft: 14 }}>
                            <div style={{ position: "absolute", left: 6, top: 0, bottom: 0, width: 2, background: "var(--border)", borderRadius: 1 }} />
                            
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                                <div style={{ width: 10, height: 10, borderRadius: 5, background: "var(--accent)", marginLeft: -8, zIndex: 1, boxShadow: "0 0 8px rgba(212,168,83,0.4)" }} />
                                <span style={{ fontSize: 13, color: "var(--sub)", fontWeight: 600 }}>{DAYS[selDay]}</span>
                                <div style={{ width: 32, height: 32, borderRadius: 10, background: "var(--card)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "var(--text)", border: "1px solid var(--border)" }}>
                                    {selDay + 13}
                                </div>
                            </div>

                            {todayTasks.length === 0 ? (
                                <div className="task-card" style={{ textAlign: "center", padding: 32, marginLeft: 16 }}>
                                    <div style={{ fontSize: 42, marginBottom: 10 }}>🛌</div>
                                    <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Rest Day</div>
                                    <div style={{ fontSize: 13, color: "var(--sub)" }}>No sessions scheduled</div>
                                </div>
                            ) : (
                                <>
                                    {todayTasks.map((task, idx) => {
                                        const tr = TRACKS[task.track];
                                        const isDone = !!done[task.id];
                                        return (
                                            <div key={task.id}>
                                                <div className="task-card" onClick={() => setDetailTask(task)}
                                                    style={{ marginLeft: 16, borderLeft: `3px solid ${tr.color}`, opacity: isDone ? 0.5 : 1 }}>
                                                    <div style={{ fontSize: 11, color: tr.color, fontWeight: 600, marginBottom: 6 }}>
                                                        {tr.sublabel}
                                                    </div>
                                                    <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, textDecoration: isDone ? "line-through" : "none" }}>
                                                        {task.topic}
                                                    </div>
                                                    <div style={{ fontSize: 13, color: "var(--sub)", marginBottom: 8 }}>{task.sub}</div>
                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                        <span className="chip" style={{ background: tr.bg, color: tr.color }}>{tr.label}</span>
                                                        <button onClick={(e) => toggle(task.id, e)} style={{
                                                            width: 24, height: 24, borderRadius: 7,
                                                            border: `2px solid ${tr.color}`, background: isDone ? tr.color : "transparent",
                                                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                                                        }}>
                                                            {isDone && <svg width="10" height="8" viewBox="0 0 12 10"><path d="M1 5L4.5 8.5L11 1" stroke="#0A0A0F" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>}
                                                        </button>
                                                    </div>
                                                </div>
                                                {idx < todayTasks.length - 1 && (
                                                    <div style={{ marginLeft: 16, padding: "8px 16px", borderLeft: "2px dashed var(--border)", marginBottom: 4 }}>
                                                        <span style={{ fontSize: 12, color: "var(--sub)", fontStyle: "italic" }}>Break</span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* ═══ NOTIFICATIONS ═══ */}
                {tab === "notif" && (
                    <div className="page">
                        <div style={{ paddingTop: 20, marginBottom: 20 }}>
                            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Notifications</h2>
                            <p style={{ fontSize: 13, color: "var(--sub)" }}>Week {week} · {wkDone}/{wkAll.length} tasks done</p>
                        </div>

                        {/* Today's Summary */}
                        <div style={{ background: "linear-gradient(135deg, rgba(212,168,83,0.12), rgba(167,139,250,0.08))", borderRadius: 18, padding: 18, marginBottom: 20, border: "1px solid var(--border)" }}>
                            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: "var(--accent)" }}>Today's Schedule</div>
                            {todayTasks.map(task => {
                                const tr = TRACKS[task.track];
                                const isDone = !!done[task.id];
                                return (
                                    <div key={task.id} className="notif-item" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                                        <div className="avatar" style={{ background: tr.bg }}>{tr.icon}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{task.topic}</div>
                                            <div style={{ fontSize: 12, color: "var(--sub)" }}>{tr.sublabel} · {task.hrs}h</div>
                                        </div>
                                        <span className="chip" style={{ background: isDone ? "rgba(110,231,183,0.15)" : "rgba(252,211,77,0.15)", color: isDone ? "var(--green)" : "var(--yellow)", fontSize: 10 }}>
                                            {isDone ? "Done" : "Pending"}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Track Progress Notifications */}
                        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Track Progress</h3>
                        {TRACKS.map(tr => {
                            const allTr = RAW.filter(r => r[2] === tr.id);
                            const doneTr = allTr.filter(r => done[`${r[0]}-${r[1]}-${r[2]}`]).length;
                            const pct = allTr.length ? Math.round(doneTr / allTr.length * 100) : 0;
                            return (
                                <div key={tr.id} className="notif-item">
                                    <div className="avatar" style={{ background: tr.bg }}>{tr.icon}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{tr.label}</div>
                                        <div className="pbar" style={{ marginBottom: 4 }}>
                                            <div className="pfill" style={{ width: `${pct}%`, background: tr.color }} />
                                        </div>
                                        <div style={{ fontSize: 12, color: "var(--sub)" }}>{doneTr}/{allTr.length} tasks · {pct}%</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ═══ PROFILE ═══ */}
                {tab === "profile" && (
                    <div className="page">
                        <div style={{ paddingTop: 20, marginBottom: 24 }}>
                            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Profile</h2>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 28 }}>
                                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent), var(--purple))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, marginBottom: 14, boxShadow: "0 4px 20px rgba(212,168,83,0.25)" }}>V</div>
                                <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Vivek</div>
                                <div style={{ fontSize: 14, color: "var(--sub)" }}>Full Stack Developer in Training</div>
                            </div>
                        </div>

                        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Statistics</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
                            {[
                                { label: "Completed", value: totalDone, icon: "✅", color: "var(--green)" },
                                { label: "Remaining", value: totalAll - totalDone, icon: "📋", color: "var(--yellow)" },
                                { label: "This Week", value: `${wkDone}/${wkAll.length}`, icon: "📅", color: "var(--purple)" },
                                { label: "Today", value: `${todayDone}/${todayTasks.length}`, icon: "☀️", color: "var(--accent)" },
                            ].map(s => (
                                <div key={s.label} className="task-card" style={{ textAlign: "center", padding: 18 }}>
                                    <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                                    <div style={{ fontSize: 22, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
                                    <div style={{ fontSize: 12, color: "var(--sub)", fontWeight: 500 }}>{s.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Settings Links */}
                        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>General</h3>
                        {[
                            { label: "My Profile", icon: "👤" },
                            { label: "All Tasks", icon: "📋", action: () => setTab("calendar") },
                            { label: "Reset Progress", icon: "🔄", action: () => { setDone({}); persist({}); showToast("Progress reset"); } },
                        ].map(item => (
                            <div key={item.label} className="task-card" onClick={item.action}
                                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                    <span style={{ fontSize: 20 }}>{item.icon}</span>
                                    <span style={{ fontSize: 15, fontWeight: 500 }}>{item.label}</span>
                                </div>
                                <span style={{ color: "var(--sub)", fontSize: 18 }}>›</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* ═══ TASK DETAIL ═══ */}
                {detailTask && (() => {
                    const tr = TRACKS[detailTask.track];
                    const isDone = !!done[detailTask.id];
                    return (
                        <div className="detail-page">
                            <div style={{ padding: "20px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                                    <button onClick={() => setDetailTask(null)} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text)", fontSize: 18 }}>←</button>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <button onClick={(e) => toggle(detailTask.id, e)} style={{ background: isDone ? "var(--green)" : "var(--card)", border: `1px solid ${isDone ? "var(--green)" : "var(--border)"}`, borderRadius: 12, padding: "8px 16px", cursor: "pointer", color: isDone ? "#0A0A0F" : "var(--text)", fontSize: 13, fontWeight: 600, fontFamily: "inherit" }}>
                                            {isDone ? "✓ Done" : "Mark Done"}
                                        </button>
                                    </div>
                                </div>

                                <div style={{ background: `linear-gradient(135deg, ${tr.color}15, ${tr.color}08)`, borderRadius: 20, padding: "28px 24px", marginBottom: 24, border: `1px solid ${tr.color}22` }}>
                                    <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16, lineHeight: 1.3 }}>{detailTask.topic}</h1>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                                        <div><span style={{ fontSize: 11, color: "var(--sub)", fontWeight: 500 }}>Track</span><div style={{ fontSize: 14, fontWeight: 600, color: tr.color, marginTop: 4 }}>{tr.label}</div></div>
                                        <div><span style={{ fontSize: 11, color: "var(--sub)", fontWeight: 500 }}>Duration</span><div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{detailTask.hrs} hours</div></div>
                                        <div><span style={{ fontSize: 11, color: "var(--sub)", fontWeight: 500 }}>Time</span><div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{tr.sublabel}</div></div>
                                        <div><span style={{ fontSize: 11, color: "var(--sub)", fontWeight: 500 }}>Priority</span>
                                            <div style={{ marginTop: 4 }}><span className="priority-badge" style={{ background: detailTask.hrs >= 3 ? "rgba(248,113,113,0.15)" : "rgba(252,211,77,0.15)", color: detailTask.hrs >= 3 ? "#F87171" : "#FCD34D" }}>{detailTask.hrs >= 3 ? "High" : "Medium"}</span></div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginBottom: 24 }}>
                                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>Description</h3>
                                    <div className="task-card" style={{ cursor: "default" }}>
                                        <p style={{ fontSize: 14, color: "var(--sub)", lineHeight: 1.7 }}>
                                            Focus on <strong style={{ color: "var(--text)" }}>{detailTask.sub}</strong> in the {tr.label} track.
                                            This is a {detailTask.hrs}-hour deep work session. Stay focused and take breaks as needed. 💪
                                        </p>
                                    </div>
                                </div>

                                <div style={{ marginBottom: 24 }}>
                                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>Task Color</h3>
                                    <div className="task-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "default" }}>
                                        <span style={{ fontSize: 14, color: "var(--sub)" }}>{tr.label} Track</span>
                                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: tr.color, boxShadow: `0 2px 8px ${tr.color}44` }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })()}

                {/* ═══ CREATE TASK MODAL ═══ */}
                {showCreate && (
                    <div className="modal-overlay" onClick={() => setShowCreate(false)}>
                        <div className="modal" onClick={e => e.stopPropagation()}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                                <h2 style={{ fontSize: 20, fontWeight: 700 }}>Create New Task</h2>
                                <button onClick={() => setShowCreate(false)} style={{ background: "var(--card2)", border: "none", width: 32, height: 32, borderRadius: 10, cursor: "pointer", color: "var(--text)", fontSize: 16 }}>✕</button>
                            </div>

                            <div style={{ marginBottom: 16 }}>
                                <label style={{ fontSize: 13, color: "var(--sub)", fontWeight: 500, marginBottom: 8, display: "block" }}>Task Name</label>
                                <input className="input-field" placeholder="Enter task name..." value={newTask.name} onChange={e => setNewTask({ ...newTask, name: e.target.value })} />
                            </div>

                            <div style={{ marginBottom: 16 }}>
                                <label style={{ fontSize: 13, color: "var(--sub)", fontWeight: 500, marginBottom: 8, display: "block" }}>Description</label>
                                <textarea className="input-field" placeholder="Add description..." value={newTask.desc} onChange={e => setNewTask({ ...newTask, desc: e.target.value })} />
                            </div>

                            <div style={{ marginBottom: 16 }}>
                                <label style={{ fontSize: 13, color: "var(--sub)", fontWeight: 500, marginBottom: 8, display: "block" }}>Priority</label>
                                <div style={{ display: "flex", gap: 10 }}>
                                    {["Low", "Medium", "High"].map(p => (
                                        <button key={p} onClick={() => setNewTask({ ...newTask, priority: p })} style={{
                                            flex: 1, padding: "10px", borderRadius: 12, border: `1.5px solid ${newTask.priority === p ? priorityColors[p] : "var(--border)"}`,
                                            background: newTask.priority === p ? `${priorityColors[p]}15` : "var(--card2)",
                                            color: newTask.priority === p ? priorityColors[p] : "var(--sub)",
                                            fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                                        }}>{p}</button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginBottom: 24 }}>
                                <label style={{ fontSize: 13, color: "var(--sub)", fontWeight: 500, marginBottom: 8, display: "block" }}>Pick Task Color</label>
                                <div style={{ display: "flex", gap: 12 }}>
                                    {TRACKS.map((tr, i) => (
                                        <button key={i} onClick={() => setNewTask({ ...newTask, color: i })} style={{
                                            width: 36, height: 36, borderRadius: "50%", background: tr.color, border: newTask.color === i ? "3px solid white" : "3px solid transparent",
                                            cursor: "pointer", boxShadow: newTask.color === i ? `0 2px 12px ${tr.color}55` : "none",
                                        }} />
                                    ))}
                                </div>
                            </div>

                            <button onClick={handleCreateTask} style={{
                                width: "100%", padding: "16px", borderRadius: 14, border: "none",
                                background: "linear-gradient(135deg, var(--accent), var(--accent2))",
                                color: "#0A0A0F", fontSize: 16, fontWeight: 700, cursor: "pointer",
                                fontFamily: "inherit", boxShadow: "0 4px 16px rgba(212,168,83,0.3)",
                            }}>Create Task</button>
                        </div>
                    </div>
                )}

                {/* FAB */}
                <button className="fab" onClick={() => setShowCreate(true)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14M5 12h14" stroke="#0A0A0F" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                </button>

                {/* BOTTOM NAV */}
                <div className="bottom-nav">
                    {navItems.map(item => {
                        if (item.id === "spacer") return <div key="spacer" style={{ width: 60 }} />;
                        const active = tab === item.id;
                        return (
                            <button key={item.id} className="nav-btn" onClick={() => setTab(item.id)}>
                                <svg viewBox="0 0 24 24" fill="none" stroke={active ? "var(--accent)" : "var(--sub)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d={item.path} />
                                </svg>
                                <span style={{ color: active ? "var(--accent)" : "var(--sub)" }}>{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </>
    );
}