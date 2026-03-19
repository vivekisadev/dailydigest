import { useState, useEffect, useCallback, useRef, memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DAYS, TRACKS, RAW, RESOURCES, PLAN, MONTHS } from "./data.js";
import "./App.css";

// React Bits Components
import BlurText from "./components/BlurText.jsx";
import ShinyText from "./components/ShinyText.jsx";
import SpotlightCard from "./components/SpotlightCard.jsx";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby8Lb7t-43U5tSj3XF9zP27yK4GWlxnZS47sIiCDXeysxwpEheGgVM7B128NP8Ay0Pq/exec";

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
const TopicCard = memo(({ task, track, isDone, isExpanded, onToggleExpand, onToggleDone }) => {
  const resources = RESOURCES[task.topic] || [];
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
                <span className="topic-detail-label">Priority</span>
                <span className="priority-badge" style={{ "--p-color": task.hrs >= 3 ? "#F87171" : "#FCD34D" }}>
                  {task.hrs >= 3 ? "High" : "Medium"}
                </span>
              </div>
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

/* ═══ MAIN APP ═══ */
export default function App() {
  const now = new Date();
  const rawDay = now.getDay();
  const todayIdx = rawDay === 0 ? 5 : rawDay - 1;
  const clampedToday = Math.min(todayIdx, 5);
  const hr = now.getHours();
  // We'll wrap this greeting in ShinyText
  const greeting = hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening";

  const [week, setWeek] = useState(1);
  const [selDay, setSelDay] = useState(clampedToday);
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
  const [monthOffset, setMonthOffset] = useState(0);
  const [notifsEnabled, setNotifsEnabled] = useState(false);
  const [alertEmail, setAlertEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  const rowMapRef = useRef({});

  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem("vtask_email");
      if (savedEmail) setAlertEmail(savedEmail);
      if (Notification.permission === "granted") setNotifsEnabled(true);
      
      const saved = localStorage.getItem("vtask_dark_v5");
      if (saved) setDone(JSON.parse(saved));
      
      const savedCustom = localStorage.getItem("vtask_custom");
      if (savedCustom) setCustomTasks(JSON.parse(savedCustom));
    } catch (e) {}
    
    if (SCRIPT_URL) {
      setIsLoading(true);
      fetch(SCRIPT_URL)
        .then(res => res.json())
        .then(data => { 
          if (data && data.success && Array.isArray(data.tasks)) {
            const newDone = {};
            const newRowMap = {};
            RAW.forEach(r => {
               const id = `${r[0]}-${r[1]}-${r[2]}`;
               const topic = r[3];
               // Match based on Week + Day OR just Name (topic)
               const match = data.tasks.find(t => Number(t.week) === r[0] && String(t.day).trim() === (DAYS[r[1]] || "") && String(t.name).trim() === topic)
                          || data.tasks.find(t => Number(t.week) === r[0] && String(t.name).trim() === topic)
                          || data.tasks.find(t => String(t.name).trim() === topic);
               
               if (match) {
                 newRowMap[id] = { row: match.row, name: match.name };
                 if (match.status === "Done") newDone[id] = true;
               }
            });
            rowMapRef.current = newRowMap;
            setDone(newDone);
          }
          setIsLoading(false); 
        })
        .catch(err => { console.error("Sync Error:", err); setIsLoading(false); });
    }
  }, []);

  const persist = useCallback(d => {
    try { localStorage.setItem("vtask_dark_v5", JSON.stringify(d)); } catch(e){}
  }, []);

  const todayTasks = useMemo(() => {
    const roadmap = PLAN[week]?.[selDay] || [];
    const custom = customTasks.filter(t => t.week === week && t.day === selDay);
    return [...roadmap, ...custom];
  }, [week, selDay, customTasks]);

  const upcomingTasks = useMemo(() => {
    const all = [];
    const now = new Date();
    const currWeek = week;
    
    // Add roadmap tasks from tomorrow onwards in current week
    for (let d = selDay + 1; d < 6; d++) {
      if (PLAN[currWeek]?.[d]) {
        PLAN[currWeek][d].forEach(t => all.push({ ...t, dayLabel: DAYS[d], week: currWeek }));
      }
    }
    // Add custom tasks
    customTasks.forEach(t => {
      if (t.week > currWeek || (t.week === currWeek && t.day > selDay)) {
        all.push({ ...t, dayLabel: DAYS[t.day], week: t.week });
      }
    });

    return all.sort((a,b) => (a.week*10 + a.day) - (b.week*10 + b.day));
  }, [week, selDay, customTasks]);

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
      
      if (SCRIPT_URL) {
        let pTask = null;
        if (id.startsWith("custom-")) {
          pTask = customTasks.find(t => t.id === id);
        } else {
          const r = RAW.find(t => `${t[0]}-${t[1]}-${t[2]}` === id);
          if (r) pTask = { week: r[0], day: r[1], track: r[2], topic: r[3], sub: r[4], hrs: r[5] };
        }

        if (!pTask) return n;

        const trackDef = TRACKS[pTask.track];
        const priority = pTask.hrs >= 3 ? "High" : "Medium";
        const due = new Date();
        let dueHour = 20;
        if (trackDef && trackDef.sublabel.includes("AM")) dueHour = 8;
        else if (trackDef && trackDef.sublabel.includes("10:00 PM")) dueHour = 22;
        due.setHours(dueHour, 0, 0, 0);
        if (due.getTime() < Date.now() && !isDone) due.setDate(due.getDate() + 1);

        const mapped = rowMapRef.current[id];
        const payload = {
          taskName: mapped ? mapped.name : pTask.topic,
          status: isDone ? "Done" : "Pending",
          priority,
          description: pTask.sub,
          dueDate: due.toISOString(),
          week: pTask.week,
          day: DAYS[pTask.day] || "",
          category: trackDef ? trackDef.label : "DSA",
          subtopic: pTask.sub
        };
        
        if (mapped) {
          payload.row = mapped.row;
        }

        console.info(`Syncing "${payload.taskName}"...`, payload);
        fetch(SCRIPT_URL, {
          method: "POST",
          body: JSON.stringify(payload)
        })
        .then(() => console.info(`"${payload.taskName}" synced successfully.`))
        .catch(err => console.error(`Sync failed for "${pTask.topic}":`, err));
      }
      return n;
    });
  }, [persist, customTasks]);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 2800); };

  const switchTab = (t) => { if(t===tab)return; haptic(); setTab(t); setRoadmapTrack(null); if(scrollRef.current)scrollRef.current.scrollTop=0; };

  const enableNotifs = async () => {
    if (!("Notification" in window)) { showToast("Notifications not supported"); return; }
    const p = await Notification.requestPermission();
    if (p === "granted") {
      setNotifsEnabled(true);
      showToast("🔔 Reminders enabled!");
      new Notification("StudyTrack", { body: "You'll get reminders every 4 hours and before deadlines!" });
    } else showToast("Please allow notifications in settings");
  };

  const todayDone = useMemo(() => todayTasks.filter(t => done[t.id]).length, [todayTasks, done]);
  const wkAll = useMemo(() => DAYS.flatMap((_, d) => PLAN[week]?.[d] || []), [week]);
  const wkDone = useMemo(() => wkAll.filter(t => done[t.id]).length, [wkAll, done]);
  const totalAll = RAW.length;
  const totalDone = useMemo(() => Object.keys(done).filter(k => done[k]).length, [done]);
  const totalPct = totalAll ? totalDone / totalAll : 0;

  // Month navigation
  const viewDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + monthOffset);
    return d;
  }, [monthOffset]);



  const navItems = [
    { id: "home", label: "Home", path: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" },
    { id: "calendar", label: "Calendar", path: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { id: "spacer" },
    { id: "notif", label: "Alerts", path: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
    { id: "profile", label: "Profile", path: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  ];

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
          const tr = TRACKS[roadmapTrack];
          const trackTasks = RAW.filter(r => r[2] === roadmapTrack);
          const trackDone = trackTasks.filter(r => done[`${r[0]}-${r[1]}-${r[2]}`]).length;
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

              {Array.from({ length: 10 }, (_, i) => {
                const w = i + 1;
                const weekTasks = DAYS.map((_, d) => (PLAN[w]?.[d] || []).find(t => t.track === roadmapTrack)).filter(Boolean);
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
                                onToggleDone={() => toggle(task.id)} />
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
                  <ShinyText text={`${greeting} Vivek 👋`} speed={3} />
                </motion.p>
                <div className="greeting-main">
                  <BlurText text="Manage Your Daily Tasks" delay={50} className="greeting-blur" />
                </div>
              </div>
              <button className="week-badge interactable">Week {week}/10</button>
            </div>

            <div className="week-scroll">
              {Array.from({ length: 10 }, (_, i) => {
                const w = i + 1, sel = w === week;
                return (
                  <button key={w} className={`week-pill interactable${sel ? " active" : ""}`}
                    onClick={() => { haptic(); setWeek(w); }}>{w === week ? `W${w} ★` : `W${w}`}</button>
                );
              })}
            </div>

            <div className="track-scroll">
              {TRACKS.map((tr, idx) => {
                const allTr = RAW.filter(r => r[2] === tr.id);
                const doneTr = allTr.filter(r => done[`${r[0]}-${r[1]}-${r[2]}`]).length;
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
              const tr = TRACKS[task.track], isDone = !!done[task.id];
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
                const tr = TRACKS[task.track];
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
              <div className="overall-label">Overall Journey</div>
              <div className="overall-row">
                <div className="overall-pct"><ShinyText text={`${Math.round(totalPct * 100)}%`} speed={4} /></div>
                <div className="overall-info">
                  <div className="pbar" style={{ height: 6 }}><div className="pfill accent-gradient" style={{ width: `${totalPct*100}%` }} /></div>
                  <span className="overall-sub">{totalDone} of {totalAll} tasks · Week {week}/10</span>
                </div>
              </div>
            </div>
          </motion.div>
        )

        /* ═══ CALENDAR ═══ */
        : tab === "calendar" ? (
          <motion.div className="page" key="calendar" {...fadeUp}>
            <div className="cal-header">
              <div className="cal-title-row">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button className="month-arrow interactable" onClick={() => { haptic(); setMonthOffset(o => o-1); }}>‹</button>
                  <h2>{MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}</h2>
                  <button className="month-arrow interactable" onClick={() => { haptic(); setMonthOffset(o => o+1); }}>›</button>
                </div>
                <div className="cal-view-btns">
                  <div className="view-btn">☰</div>
                  <div className="view-btn active">⊞</div>
                </div>
              </div>
              {monthOffset === 0 && <>
                <div className="day-labels">{DAYS.map(d => <span key={d} className="day-label">{d}</span>)}</div>
                <div className="date-pills">
                  {DAYS.map((d, i) => (
                    <button key={d} onClick={() => { haptic(); setSelDay(i); }}
                      className={`date-pill interactable${i === selDay ? " active" : ""}${i === clampedToday && i !== selDay ? " today" : ""}`}>
                      {now.getDate() - clampedToday + i}
                    </button>
                  ))}
                </div>
              </>}
            </div>

            <div className="cal-time-label">{monthOffset === 0 ? "College Hours — 10:00 PM" : `Viewing ${MONTHS[viewDate.getMonth()]} ${viewDate.getFullYear()}`}</div>

            {/* Week selector for non-current months */}
            {monthOffset !== 0 && (
              <div className="week-scroll" style={{ marginBottom: 16 }}>
                {Array.from({ length: 10 }, (_, i) => {
                  const w = i + 1;
                  return <button key={w} className={`week-pill interactable${w === week ? " active" : ""}`} onClick={() => { haptic(); setWeek(w); }}>W{w}</button>;
                })}
              </div>
            )}

            {/* All days of current week */}
            {DAYS.map((dayName, dayIdx) => {
              const dayTasks = PLAN[week]?.[dayIdx] || [];
              if (!dayTasks.length) return null;
              const isSelected = monthOffset === 0 && dayIdx === selDay;
              const dayDone = dayTasks.filter(t => done[t.id]).length;
              return (
                <motion.div key={dayName} initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }} transition={{ delay: dayIdx*0.05 }} style={{ marginBottom: 16 }}>
                  <div className="timeline">
                    <div className="timeline-line" />
                    <div className="timeline-header">
                      <div className={`timeline-dot${isSelected ? " active" : ""}`} />
                      <span className="timeline-day">{dayName}</span>
                      <div className="timeline-date">{now.getDate() - clampedToday + dayIdx}</div>
                      <span style={{ fontSize: 12, color: "var(--sub)", marginLeft: "auto" }}>{dayDone}/{dayTasks.length}</span>
                    </div>
                    {dayTasks.map((task, idx) => {
                      const tr = TRACKS[task.track], isDone = !!done[task.id];
                      return (
                        <div key={task.id}>
                          <div className={`cal-task-card interactable${isDone ? " done" : ""}`}
                            style={{ "--track-color": tr.color }} onClick={() => setDetailTask(task)}>
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
                const tr = TRACKS[task.track], isDone = !!done[task.id];
                return (
                  <motion.div key={task.id} className="notif-item" initial={{ opacity:0,x:-8 }} animate={{ opacity:1,x:0 }} transition={{ delay: idx*0.06 }}>
                    <div className="avatar" style={{ background: tr.bg }}>{tr.icon}</div>
                    <div className="notif-info"><div className="notif-title">{task.topic}</div><div className="notif-sub">{tr.sublabel} · {task.hrs}h</div></div>
                    <span className={`status-chip ${isDone ? "done" : "pending"}`}>{isDone ? "Done" : "Pending"}</span>
                  </motion.div>
                );
              })}
            </div>
            <h3 className="section-title">Track Progress</h3>
            {TRACKS.map((tr, idx) => {
              const allTr = RAW.filter(r => r[2] === tr.id), doneTr = allTr.filter(r => done[`${r[0]}-${r[1]}-${r[2]}`]).length;
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
              <div className="profile-avatar">V</div>
              <div className="profile-name">Vivek</div>
              <div className="profile-role">Full Stack Developer in Training</div>
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
            <h3 className="section-title">General</h3>
            <div className="menu-item interactable" style={{ cursor: "default", flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
              <div className="menu-left" style={{ width: "100%" }}>
                <span className="menu-icon">📧</span>
                <input type="email" placeholder="Email for alerts..." value={alertEmail} 
                  onChange={e => {
                    setAlertEmail(e.target.value);
                    localStorage.setItem("vtask_email", e.target.value);
                  }}
                  style={{ background: "transparent", border: "none", color: "var(--text)", width: "100%", outline: "none", fontSize: 15 }} />
              </div>
            </div>
            {[{ label:"All Tasks",icon:"📋",action:()=>switchTab("calendar") },{ label:"Reset Progress",icon:"🔄",action:()=>{setDone({});persist({});showToast("Progress reset");} }]
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
          const tr = TRACKS[detailTask.track], isDone = !!done[detailTask.id];
          const resources = RESOURCES[detailTask.topic] || [];
          return (
            <motion.div className="detail-overlay" key="detail" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
              <motion.div className="detail-page" {...slideRight}>
                <div className="detail-nav">
                  <button className="detail-back interactable" onClick={() => setDetailTask(null)}>
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
                    <div className="detail-meta"><span className="meta-label">Time</span><span className="meta-value">{tr.sublabel}</span></div>
                    <div className="detail-meta"><span className="meta-label">Priority</span><span className="priority-badge" style={{ "--p-color":detailTask.hrs>=3?"#F87171":"#FCD34D",marginTop:4 }}>{detailTask.hrs>=3?"High":"Medium"}</span></div>
                  </div>
                </motion.div>
                <div className="detail-section"><h3 className="section-title">Description</h3>
                  <div className="detail-desc-card">Focus on <strong>{detailTask.sub}</strong> in the {tr.label} track. {detailTask.hrs}-hour deep work session. 💪</div>
                </div>
                {resources.length > 0 && (
                  <div className="detail-section"><h3 className="section-title">📎 Resources</h3>
                    {resources.map((url, i) => {
                      const domain = new URL(url).hostname.replace("www.","");
                      return <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="resource-link interactable">
                        <span className="resource-icon">{domain.includes("youtube")?"🎬":domain.includes("leetcode")?"💡":domain.includes("github")?"🐙":"🔗"}</span>
                        <span className="resource-domain">{domain}</span><span className="resource-arrow">↗</span>
                      </a>;
                    })}
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
          <motion.div className="modal-overlay" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={() => setShowCreate(false)}>
            <motion.div className="modal" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", stiffness: 280, damping: 28 }} onClick={e => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
              <div className="modal-header"><h2>Create New Task</h2><button className="modal-close interactable" onClick={() => setShowCreate(false)}>✕</button></div>
              <div className="form-group"><label>Task Name</label><input className="input-field" placeholder="Enter task name..." value={newTask.name} onChange={e => setNewTask({ ...newTask, name: e.target.value })} /></div>
              <div className="form-group"><label>Description</label><textarea className="input-field" placeholder="Add description..." value={newTask.desc} onChange={e => setNewTask({ ...newTask, desc: e.target.value })} /></div>
              
              <div className="modal-row" style={{ display:'flex', gap:10 }}>
                <div className="form-group" style={{ flex:1 }}><label>Week</label>
                  <select className="input-field" value={newTask.week} onChange={e => setNewTask({ ...newTask, week: parseInt(e.target.value) })}>
                    {[...Array(10)].map((_, i) => <option key={i+1} value={i+1}>Week {i+1}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ flex:1 }}><label>Day</label>
                  <select className="input-field" value={newTask.day} onChange={e => setNewTask({ ...newTask, day: parseInt(e.target.value) })}>
                    {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group"><label>Track (Category)</label>
                <div className="priority-row" style={{ flexWrap: 'wrap' }}>{TRACKS.map(tr => (
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
                  hrs: newTask.priority === "High" ? 4 : 2 
                };
                
                const updatedCustom = [...customTasks, taskObj];
                setCustomTasks(updatedCustom);
                localStorage.setItem("vtask_custom", JSON.stringify(updatedCustom));
                
                // Sync to Google Sheet
                if (SCRIPT_URL) {
                  const due = new Date();
                  const trackDef = TRACKS[newTask.track];
                  let dueHour = 20;
                  if (trackDef && trackDef.sublabel.includes("AM")) dueHour = 8;
                  else if (trackDef && trackDef.sublabel.includes("10:00 PM")) dueHour = 22;
                  due.setHours(dueHour, 0, 0, 0);

                  const payload = {
                    taskName: newTask.name,
                    status: "Pending",
                    priority: newTask.priority,
                    description: newTask.desc || "Manual Add",
                    dueDate: due.toISOString(),
                    week: newTask.week,
                    day: DAYS[newTask.day] || "",
                    category: trackDef ? trackDef.label : "DSA",
                    subtopic: newTask.desc || ""
                  };
                  fetch(SCRIPT_URL, { method: "POST", body: JSON.stringify(payload) })
                    .then(() => console.info("Custom task synced to sheet."))
                    .catch(console.error);
                }

                showToast("Task created & synced! ✨"); 
                setShowCreate(false); 
                setNewTask({ name: "", desc: "", priority: "Medium", track: 0, week: 1, day: 0 });
              }}>Create Task</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <button className="fab interactable" onClick={() => { haptic("heavy"); setShowCreate(true); }}>
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
