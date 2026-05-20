import { useState, useEffect, useCallback, useRef, memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DAYS, TRACKS, RAW, RESOURCES, PLAN, MONTHS, ROADMAPS, PLANS, ALL_TRACKS, ALL_RAW, ALL_RESOURCES } from "./data.js";
import "./App.css";

// React Bits Components
import BlurText from "./components/BlurText.jsx";
import ShinyText from "./components/ShinyText.jsx";
import SpotlightCard from "./components/SpotlightCard.jsx";

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

/* ═══ HELPERS ═══ */
function haptic(s="light"){try{navigator.vibrate?.(s==="heavy"?30:s==="medium"?15:8)}catch(e){}}

/* ═══ NOTIFICATION SYSTEM ═══ */
function setupNotifications(todayTasks, done) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const now = new Date();
  const schedules = [
    { hour: 8, min: 0 }, { hour: 12, min: 0 },
    { hour: 16, min: 0 }, { hour: 20, min: 0 },
  ];
  const deadlines = [
    { label: "DSA", endHour: 17, trackId: 0 },
    { label: "Full Stack", endHour: 20, trackId: 1 },
    { label: "SD/DevOps", endHour: 22, trackId: 2 },
  ];
  const pending = todayTasks.filter(t => !done[t.id]);
  if (!pending.length) return;
  // Deadline reminders (30 min before)
  deadlines.forEach(dl => {
    const task = pending.find(t => t.track === dl.trackId);
    if (!task) return;
    const targetMs = new Date(now.getFullYear(), now.getMonth(), now.getDate(), dl.endHour, 0).getTime() - 30*60*1000;
    const delay = targetMs - now.getTime();
    if (delay > 0 && delay < 12*60*60*1000) {
      setTimeout(() => {
        new Notification("⏰ Deadline Approaching!", { body: `${task.topic} (${dl.label}) ends in 30 minutes!`, icon: "📚" });
      }, delay);
    }
  });
  // Every 4 hours reminder
  schedules.forEach(s => {
    const targetMs = new Date(now.getFullYear(), now.getMonth(), now.getDate(), s.hour, s.min).getTime();
    const delay = targetMs - now.getTime();
    if (delay > 0 && delay < 12*60*60*1000) {
      setTimeout(() => {
        new Notification("📋 Study Reminder", { body: `You have ${pending.length} pending tasks today. Keep going!` });
      }, delay);
    }
  });
}

/* ═══ PREMIUM VARIANTS ═══ */
const spring = { type: "spring", stiffness: 300, damping: 25 };
const fadeUp = { 
  initial: { opacity: 0, y: 14, filter: "blur(4px)" }, 
  animate: { opacity: 1, y: 0, filter: "blur(0px)" }, 
  exit: { opacity: 0, y: -10, filter: "blur(4px)" }, 
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } 
};
const scaleIn = { 
  initial: { opacity: 0, scale: 0.96, filter: "blur(4px)" }, 
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" }, 
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
};
const slideRight = { 
  initial: { x: "100%" }, 
  animate: { x: 0 }, 
  exit: { x: "100%" }, 
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } 
};
const accordionVariants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { height: "auto", opacity: 1, transition: { height: { duration: 0.35, ease: [0.16,1,0.3,1] }, opacity: { duration: 0.25, delay: 0.1 } } },
};

/* ═══ EXPANDABLE TOPIC CARD ═══ */
const TopicCard = memo(({ task, track, isDone, isExpanded, onToggleExpand, onToggleDone, activeResources }) => {
  const resources = (activeResources || RESOURCES)[task.topic] || [];
  return (
    <motion.div className="roadmap-topic interactable" layout {...scaleIn}
      style={{ "--track-color": track.color, borderColor: isExpanded ? track.color + "44" : "var(--border)" }}>
      <div className="roadmap-topic-row" onClick={onToggleExpand}>
        <div className="roadmap-topic-left">
          <button className="check-btn interactable" onClick={(e) => { e.stopPropagation(); onToggleDone(); }}
            style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${track.color}`,
              background: isDone ? track.color : "transparent", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all .2s" }}>
            {isDone && <svg width="10" height="8" viewBox="0 0 12 10"><path d="M1 5L4.5 8.5L11 1" stroke="#0A0A0F" strokeWidth="2.2" fill="none" strokeLinecap="round"/></svg>}
          </button>
          <div>
            <div className="roadmap-topic-title" style={{ textDecoration: isDone ? "line-through" : "none", opacity: isDone ? 0.5 : 1 }}>{task.topic}</div>
            <div className="roadmap-topic-sub">{task.sub} · {task.hrs}h</div>
          </div>
        </div>
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}
          style={{ color: "var(--sub)", fontSize: 18, flexShrink: 0 }}>▾</motion.div>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div initial="collapsed" animate="expanded" exit="collapsed" variants={accordionVariants}
            style={{ overflow: "hidden" }}>
            <div className="roadmap-topic-details">
              <div className="topic-detail-row">
                <span className="topic-detail-label">Track</span>
                <span style={{ color: track.color, fontWeight: 600 }}>{track.label}</span>
              </div>
              <div className="topic-detail-row">
                <span className="topic-detail-label">Duration</span>
                <span>{task.hrs} hours</span>
              </div>
              <div className="topic-detail-row">
                <span className="topic-detail-label">Time Slot</span>
                <span>{track.sublabel}</span>
              </div>
              <div className="topic-detail-row">
                <span className="topic-detail-label">Difficulty</span>
                <span className="priority-badge" style={{ "--p-color": task.diff === "Hard" ? "#F87171" : task.diff === "Medium" ? "#FCD34D" : "#6EE7B7" }}>
                  {task.diff || "Medium"}
                </span>
              </div>
              <div className="topic-detail-row">
                <span className="topic-detail-label">Priority</span>
                <span className="priority-badge" style={{ "--p-color": task.pri === "High" || task.hrs >= 3 ? "#F87171" : "#FCD34D" }}>
                  {task.pri || (task.hrs >= 3 ? "High" : "Medium")}
                </span>
              </div>
              {task.probs && task.probs.length > 0 && (
                <div className="topic-detail-row" style={{ flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
                  <span className="topic-detail-label" style={{ marginBottom: 0 }}>💻 Problems</span>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
                    {task.probs.map((p, i) => {
                      const isUrl = p.startsWith("http");
                      const href = isUrl ? p : `https://leetcode.com/problemset/all/?search=${encodeURIComponent(p.replace('LC ', ''))}`;
                      return (
                        <a key={i} href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }} onClick={e => e.stopPropagation()}>
                          <span className="chip interactable" style={{ cursor: "pointer", "--chip-color": track.color, "--chip-bg": track.bg, fontSize: 11, padding: "2px 8px" }}>
                            {isUrl ? "Link 🔗" : p} ↗
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
              {resources.length > 0 && (
                <div className="topic-resources">
                  <div className="topic-detail-label" style={{ marginBottom: 8 }}>📎 Resources</div>
                  {resources.map((url, i) => {
                    const domain = new URL(url).hostname.replace("www.", "");
                    return (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="resource-link interactable"
                        onClick={e => e.stopPropagation()}>
                        <span className="resource-icon">{domain.includes("youtube") ? "🎬" : domain.includes("leetcode") ? "💡" : domain.includes("github") ? "🐙" : "🔗"}</span>
                        <span className="resource-domain">{domain}</span>
                        <span className="resource-arrow">↗</span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

/* ═══ LOGIN SCREEN ═══ */
function LoginScreen({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedTracks, setSelectedTracks] = useState([0, 1, 2, 3]); // Pick categories
  const [error, setError] = useState("");

    const handleAuth = async (e) => {
    e.preventDefault();
    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }
    
    setError("Connecting...");
    const userKey = username.trim();
    
    let existsInDb = false;
    let firebaseAvailable = true;
    const docRef = doc(db, "users", userKey);
    try {
      const snap = await getDoc(docRef);
      existsInDb = snap.exists();
    } catch (err) {
      console.error(err);
      // Firebase might have permission issues — allow local-only mode
      if (err.code === 'permission-denied' || err.message?.includes('permission')) {
        firebaseAvailable = false;
        console.warn('Firebase permissions denied — falling back to local mode');
      } else {
        setError("Failed to connect. Check internet.");
        return;
      }
    }

    if (isSignUp) {
      if (email.trim().length < 5 || !email.includes("@")) {
        setError("Please enter a valid email address for notifications.");
        return;
      }
      if (existsInDb) {
        setError("Username already exists in the cloud. Please log in.");
        return;
      }
      
      // Save notification email, base progress & selected roadmap niches!
      const userData = {
        username: userKey,
        email: email.trim(),
        selectedTracks: selectedTracks.length > 0 ? selectedTracks : [0, 1, 2, 3],
        startDate: new Date().toISOString(),
        progress: {},
        customTasks: [],
        completedTaskNames: [],
        joinedRoadmaps: ["faang-90"],
        activeRoadmap: "faang-90"
      };
      
      if (firebaseAvailable) {
        try {
          await setDoc(docRef, userData);
        } catch (err) {
          console.warn('Firebase write failed, using local storage', err);
          localStorage.setItem(`vtask_user_${userKey}`, JSON.stringify(userData));
        }
      } else {
        localStorage.setItem(`vtask_user_${userKey}`, JSON.stringify(userData));
      }
    } else {
      if (!existsInDb && !firebaseAvailable) {
        // In local mode, check localStorage
        const localData = localStorage.getItem(`vtask_user_${userKey}`);
        if (!localData) {
          setError("Account not found. Please click 'Create Account' below to start fresh!");
          return;
        }
      } else if (!existsInDb) {
        setError("Account not found. Please click 'Create Account' below to start fresh!");
        return;
      }
    }

    onLogin(userKey);
  };

  return (
    <div className="app-shell" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <motion.div className="detail-page" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ position: "relative", inset: "auto", background: "var(--card)", padding: 40, borderRadius: 20, maxWidth: 400, width: "100%", boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }}>
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <div className="avatar" style={{ margin: "0 auto 16px", width: 56, height: 56, background: "rgba(167,139,250,0.15)", color: "#A78BFA", fontSize: 24 }}>{isSignUp ? "✨" : "🗝️"}</div>
          <h1 className="hero-title" style={{ fontSize: 24, marginBottom: 8 }}>{isSignUp ? "Start Your Journey" : "Welcome Back"}</h1>
          <p className="hero-subtitle" style={{ fontSize: 13, lineHeight: 1.5 }}>
            {isSignUp ? "Create a local profile to begin tracking your 90-Day FAANG progress independently." : "Sign in to safely securely access your progress saved on this device."}
          </p>
        </div>
        <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="form-group">
            <label style={{ fontSize: 13, color: "var(--sub)" }}>Username</label>
            <input className="input-field" placeholder="Enter your username..." value={username} onChange={e => { setUsername(e.target.value); setError(""); }} required />
          </div>
          <AnimatePresence>
            {isSignUp && (
              <motion.div className="form-group" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
                <label style={{ fontSize: 13, color: "var(--sub)" }}>Email Address (For Task Alerts)</label>
                <input className="input-field" type="email" placeholder="your@email.com" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} required={isSignUp} />
                
                <label style={{ fontSize: 13, color: "var(--sub)", marginTop: 12, display: "block" }}>Select Roadmaps (Focus Mode)</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
                  {TRACKS.map(t => (
                    <div key={t.id} className="interactable" onClick={() => {
                      if (selectedTracks.includes(t.id)) setSelectedTracks(selectedTracks.filter(x => x !== t.id));
                      else setSelectedTracks([...selectedTracks, t.id]);
                    }} style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, border: "1px solid " + t.color, background: selectedTracks.includes(t.id) ? t.color : "transparent", color: selectedTracks.includes(t.id) ? "#0A0A0F" : t.color, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                      {t.label} {selectedTracks.includes(t.id) ? "✓" : "+"}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="form-group">
            <label style={{ fontSize: 13, color: "var(--sub)" }}>Password (Optional)</label>
            <input className="input-field" type="password" placeholder="••••••••" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} />
          </div>
          {error && <div style={{ color: "#F87171", fontSize: 13, textAlign: "center", marginTop: -4 }}>{error}</div>}
          <button type="submit" className="create-btn interactable" style={{ marginTop: 10, padding: 16, fontSize: 15, fontWeight: 600 }}>
            {isSignUp ? "Create Account →" : "Log In to Roadmap →"}
          </button>
        </form>
        
        <div style={{ marginTop: 24, textAlign: "center", fontSize: 13, color: "var(--sub)" }}>
          {isSignUp ? "Already have an account? " : "New to the roadmap? "}
          <span className="interactable" style={{ color: "#A78BFA", cursor: "pointer", fontWeight: 600 }} onClick={() => { setIsSignUp(!isSignUp); setError(""); setUsername(""); setPassword("") }}>
            {isSignUp ? "Log in" : "Create Account"}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

/* ═══ ROADMAP APP WRAPPER ═══ */
export default function App() {
  const [user, setUser] = useState(() => {
    try { return localStorage.getItem("vtask_logged_in_user") || null; } catch(e) { return null; }
  });

  if (!user) {
    return <LoginScreen onLogin={(u) => {
      localStorage.setItem("vtask_logged_in_user", u);
      setUser(u);
    }} />;
  }
  return <MainApp user={user} onLogout={() => {
    localStorage.removeItem("vtask_logged_in_user");
    setUser(null);
  }} />;
}

/* ═══ MAIN APP ═══ */
function MainApp({ user, onLogout }) {
  const [isDbLoaded, setIsDbLoaded] = useState(false);
  const now = new Date();
  const rawDay = now.getDay();
  const [startDate, setStartDate] = useState(new Date().toISOString());
  const [assignedTracks, setAssignedTracks] = useState([0, 1, 2, 3]); // Loaded from Cloud

  /* ═══ MULTI-ROADMAP STATE ═══ */
  const [activeRoadmap, setActiveRoadmap] = useState("faang-90");
  const [joinedRoadmaps, setJoinedRoadmaps] = useState(["faang-90"]);

  // Derived active roadmap data
  const activeRoadmapDef = useMemo(() => ROADMAPS.find(r => r.id === activeRoadmap) || ROADMAPS[0], [activeRoadmap]);
  const activePlan = useMemo(() => PLANS[activeRoadmap] || PLAN, [activeRoadmap]);
  const activeTracks = useMemo(() => ALL_TRACKS[activeRoadmap] || TRACKS, [activeRoadmap]);
  const activeRaw = useMemo(() => ALL_RAW[activeRoadmap] || RAW, [activeRoadmap]);
  const activeResources = useMemo(() => ALL_RESOURCES[activeRoadmap] || RESOURCES, [activeRoadmap]);

  const getDayOffset = Math.floor((now - new Date(startDate)) / (1000 * 60 * 60 * 24));
  const currentWeekIdx = Math.floor(getDayOffset / 7) + 1;
  const currentDayIdx = getDayOffset % 7;
  const clampedToday = currentDayIdx;

  const hr = now.getHours();
  // We'll wrap this greeting in ShinyText
  const greeting = hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening";

  const maxWeeks = activeRoadmapDef.totalWeeks || 15;
  const [week, setWeek] = useState(Math.min(15, Math.max(1, currentWeekIdx)));
  const [selDay, setSelDay] = useState(Math.min(6, Math.max(0, currentDayIdx)));
  const [done, setDone] = useState({});
  const [tab, setTab] = useState("home");
  const [toast, setToast] = useState(null);
  const [detailTask, setDetailTask] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newTask, setNewTask] = useState({ name: "", desc: "", priority: "Medium", track: 0, week: 1, day: 0 });
  const [customTasks, setCustomTasks] = useState([]);
  const [roadmapTrack, setRoadmapTrack] = useState(null);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [expandedWeek, setExpandedWeek] = useState(1);
  const [notifsEnabled, setNotifsEnabled] = useState(false);
  const [alertEmail, setAlertEmail] = useState("");
  const scrollRef = useRef(null);

  const openDetail = useCallback((task) => { window.history.pushState({ modal: 'detail' }, ''); setDetailTask(task); }, []);
  const closeDetail = useCallback(() => { if (window.history.state?.modal === 'detail') window.history.back(); else setDetailTask(null); }, []);
  const openCreate = useCallback(() => { window.history.pushState({ modal: 'create' }, ''); setShowCreate(true); }, []);
  const closeCreate = useCallback(() => { if (window.history.state?.modal === 'create') window.history.back(); else setShowCreate(false); }, []);

  useEffect(() => {
    const handlePop = () => {
      setDetailTask(null);
      setShowCreate(false);
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      
      // Try localStorage first as baseline
      const localKey = `vtask_user_${user}`;
      const localData = localStorage.getItem(localKey);
      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          if (parsed.startDate) setStartDate(parsed.startDate);
          if (parsed.progress) setDone(parsed.progress);
          if (parsed.customTasks) setCustomTasks(parsed.customTasks);
          if (parsed.email) setAlertEmail(parsed.email);
          if (parsed.selectedTracks) setAssignedTracks([...parsed.selectedTracks, 4]);
          if (parsed.joinedRoadmaps && parsed.joinedRoadmaps.length > 0) {
            setJoinedRoadmaps(parsed.joinedRoadmaps);
            setActiveRoadmap(parsed.activeRoadmap || parsed.joinedRoadmaps[0]);
          }
        } catch (e) { console.warn('Local data parse error', e); }
      }
      
      // Then try Firebase (may fail with permission errors)
      try {
        const docRef = doc(db, "users", user);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          if (data.startDate) setStartDate(data.startDate);
          if (data.progress) setDone(data.progress);
          if (data.customTasks) setCustomTasks(data.customTasks);
          if (data.email) setAlertEmail(data.email);
          if (data.selectedTracks) setAssignedTracks([...data.selectedTracks, 4]);
          if (data.joinedRoadmaps && data.joinedRoadmaps.length > 0) {
            setJoinedRoadmaps(data.joinedRoadmaps);
            setActiveRoadmap(data.activeRoadmap || data.joinedRoadmaps[0]);
          }
          // Sync to local as backup
          localStorage.setItem(localKey, JSON.stringify(data));
        } else {
          const defaultData = { startDate: new Date().toISOString(), progress: {}, customTasks: [], joinedRoadmaps: ["faang-90"], activeRoadmap: "faang-90" };
          try {
            await setDoc(docRef, defaultData, { merge: true });
          } catch (writeErr) {
            console.warn('Firebase write failed', writeErr);
          }
          localStorage.setItem(localKey, JSON.stringify(defaultData));
        }
      } catch (err) {
        console.warn("Firebase unavailable, using local storage:", err.message);
        // Already loaded from localStorage above — just continue
      }
      
      setIsDbLoaded(true);
    }
    loadData();
    if (Notification.permission === "granted") setNotifsEnabled(true);
  }, [user]);

  const persist = useCallback(async d => {
    // Always save locally first
    try {
      const localKey = `vtask_user_${user}`;
      const existing = JSON.parse(localStorage.getItem(localKey) || '{}');
      localStorage.setItem(localKey, JSON.stringify({ ...existing, progress: d }));
    } catch(e) {}
    
    // Then try Firebase
    try {
      const completedTaskNames = [];
      Object.keys(d).forEach(id => {
        if (d[id]) {
          if (id.startsWith("custom-")) {
            const ct = customTasks.find(t => t.id === id);
            if (ct) completedTaskNames.push(ct.topic);
          } else {
            const cleanId = id.includes(':') ? id.split(':')[1] : id;
            const parts = cleanId.split("-");
            for (const rmId of Object.keys(ALL_RAW)) {
              const r = ALL_RAW[rmId].find(t => t[0] == parts[0] && t[1] == parts[1] && t[2] == parts[2]);
              if (r) { completedTaskNames.push(r[3]); break; }
            }
          }
        }
      });
      await setDoc(doc(db, "users", user), { progress: d, completedTaskNames }, { merge: true });
    } catch(e) { console.warn('Firebase persist failed, saved locally', e.message); }
  }, [user, customTasks]);

  const todayTasks = useMemo(() => {
    const roadmap = activePlan[week]?.[selDay] || [];
    const custom = customTasks.filter(t => t.week === week && t.day === selDay);
    const filteredRoadmap = roadmap.filter(t => assignedTracks.includes(t.track));
    return [...filteredRoadmap, ...custom];
  }, [week, selDay, customTasks, assignedTracks, activePlan]);

  const upcomingTasks = useMemo(() => {
    const all = [];
    const now = new Date();
    const currWeek = week;
    
    // Add roadmap tasks from tomorrow onwards in current week
    for (let d = selDay + 1; d < 6; d++) {
      if (activePlan[currWeek]?.[d]) {
        activePlan[currWeek][d].filter(t => assignedTracks.includes(t.track)).forEach(t => all.push({ ...t, dayLabel: DAYS[d], week: currWeek }));
      }
    }
    // Add custom tasks
    customTasks.forEach(t => {
      if (t.week > currWeek || (t.week === currWeek && t.day > selDay)) {
        all.push({ ...t, dayLabel: DAYS[t.day], week: t.week });
      }
    });

    return all.sort((a,b) => (a.week*10 + a.day) - (b.week*10 + b.day));
  }, [week, selDay, customTasks, activePlan]);

  useEffect(() => {
    if (notifsEnabled) setupNotifications(todayTasks, done);
  }, [notifsEnabled, todayTasks, done]);

  const toggle = useCallback((id, e) => {
    if (e) e.stopPropagation();
    haptic("medium");
    setDone(prev => {
      const n = { ...prev };
      const isDone = !n[id];
      if (isDone) n[id] = true;
      else delete n[id];
      persist(n);
      return n;
    });
  }, [persist]);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 2800); };

  const switchTab = (t) => { if(t===tab)return; haptic(); setTab(t); setRoadmapTrack(null); if(scrollRef.current)scrollRef.current.scrollTop=0; };

  const enableNotifs = async () => {
    if (!("Notification" in window)) { showToast("Notifications not supported"); return; }
    const p = await Notification.requestPermission();
    if (p === "granted") {
      setNotifsEnabled(true);
      showToast("🔔 Reminders enabled!");
      new Notification("StudyTrack", { body: "You'll get reminders based on task timings!" });
    } else showToast("Please allow notifications in settings");
  };

  useEffect(() => {
    if (!notifsEnabled) return;
    const interval = setInterval(() => {
      const currentHr = new Date().getHours();
      // Only notify right on the hour
      if (new Date().getMinutes() !== 0) return;
      
      const lastNotifKey = `notif_seen_${currentHr}_${new Date().toDateString()}_${user}`;
      if (localStorage.getItem(lastNotifKey)) return;
      
      let targetTrackId = null;
      if (currentHr === 10) targetTrackId = 0; // DSA
      else if (currentHr === 14) targetTrackId = 1; // System Design or Mock
      else if (currentHr === 18) targetTrackId = 2; // CS Fund
      else if (currentHr === 20) targetTrackId = 3; // Behavioral
      
      if (targetTrackId !== null) {
        // Find if we have a pending task today matching this track approx
        const tTask = todayTasks.find(t => (t.track === targetTrackId || (t.track > targetTrackId)) && !done[t.id]);
        if (tTask) {
          const trackDef = activeTracks[tTask.track] || TRACKS[tTask.track] || TRACKS[0];
          new Notification("Time to focus!", { body: `Ready for ${tTask.topic}? Hop in and crush your ${trackDef.label} task!` });
          localStorage.setItem(lastNotifKey, "true");
        }
      }
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [notifsEnabled, todayTasks, done]);

  const todayDone = useMemo(() => todayTasks.filter(t => done[t.id]).length, [todayTasks, done]);
  const wkAll = useMemo(() => DAYS.flatMap((_, d) => (activePlan[week]?.[d] || []).filter(t => assignedTracks.includes(t.track))), [week, assignedTracks, activePlan]);
  const wkDone = useMemo(() => wkAll.filter(t => done[t.id]).length, [wkAll, done]);
  const filteredRAW = useMemo(() => activeRaw.filter(r => assignedTracks.includes(r[2])), [assignedTracks, activeRaw]);
  const totalAll = filteredRAW.length;
  const prefix = activeRoadmap + ':';
  const totalDone = useMemo(() => filteredRAW.filter(r => done[`${prefix}${r[0]}-${r[1]}-${r[2]}`]).length, [filteredRAW, done, prefix]);
  const totalPct = totalAll ? totalDone / totalAll : 0;

  // Roadmap switcher helper
  const switchRoadmap = useCallback((rmId) => {
    setActiveRoadmap(rmId);
    const rm = ROADMAPS.find(r => r.id === rmId);
    if (rm) setWeek(prev => Math.min(prev, rm.totalWeeks));
    setRoadmapTrack(null);
    // Save to both localStorage and Firebase
    try {
      const localKey = `vtask_user_${user}`;
      const existing = JSON.parse(localStorage.getItem(localKey) || '{}');
      localStorage.setItem(localKey, JSON.stringify({ ...existing, activeRoadmap: rmId }));
    } catch(e) {}
    try { setDoc(doc(db, "users", user), { activeRoadmap: rmId }, { merge: true }); } catch(e) {};
  }, [user]);

  const joinRoadmap = useCallback((rmId) => {
    if (joinedRoadmaps.includes(rmId)) return;
    const updated = [...joinedRoadmaps, rmId];
    setJoinedRoadmaps(updated);
    try {
      const localKey = `vtask_user_${user}`;
      const existing = JSON.parse(localStorage.getItem(localKey) || '{}');
      localStorage.setItem(localKey, JSON.stringify({ ...existing, joinedRoadmaps: updated }));
    } catch(e) {}
    try { setDoc(doc(db, "users", user), { joinedRoadmaps: updated }, { merge: true }); } catch(e) {};
    showToast(`Joined ${ROADMAPS.find(r => r.id === rmId)?.label} ✨`);
  }, [joinedRoadmaps, user]);

  const leaveRoadmap = useCallback((rmId) => {
    if (joinedRoadmaps.length <= 1) { showToast("You must have at least one active roadmap"); return; }
    const updated = joinedRoadmaps.filter(id => id !== rmId);
    setJoinedRoadmaps(updated);
    const newActive = activeRoadmap === rmId ? updated[0] : activeRoadmap;
    if (activeRoadmap === rmId) setActiveRoadmap(updated[0]);
    try {
      const localKey = `vtask_user_${user}`;
      const existing = JSON.parse(localStorage.getItem(localKey) || '{}');
      localStorage.setItem(localKey, JSON.stringify({ ...existing, joinedRoadmaps: updated, activeRoadmap: newActive }));
    } catch(e) {}
    try { setDoc(doc(db, "users", user), { joinedRoadmaps: updated, activeRoadmap: newActive }, { merge: true }); } catch(e) {};
    showToast(`Left ${ROADMAPS.find(r => r.id === rmId)?.label}`);
  }, [joinedRoadmaps, activeRoadmap, user]);



  const navItems = [
    { id: "home", label: "Home", path: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" },
    { id: "calendar", label: "Calendar", path: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { id: "spacer" },
    { id: "notif", label: "Alerts", path: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
    { id: "profile", label: "Profile", path: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  ];

  if (!isDbLoaded) {
    return <div className="app-shell" style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "var(--sub)", fontSize: 13 }}>Syncing with Firebase Cloud...</div>;
  }

  return (
    <div className="app-shell" ref={scrollRef}>
      <AnimatePresence>{toast && (
        <motion.div className="toast-container" initial={{ opacity:0,y:-14,scale:0.9 }} animate={{ opacity:1,y:0,scale:1 }} exit={{ opacity:0,y:-14 }}>
          <div className="toast">{toast}</div>
        </motion.div>
      )}</AnimatePresence>

      <div className="app-content">
        <AnimatePresence mode="wait">
        {/* ═══ ROADMAP VIEW ═══ */}
        {roadmapTrack !== null ? (() => {
          const tr = activeTracks[roadmapTrack];
          if (!tr) { setRoadmapTrack(null); return null; }
          const rmPrefix = activeRoadmap + ':';
          const trackTasks = activeRaw.filter(r => r[2] === roadmapTrack);
          const trackDone = trackTasks.filter(r => done[`${rmPrefix}${r[0]}-${r[1]}-${r[2]}`]).length;
          const trackPct = trackTasks.length ? Math.round(trackDone / trackTasks.length * 100) : 0;
          return (
            <motion.div className="page" key="roadmap" {...fadeUp}>
              <div className="detail-nav">
                <button className="detail-back interactable" onClick={() => { haptic(); setRoadmapTrack(null); }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                </button>
                <h2 style={{ fontSize: 18, fontWeight: 700 }}>{tr.label} Roadmap</h2>
                <div style={{ width: 44 }} />
              </div>

              <motion.div className="roadmap-hero" style={{ "--track-color": tr.color, "--track-bg": tr.bg }} {...scaleIn}>
                <div className="roadmap-hero-icon">{tr.icon}</div>
                <div className="roadmap-hero-title">{tr.label}</div>
                <div className="roadmap-hero-sub">{tr.sublabel} · {trackDone}/{trackTasks.length} tasks</div>
                <div className="pbar" style={{ marginTop: 16, height: 6 }}>
                  <div className="pfill" style={{ width: `${trackPct}%`, background: tr.color }} />
                </div>
                <div style={{ fontSize: 12, color: "var(--sub)", marginTop: 8, textAlign: "right" }}>{trackPct}% complete</div>
              </motion.div>

              {Array.from({ length: maxWeeks }, (_, i) => {
                const w = i + 1;
                const weekTasks = DAYS.map((_, d) => (activePlan[w]?.[d] || []).find(t => t.track === roadmapTrack)).filter(Boolean);
                const weekDone = weekTasks.filter(t => done[t.id]).length;
                const isExp = expandedWeek === w;
                return (
                  <motion.div key={w} className="roadmap-week" {...scaleIn} transition={{ delay: i * 0.03 }}>
                    <div className="roadmap-week-header interactable" onClick={() => { haptic(); setExpandedWeek(isExp ? null : w); setExpandedTopic(null); }}>
                      <div className="roadmap-week-badge" style={{ background: weekDone === weekTasks.length && weekTasks.length > 0 ? "var(--green)" : isExp ? tr.color : "var(--card2)", color: weekDone === weekTasks.length || isExp ? "#0A0A0F" : "var(--sub)" }}>
                        W{w}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="roadmap-week-title">Week {w} {w === week ? "· Current" : ""}</div>
                        <div className="pbar" style={{ width: 100, marginTop: 4 }}>
                          <div className="pfill" style={{ width: `${weekTasks.length ? weekDone/weekTasks.length*100 : 0}%`, background: tr.color }} />
                        </div>
                      </div>
                      <span className="roadmap-week-count">{weekDone}/{weekTasks.length}</span>
                      <motion.span animate={{ rotate: isExp ? 90 : 0 }} style={{ color: "var(--sub)", fontSize: 20 }}>›</motion.span>
                    </div>
                    <AnimatePresence>
                      {isExp && (
                        <motion.div initial="collapsed" animate="expanded" exit="collapsed" variants={accordionVariants} style={{ overflow: "hidden" }}>
                          <div className="roadmap-week-content">
                            {weekTasks.map(task => (
                              <TopicCard key={task.id} task={task} track={tr} isDone={!!done[task.id]}
                                isExpanded={expandedTopic === task.id}
                                onToggleExpand={() => { haptic(); setExpandedTopic(expandedTopic === task.id ? null : task.id); }}
                                onToggleDone={() => toggle(task.id)}
                                activeResources={activeResources} />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          );
        })()

        /* ═══ HOME ═══ */
        : tab === "home" ? (
          <motion.div className="page" key="home" {...fadeUp}>
            <div className="page-header">
              <div>
                <motion.p className="greeting-sub" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.1 }}>
                  <ShinyText text={`${greeting} ${user} 👋`} speed={3} />
                </motion.p>
                <div className="greeting-main">
                  <BlurText text="Manage Your Daily Tasks" delay={50} className="greeting-blur" />
                </div>
              </div>
              <button className="week-badge interactable">Week {week}/{maxWeeks}</button>
            </div>

            {/* ═══ ROADMAP SWITCHER ═══ */}
            {joinedRoadmaps.length > 1 && (
              <div className="roadmap-switcher" style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
                {joinedRoadmaps.map(rmId => {
                  const rm = ROADMAPS.find(r => r.id === rmId);
                  if (!rm) return null;
                  const isActive = activeRoadmap === rmId;
                  return (
                    <motion.button key={rmId}
                      className={`interactable`}
                      onClick={() => { haptic(); switchRoadmap(rmId); }}
                      whileTap={{ scale: 0.96 }}
                      style={{
                        padding: '10px 18px', borderRadius: 12, fontSize: 13, fontWeight: 600,
                        border: `1.5px solid ${rm.color}`,
                        background: isActive ? rm.color : 'transparent',
                        color: isActive ? '#0A0A0F' : rm.color,
                        cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
                        display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0
                      }}>
                      <span>{rm.icon}</span> {rm.label}
                    </motion.button>
                  );
                })}
              </div>
            )}

            <div className="week-scroll">
              {Array.from({ length: maxWeeks }, (_, i) => {
                const w = i + 1, sel = w === week;
                return (
                  <button key={w} className={`week-pill interactable${sel ? " active" : ""}`}
                    onClick={() => { haptic(); setWeek(w); }}>{w === week ? `W${w} ★` : `W${w}`}</button>
                );
              })}
            </div>

            <div className="track-scroll">
              {activeTracks.filter(tr => assignedTracks.includes(tr.id)).map((tr, idx) => {
                const rmPrefix = activeRoadmap + ':';
                const allTr = activeRaw.filter(r => r[2] === tr.id);
                const doneTr = allTr.filter(r => done[`${rmPrefix}${r[0]}-${r[1]}-${r[2]}`]).length;
                return (
                  <motion.div key={tr.id} initial={{ opacity:0,scale:0.9 }} animate={{ opacity:1,scale:1 }} transition={{ delay: idx*0.08 }}>
                    <SpotlightCard className="track-card interactable" spotlightColor="rgba(255, 255, 255, 0.15)">
                      <div onClick={() => { haptic("medium"); setRoadmapTrack(tr.id); setExpandedWeek(week); }} style={{ height: "100%" }}>
                        <div className="track-icon">{tr.icon}</div>
                        <div className="track-label" style={{ color: tr.color }}>{tr.label}</div>
                        <div className="track-count">{doneTr}/{allTr.length} Tasks</div>
                        <div className="pbar"><div className="pfill" style={{ width: `${allTr.length ? doneTr/allTr.length*100 : 0}%`, background: tr.color }} /></div>
                      </div>
                    </SpotlightCard>
                  </motion.div>
                );
              })}
            </div>

            <div className="section-header"><h2>Ongoing</h2><button className="see-all interactable" onClick={() => switchTab("calendar")}>See All</button></div>
            {todayTasks.map((task, idx) => {
              const tr = (activeTracks[task.track] || TRACKS[task.track] || TRACKS[0]), isDone = !!done[task.id];
              return (
                <motion.div key={task.id} className={`task-card interactable${isDone ? " done" : ""}`}
                  style={{ "--track-color": tr.color }} initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ delay:(idx+3)*0.05 }}
                  onClick={() => setDetailTask(task)}>
                  <div className="task-top">
                    <span className="priority-badge" style={{ "--p-color": task.hrs >= 3 ? "#F87171" : "#FCD34D" }}>{task.hrs >= 3 ? "High" : "Medium"}</span>
                  </div>
                  <div className="task-title" style={{ textDecoration: isDone ? "line-through" : "none" }}>{task.topic}</div>
                  <div className="task-sub">{task.sub}</div>
                  <div className="task-bottom">
                    <span className="task-time">⏰ {tr.sublabel}</span>
                    <div className="task-actions">
                      <span className="chip" style={{ "--chip-color": tr.color, "--chip-bg": tr.bg }}>{tr.label}</span>
                      <button className="check-btn interactable" onClick={e => toggle(task.id, e)}
                        style={{ width:26,height:26,borderRadius:8,border:`2px solid ${tr.color}`,background:isDone?tr.color:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                        {isDone && <motion.svg width="12" height="10" viewBox="0 0 12 10" initial={{ scale:0 }} animate={{ scale:1 }}><path d="M1 5L4.5 8.5L11 1" stroke="#0A0A0F" strokeWidth="2.2" fill="none" strokeLinecap="round"/></motion.svg>}
                      </button>
                    </div>
                  </div>
                  <div className="task-accent-line" style={{ background: tr.color }} />
                </motion.div>
              );
            })}

            {/* Upcoming */}
            {upcomingTasks.length > 0 && <>
              <div className="section-header" style={{ marginTop: 8 }}><h2>Upcoming</h2></div>
              {upcomingTasks.slice(0,6).map((task, idx) => {
                const tr = activeTracks[task.track] || TRACKS[task.track] || TRACKS[0];
                return (
                  <motion.div key={task.id+"-up"} className="upcoming-item" initial={{ opacity:0,x:-10 }} animate={{ opacity:1,x:0 }} transition={{ delay: idx*0.04 }}>
                    <div className="upcoming-dot" style={{ background: tr.color }} />
                    <div className="upcoming-info">
                      <span className="upcoming-title">{task.topic}</span>
                      <span className="upcoming-meta">{task.dayLabel} · W{task.week} · {task.sub}</span>
                    </div>
                    <span className="chip" style={{ "--chip-color": tr.color, "--chip-bg": tr.bg, fontSize: 10 }}>{tr.label}</span>
                  </motion.div>
                );
              })}
            </>}

            <div className="overall-card">
              <div className="overall-label">Overall Journey · {activeRoadmapDef.label}</div>
              <div className="overall-row">
                <div className="overall-pct"><ShinyText text={`${Math.round(totalPct * 100)}%`} speed={4} /></div>
                <div className="overall-info">
                  <div className="pbar" style={{ height: 6 }}><div className="pfill accent-gradient" style={{ width: `${totalPct*100}%` }} /></div>
                  <span className="overall-sub">{totalDone} of {totalAll} tasks · Week {week}/{maxWeeks}</span>
                </div>
              </div>
            </div>

            {/* ═══ DISCOVER ROADMAPS ═══ */}
            <div className="section-header" style={{ marginTop: 28 }}><h2>Discover Roadmaps</h2></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              {ROADMAPS.map((rm, idx) => {
                const isJoined = joinedRoadmaps.includes(rm.id);
                const isActive = activeRoadmap === rm.id;
                const rmRaw = ALL_RAW[rm.id] || [];
                const rmDone = rmRaw.filter(r => done[`${rm.id}:${r[0]}-${r[1]}-${r[2]}`]).length;
                const rmPct = rmRaw.length ? Math.round(rmDone / rmRaw.length * 100) : 0;
                return (
                  <motion.div key={rm.id}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}
                    className="discover-card interactable"
                    style={{
                      background: `linear-gradient(135deg, ${rm.color}11 0%, ${rm.color}06 100%)`,
                      border: `1px solid ${isActive ? rm.color : rm.color + '33'}`,
                      borderRadius: 18, padding: '20px', cursor: 'pointer',
                      position: 'relative', overflow: 'hidden',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    onClick={() => {
                      if (!isJoined) { joinRoadmap(rm.id); switchRoadmap(rm.id); }
                      else { switchRoadmap(rm.id); }
                    }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: 14,
                        background: rm.color + '1A',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 24, flexShrink: 0
                      }}>{rm.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{rm.label}</span>
                          {isActive && <span style={{
                            fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
                            background: rm.color, color: '#0A0A0F', textTransform: 'uppercase', letterSpacing: '0.05em'
                          }}>Active</span>}
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.4, marginBottom: 10 }}>{rm.description}</div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                          {rm.tags.map(tag => (
                            <span key={tag} style={{
                              fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 6,
                              background: rm.color + '15', color: rm.color, letterSpacing: '0.03em'
                            }}>{tag}</span>
                          ))}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div className="pbar" style={{ flex: 1, marginTop: 0, height: 5 }}>
                            <div className="pfill" style={{ width: `${rmPct}%`, background: rm.color }} />
                          </div>
                          <span style={{ fontSize: 11, color: rm.color, fontWeight: 600, flexShrink: 0 }}>{rmPct}%</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                          <span style={{ fontSize: 11, color: 'var(--sub)' }}>{rm.totalDays} days · {rm.difficulty}</span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: isJoined ? rm.color : 'var(--sub)' }}>
                            {isJoined ? (isActive ? 'Currently Active' : 'Switch →') : 'Join →'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )

        /* ═══ CALENDAR ═══ */
        : tab === "calendar" ? (
          <motion.div className="page" key="calendar" {...fadeUp}>
            <div className="cal-header">
              <div className="cal-title-row">
                <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px" }}>Schedule</h2>
                <div style={{ fontSize: 13, color: "var(--sub)", background: "var(--card)", padding: "4px 10px", borderRadius: 12 }}>{wkDone}/{wkAll.length} this week</div>
              </div>

              {/* Week selector - always visible */}
              <div className="week-scroll" style={{ marginTop: 16 }}>
                {Array.from({ length: maxWeeks }, (_, i) => {
                  const w = i + 1, sel = w === week;
                  return <button key={w} className={`week-pill interactable${sel ? " active" : ""}`} onClick={() => { haptic(); setWeek(w); }}>{sel ? `W${w} ★` : `W${w}`}</button>;
                })}
              </div>

              {/* Modern Day Selector */}
              <div className="modern-day-scroll" style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginTop: 20, scrollbarWidth: "none", msOverflowStyle: "none" }}>
                {DAYS.map((d, i) => {
                  const pillDate = new Date(startDate);
                  pillDate.setDate(pillDate.getDate() + (week - 1) * 7 + i);
                  const dayOfWeek = pillDate.toLocaleDateString('en-US', { weekday: 'short' });
                  const dateNum = pillDate.getDate();
                  const isSel = i === selDay;
                  const isToday = i === clampedToday && week === currentWeekIdx;
                  return (
                    <button key={d} onClick={() => { haptic(); setSelDay(i); }}
                      className="interactable"
                      style={{
                        flex: "0 0 auto",
                        minWidth: 64,
                        padding: "12px 4px",
                        borderRadius: 16,
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                        background: isSel ? "var(--accent)" : "var(--card)",
                        color: isSel ? "#fff" : "var(--text)",
                        border: `1px solid ${isSel ? "var(--accent)" : isToday ? "var(--accent)" : "var(--border)"}`,
                        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        boxShadow: isSel ? "0 8px 16px -4px rgba(99, 102, 241, 0.4)" : "none"
                      }}>
                      <span style={{ fontSize: 11, textTransform: "uppercase", fontWeight: 700, color: isSel ? "rgba(255,255,255,0.9)" : "var(--sub)", letterSpacing: "0.5px" }}>
                        {d.includes('Review') ? 'REST' : dayOfWeek}
                      </span>
                      <span style={{ fontSize: 20, fontWeight: 800 }}>{dateNum}</span>
                      {isToday && !isSel && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent)", marginTop: 2, position: "absolute", bottom: 6 }} />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Single day of current week */}
            {DAYS.map((dayName, dayIdx) => {
              if (dayIdx !== selDay) return null;
              const dayTasks = (activePlan[week]?.[dayIdx] || []).filter(t => assignedTracks.includes(t.track));
              const dayDone = dayTasks.filter(t => done[t.id]).length;
              return (
                <motion.div key={dayName} initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }} transition={{ delay: 0.05 }} style={{ marginBottom: 16 }}>
                  <div className="timeline">
                    <div className="timeline-line" />
                    <div className="timeline-header">
                      <div className="timeline-dot active" />
                      <span className="timeline-day">{dayName}</span>
                      <div className="timeline-date">{(() => { 
                        const d = new Date(startDate); 
                        d.setDate(d.getDate() + (week - 1) * 7 + dayIdx);
                        return `${d.getDate()} ${MONTHS[d.getMonth()].substring(0,3)}`;
                      })()}</div>
                      <span style={{ fontSize: 12, color: dayDone === dayTasks.length && dayTasks.length > 0 ? "var(--green)" : "var(--sub)", marginLeft: "auto", fontWeight: 600 }}>{dayDone}/{dayTasks.length}{dayDone === dayTasks.length && dayTasks.length > 0 ? " ✓" : ""}</span>
                    </div>
                    {dayTasks.length === 0 ? (
                      <div style={{ padding: "32px 20px", textAlign: "center", color: "var(--sub)", fontSize: 14, background: "var(--card)", borderRadius: 12, border: "1px dashed var(--border)", marginTop: 12 }}>
                        No tasks scheduled for this day. Enjoy your rest! ☕
                      </div>
                    ) : dayTasks.map((task, idx) => {
                      const tr = (activeTracks[task.track] || TRACKS[task.track] || TRACKS[0]), isDone = !!done[task.id];
                      return (
                        <div key={task.id}>
                          <div className={`cal-task-card interactable${isDone ? " done" : ""}`}
                            style={{ "--track-color": tr.color }} onClick={() => openDetail(task)}>
                            <div className="cal-task-time" style={{ color: tr.color }}>{tr.sublabel}</div>
                            <div className="cal-task-title" style={{ textDecoration: isDone ? "line-through" : "none" }}>{task.topic}</div>
                            <div className="cal-task-sub">{task.sub}</div>
                            <div className="cal-task-bottom">
                              <span className="chip" style={{ "--chip-color": tr.color, "--chip-bg": tr.bg }}>{tr.label}</span>
                              <button className="check-btn interactable" onClick={e => toggle(task.id, e)}
                                style={{ width:24,height:24,borderRadius:7,border:`2px solid ${tr.color}`,background:isDone?tr.color:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
                                {isDone && <svg width="10" height="8" viewBox="0 0 12 10"><path d="M1 5L4.5 8.5L11 1" stroke="#0A0A0F" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>}
                              </button>
                            </div>
                            <div className="task-accent-line" style={{ background: tr.color }} />
                          </div>
                          {idx < dayTasks.length - 1 && <div className="break-indicator"><div className="break-line"/><span className="break-text">Break</span><div className="break-line"/></div>}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )

        /* ═══ ALERTS ═══ */
        : tab === "notif" ? (
          <motion.div className="page" key="notif" {...fadeUp}>
            <div className="page-header" style={{ paddingBottom: 8 }}>
              <div><h1 style={{ fontSize: 22 }}>Notifications</h1><p className="greeting-sub">Week {week} · {wkDone}/{wkAll.length} done</p></div>
            </div>

            {!notifsEnabled && (
              <motion.div className="notif-enable-card interactable" onClick={enableNotifs} {...scaleIn}>
                <div style={{ fontSize: 32 }}>🔔</div>
                <div><div style={{ fontWeight: 700, marginBottom: 4 }}>Enable Push Notifications</div>
                  <div style={{ fontSize: 13, color: "var(--sub)" }}>Get reminders every 4 hours & before deadlines</div></div>
              </motion.div>
            )}
            {notifsEnabled && (
              <motion.div className="notif-active-badge" {...scaleIn}>✓ Notifications Active · Every 4h + Deadline Alerts</motion.div>
            )}

            <div className="notif-hero">
              <div className="notif-hero-title">Today's Schedule</div>
              {todayTasks.map((task, idx) => {
                const tr = (activeTracks[task.track] || TRACKS[task.track] || TRACKS[0]), isDone = !!done[task.id];
                return (
                  <motion.div key={task.id} className="notif-item" initial={{ opacity:0,x:-8 }} animate={{ opacity:1,x:0 }} transition={{ delay: idx*0.06 }}>
                    <div className="avatar" style={{ background: tr.bg }}>{tr.icon}</div>
                    <div className="notif-info"><div className="notif-title">{task.topic}</div><div className="notif-sub">{tr.sublabel} · {task.hrs}h</div></div>
                    <span className={`status-chip ${isDone ? "done" : "pending"}`}>{isDone ? "Done" : "Pending"}</span>
                  </motion.div>
                );
              })}
            </div>
            <h3 className="section-title">Track Progress · {activeRoadmapDef.label}</h3>
            {activeTracks.filter(tr => assignedTracks.includes(tr.id)).map((tr, idx) => {
              const rmPrefix = activeRoadmap + ':';
              const allTr = activeRaw.filter(r => r[2] === tr.id), doneTr = allTr.filter(r => done[`${rmPrefix}${r[0]}-${r[1]}-${r[2]}`]).length;
              const pct = allTr.length ? Math.round(doneTr/allTr.length*100) : 0;
              return (
                <motion.div key={tr.id} className="notif-item" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} transition={{ delay:(idx+3)*0.06 }}>
                  <div className="avatar" style={{ background: tr.bg }}>{tr.icon}</div>
                  <div className="notif-info" style={{ flex:1 }}>
                    <div className="notif-title">{tr.label}</div>
                    <div className="pbar" style={{ margin:"6px 0 4px" }}><div className="pfill" style={{ width:`${pct}%`,background:tr.color }} /></div>
                    <div className="notif-sub">{doneTr}/{allTr.length} · {pct}%</div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )

        /* ═══ PROFILE ═══ */
        : tab === "profile" ? (
          <motion.div className="page" key="profile" {...fadeUp}>
            <div className="page-header"><h1 style={{ fontSize: 22 }}>Profile</h1></div>
            <motion.div className="profile-hero" {...scaleIn}>
              <div className="profile-avatar" style={{ textTransform: "uppercase" }}>{user[0] || "U"}</div>
              <div className="profile-name">{user}</div>
              <div className="profile-role">FAANG Candidate</div>
            </motion.div>
            <h3 className="section-title">Statistics</h3>
            <div className="stats-grid">
              {[{ label:"Completed",value:totalDone,icon:"✅",color:"var(--green)" },{ label:"Remaining",value:totalAll-totalDone,icon:"📋",color:"var(--yellow)" },{ label:"This Week",value:`${wkDone}/${wkAll.length}`,icon:"📅",color:"var(--purple)" },{ label:"Today",value:`${todayDone}/${todayTasks.length}`,icon:"☀️",color:"var(--accent)" }]
                .map((s,i) => (
                  <motion.div key={s.label} className="stat-card interactable" initial={{ opacity:0,scale:0.9 }} animate={{ opacity:1,scale:1 }} transition={{ delay:i*0.06 }}>
                    <div className="stat-icon">{s.icon}</div><div className="stat-value" style={{ color:s.color }}>{s.value}</div><div className="stat-label">{s.label}</div>
                  </motion.div>
                ))}
            </div>

            <h3 className="section-title">Active Tracks · {activeRoadmapDef.label}</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {activeTracks.map(t => {
                const isActive = assignedTracks.includes(t.id);
                return (
                  <div key={t.id} className="interactable" onClick={() => {
                    const updated = isActive
                      ? assignedTracks.filter(x => x !== t.id)
                      : [...assignedTracks, t.id];
                    setAssignedTracks(updated);
                    try { setDoc(doc(db, "users", user), { selectedTracks: updated }, { merge: true }); } catch(e) {}
                    showToast(isActive ? `${t.label} removed` : `${t.label} added ✓`);
                  }} style={{
                    padding: "10px 16px", borderRadius: 10, fontSize: 13,
                    border: "1px solid " + t.color,
                    background: isActive ? t.color : "transparent",
                    color: isActive ? "#0A0A0F" : t.color,
                    fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
                  }}>
                    {t.icon} {t.label} {isActive ? "✓" : "+"}
                  </div>
                );
              })}
            </div>

            <h3 className="section-title">My Roadmaps</h3>
            <div style={{ display: "flex", flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {ROADMAPS.map(rm => {
                const isJoined = joinedRoadmaps.includes(rm.id);
                return (
                  <div key={rm.id} className="menu-item interactable" onClick={() => {
                    haptic();
                    if (isJoined) { leaveRoadmap(rm.id); }
                    else { joinRoadmap(rm.id); switchRoadmap(rm.id); }
                  }} style={{ border: isJoined ? `1px solid ${rm.color}44` : undefined }}>
                    <div className="menu-left">
                      <span className="menu-icon">{rm.icon}</span>
                      <div>
                        <span style={{ fontWeight: 600 }}>{rm.label}</span>
                        <div style={{ fontSize: 11, color: 'var(--sub)', marginTop: 2 }}>{rm.totalDays} days · {rm.difficulty}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: isJoined ? rm.color : 'var(--sub)' }}>
                      {isJoined ? (activeRoadmap === rm.id ? 'Active ✓' : 'Leave') : 'Join +'}
                    </span>
                  </div>
                );
              })}
            </div>

            <h3 className="section-title">General</h3>
            <div className="menu-item interactable" style={{ cursor: "default", flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
              <div className="menu-left" style={{ width: "100%" }}>
                <span className="menu-icon">📧</span>
                <input type="email" placeholder="Email for alerts..." value={alertEmail} 
                  onChange={e => {
                    setAlertEmail(e.target.value);
                    setDoc(doc(db, "users", user), { email: e.target.value }, { merge: true });
                  }}
                  style={{ background: "transparent", border: "none", color: "var(--text)", width: "100%", outline: "none", fontSize: 15 }} />
              </div>
            </div>
            {[{ label:"All Tasks",icon:"📋",action:()=>switchTab("calendar") },
              { label:"Reset Progress",icon:"🔄",action:()=>{setDone({});persist({});showToast("Progress reset");} },
              { label:"Log Out",icon:"🚪",action:onLogout }
            ]
              .map(item => (
                <div key={item.label} className="menu-item interactable" onClick={() => { haptic(); item.action?.(); }}>
                  <div className="menu-left"><span className="menu-icon">{item.icon}</span><span>{item.label}</span></div><span className="menu-arrow">›</span>
                </div>
              ))}
          </motion.div>
        ) : null}
        </AnimatePresence>
      </div>

      {/* ═══ TASK DETAIL ═══ */}
      <AnimatePresence>
        {detailTask && (() => {
          const tr = (activeTracks[detailTask.track] || TRACKS[detailTask.track] || TRACKS[0]), isDone = !!done[detailTask.id];
          const resources = (activeResources[detailTask.topic] || RESOURCES[detailTask.topic] || []);
          
          const getYoutubeId = (url) => {
            const match = url?.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
            return match ? match[1] : null;
          };

          const renderDescWithLinks = (text) => {
            if (!text) return "";
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            return text.split(urlRegex).map((part, i) => {
              if (part.match(urlRegex)) {
                const ytid = getYoutubeId(part);
                if (ytid) {
                  return (
                    <a key={i} href={part} target="_blank" rel="noopener noreferrer" style={{ display: "block", marginTop: 8, marginBottom: 8, position: "relative", borderRadius: 12, overflow: "hidden", border: `1px solid ${tr.color}` }}>
                      <img src={`https://img.youtube.com/vi/${ytid}/hqdefault.jpg`} style={{ width: "100%", height: 180, objectFit: "cover", opacity: 0.8 }} alt="Video Preview" />
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ background: "rgba(220,38,38,0.9)", width: 48, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                      </div>
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.9))", padding: "10px 14px", color: "#fff", fontSize: 13, fontWeight: "500" }}>Watch Video</div>
                    </a>
                  );
                }
                return <a key={i} href={part} target="_blank" rel="noopener noreferrer" style={{ color: tr.color, textDecoration: "underline" }}>{part}</a>;
              }
              return <span key={i}>{part}</span>;
            });
          };

          return (
            <motion.div className="detail-overlay" key="detail" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
              <motion.div className="detail-page" {...slideRight}>
                <div className="detail-nav">
                  <button className="detail-back interactable" onClick={closeDetail}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  </button>
                  <button className={`detail-done-btn interactable${isDone?" completed":""}`} onClick={e => toggle(detailTask.id, e)}>
                    {isDone ? "✓ Done" : "Mark Done"}
                  </button>
                </div>
                <motion.div className="detail-hero" style={{ "--track-color": tr.color }} {...scaleIn}>
                  <h1 className="detail-title">{detailTask.topic}</h1>
                  <div className="detail-meta-grid">
                    <div className="detail-meta"><span className="meta-label">Track</span><span className="meta-value" style={{ color:tr.color }}>{tr.label}</span></div>
                    <div className="detail-meta"><span className="meta-label">Duration</span><span className="meta-value">{detailTask.hrs}h</span></div>
                    <div className="detail-meta"><span className="meta-label">Difficulty</span><span className="priority-badge" style={{ "--p-color":detailTask.diff==="Hard"?"#F87171":detailTask.diff==="Medium"?"#FCD34D":"#6EE7B7",marginTop:4 }}>{detailTask.diff||"Medium"}</span></div>
                    <div className="detail-meta"><span className="meta-label">Time</span><span className="meta-value">{tr.sublabel}</span></div>
                    <div className="detail-meta"><span className="meta-label">Priority</span><span className="priority-badge" style={{ "--p-color":(detailTask.pri==="High"||detailTask.hrs>=3)?"#F87171":"#FCD34D",marginTop:4 }}>{detailTask.pri||(detailTask.hrs>=3?"High":"Medium")}</span></div>
                  </div>
                </motion.div>
                <div className="detail-section"><h3 className="section-title">Description</h3>
                  <div className="detail-desc-card" style={{ lineHeight: 1.5 }}>
                    {typeof detailTask.desc === 'string' && detailTask.desc.includes('<div') ? (
                       <div dangerouslySetInnerHTML={{ __html: detailTask.desc }} />
                    ) : (
                       renderDescWithLinks(detailTask.desc || `Focus on ${detailTask.sub} in the ${tr.label} track. ${detailTask.hrs}-hour deep work session. 💪`)
                    )}
                  </div>
                </div>
                {detailTask.probs && detailTask.probs.length > 0 && (
                  <div className="detail-section"><h3 className="section-title">💻 Problems to Solve</h3>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                      {detailTask.probs.map((p, i) => {
                        const isUrl = p.startsWith("http");
                        const href = isUrl ? p : `https://leetcode.com/problemset/all/?search=${encodeURIComponent(p.replace('LC ', ''))}`;
                        return (
                          <a key={i} href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                            <span className="chip interactable" style={{ cursor: "pointer", "--chip-color": tr.color, "--chip-bg": tr.bg, fontSize: 13, padding: "6px 14px" }}>
                              {isUrl ? "Link 🔗" : p} ↗
                            </span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
                {resources.length > 0 && (
                  <div className="detail-section"><h3 className="section-title">📎 Resources</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
                      {resources.map((url, i) => {
                        let domain = "";
                        try { domain = new URL(url).hostname.replace("www.",""); } catch(e){}
                        const ytid = getYoutubeId(url);

                        if (ytid) {
                          return (
                            <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="video-preview-card interactable" style={{ position: "relative", display: "block", borderRadius: 12, overflow: "hidden", background: "#000", border: `1px solid ${tr.color}` }}>
                              <img src={`https://img.youtube.com/vi/${ytid}/hqdefault.jpg`} style={{ width: "100%", height: 180, objectFit: "cover", opacity: 0.8 }} alt="Video Preview" />
                              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <div style={{ background: "rgba(220,38,38,0.9)", width: 48, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                                </div>
                              </div>
                              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.9))", padding: "10px 14px", color: "#fff", fontSize: 13, fontWeight: "500" }}>Watch Video</div>
                            </a>
                          );
                        }

                        return (
                          <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="resource-link interactable" style={{ display: "flex", alignItems: "center", padding: "12px 16px", background: "var(--card2)", borderRadius: 10, textDecoration: "none", border: "1px solid var(--border)" }}>
                            <span className="resource-icon" style={{ fontSize: 20, marginRight: 12 }}>{domain.includes("leetcode")?"💡":domain.includes("github")?"🐙":"🔗"}</span>
                            <span className="resource-domain" style={{ color: "var(--text)", flex: 1, fontWeight: 500 }}>{domain || url}</span>
                            <span className="resource-arrow" style={{ color: "var(--sub)" }}>↗</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* ═══ CREATE MODAL ═══ */}
      <AnimatePresence>
        {showCreate && (
          <motion.div className="modal-overlay" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={closeCreate}>
            <motion.div className="modal" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", stiffness: 280, damping: 28 }} onClick={e => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
              <div className="modal-header"><h2>Create New Task</h2><button className="modal-close interactable" onClick={closeCreate}>✕</button></div>
              <div className="form-group"><label>Task Name</label><input className="input-field" placeholder="Enter task name..." value={newTask.name} onChange={e => setNewTask({ ...newTask, name: e.target.value })} /></div>
              <div className="form-group"><label>Description</label><textarea className="input-field" placeholder="Add description..." value={newTask.desc} onChange={e => setNewTask({ ...newTask, desc: e.target.value })} /></div>
              
              <div className="modal-row" style={{ display:'flex', gap:10 }}>
                <div className="form-group" style={{ flex:1 }}><label>Week</label>
                  <select className="input-field" value={newTask.week} onChange={e => setNewTask({ ...newTask, week: parseInt(e.target.value) })}>
                    {[...Array(maxWeeks)].map((_, i) => <option key={i+1} value={i+1}>Week {i+1}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ flex:1 }}><label>Day</label>
                  <select className="input-field" value={newTask.day} onChange={e => setNewTask({ ...newTask, day: parseInt(e.target.value) })}>
                    {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group"><label>Track (Category)</label>
                <div className="priority-row" style={{ flexWrap: 'wrap' }}>{activeTracks.map(tr => (
                  <button key={tr.id} className={`priority-option interactable${newTask.track === tr.id ? " active" : ""}`} style={{ "--p-color": tr.color, flex: '1 1 30%', fontSize:11 }}
                    onClick={() => setNewTask({ ...newTask, track: tr.id })}>{tr.label}</button>
                ))}</div>
              </div>

              <div className="form-group"><label>Priority</label>
                <div className="priority-row">{["Low", "Medium", "High"].map(p => (
                  <button key={p} className={`priority-option interactable${newTask.priority === p ? " active" : ""}`} style={{ "--p-color": { Low: "#6EE7B7", Medium: "#FCD34D", High: "#F87171" }[p] }}
                    onClick={() => setNewTask({ ...newTask, priority: p })}>{p}</button>
                ))}</div>
              </div>

              <button className="create-btn interactable" onClick={() => { 
                if (!newTask.name) return showToast("Please enter a task name!");
                haptic("heavy");
                
                const id = `custom-${Date.now()}`;
                const taskObj = { 
                  id, 
                  week: newTask.week, 
                  day: newTask.day, 
                  track: newTask.track, 
                  topic: newTask.name, 
                  sub: newTask.desc || "Custom Task", 
                  hrs: newTask.priority === "High" ? 4 : 2,
                  pri: newTask.priority,
                  diff: "Medium",
                  desc: newTask.desc || "Manually added task.",
                  probs: [], res: []
                };
                
                const updatedCustom = [...customTasks, taskObj];
                setCustomTasks(updatedCustom);
                // Save to both localStorage and Firebase
                try {
                  const localKey = `vtask_user_${user}`;
                  const existing = JSON.parse(localStorage.getItem(localKey) || '{}');
                  localStorage.setItem(localKey, JSON.stringify({ ...existing, customTasks: updatedCustom }));
                } catch(e) {}
                try { setDoc(doc(db, "users", user), { customTasks: updatedCustom }, { merge: true }); } catch(e) {}

                showToast("Task created & synced! ✨"); 
                closeCreate(); 
                setNewTask({ name: "", desc: "", priority: "Medium", track: 0, week: week, day: selDay });
              }}>Create Task</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <button className="fab interactable" onClick={() => { haptic("heavy"); openCreate(); }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#0A0A0F" strokeWidth="2.5" strokeLinecap="round"/></svg>
      </button>

      <nav className="bottom-nav">
        {navItems.map(item => {
          if (item.id === "spacer") return <div key="spacer" className="nav-spacer" />;
          const active = tab === item.id && !roadmapTrack;
          return (
            <button key={item.id} className={`nav-btn interactable${active ? " active" : ""}`} onClick={() => switchTab(item.id)}>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={item.path} /></svg>
              <span>{item.label}</span>
              {active && (
                <div className="nav-indicator-wrapper">
                  <motion.div className="nav-indicator" layoutId="navIndicator" />
                </div>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
