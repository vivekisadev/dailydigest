import { useState, useEffect, useCallback, useRef, memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { DAYS, TRACKS, RAW, RESOURCES, PLAN, ROADMAPS, PLANS, ALL_TRACKS, ALL_RAW, ALL_RESOURCES } from "./data.js";
import "./App.css";
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

import { Zap, Puzzle, Monitor, Building, Rocket, Brain, Crown, Settings, User, Map, ClipboardList, Laptop, BarChart3, CalendarDays, Trophy, CheckCircle, Sun, Folder, Video, Lightbulb, GitBranch, Link, Mail, RefreshCw, LogOut, Lock, Eye, EyeOff } from 'lucide-react';

const getLucideIcon = (emoji) => {
  switch (emoji) {
    case '⚡': return <Zap size={20} />;
    case '🔗': return <Link size={20} />;
    case '🧩': return <Puzzle size={20} />;
    case '🖥️': return <Monitor size={20} />;
    case '🏗️': return <Building size={20} />;
    case '🚀': return <Rocket size={20} />;
    case '🧠': return <Brain size={20} />;
    case '👑': return <Crown size={20} />;
    case '⚙️': return <Settings size={20} />;
    case '🧑‍💻': return <User size={20} />;
    case '📚': return '📚';
    case '🎬': return <Video size={16} />;
    case '💡': return <Lightbulb size={16} />;
    case '🐙': return <GitBranch size={16} />;
    case '🗺️': return <Map size={24} />;
    case '📋': return <ClipboardList size={24} />;
    case '💻': return <Laptop size={24} />;
    case '📊': return <BarChart3 size={24} />;
    case '📅': return <CalendarDays size={24} />;
    case '🏆': return <Trophy size={24} />;
    case '✅': return <CheckCircle size={18} />;
    case '📧': return <Mail size={20} />;
    case '🔄': return <RefreshCw size={20} />;
    case '🚪': return <LogOut size={20} />;
    case '☀️': return <Sun size={20} />;
    case '📁': return <Folder size={18} />;
    default: return emoji;
  }
};

// React Bits Components
import BlurText from "./components/BlurText.jsx";
import ShinyText from "./components/ShinyText.jsx";
import SpotlightCard from "./components/SpotlightCard.jsx";
import GradientButtonGroupBottom from "./components/GradientButtonGroupBottom.jsx";
import RoadmapInteractiveTree from "./components/RoadmapInteractiveTree.jsx";
import Heatmap from "./components/Heatmap.jsx";
import TaskDetailCenter from "./components/TaskDetailCenter.jsx";
import GanttCalendar from "./components/GanttCalendar.jsx";
import SidebarLeft from "./components/SidebarLeft.jsx";
import SidebarRight from "./components/SidebarRight.jsx";
import TopHeader from "./components/TopHeader.jsx";
import ProfileModal from "./components/ProfileModal.jsx";
import TaskModal from "./components/TaskModal.jsx";
import MeetingModal from "./components/MeetingModal.jsx";
import OnboardingModal from "./components/OnboardingModal.jsx";
import LoginScreen from "./components/LoginScreen.jsx";

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

/* ═══ HELPERS ═══ */
function haptic(s="light"){try{navigator.vibrate?.(s==="heavy"?30:s==="medium"?15:8)}catch(e){}}

function playTing() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {}
}


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
        playTing();
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
        playTing();
      }, delay);
    }
  });
}

/* ═══ PREMIUM VARIANTS ═══ */
const spring = { type: "spring", stiffness: 300, damping: 25 };
const fadeUp = { 
  initial: { opacity: 0, filter: "blur(24px) brightness(0.5)", scale: 0.98 }, 
  animate: { opacity: 1, filter: "blur(0px) brightness(1)", scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }, 
  exit: { opacity: 0, filter: "blur(24px) brightness(0.5)", scale: 0.98, transition: { duration: 0.3, ease: [0.7, 0, 0.84, 0] } }
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
      whileHover={{ scale: 1.015, y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}
      whileTap={{ scale: 0.98 }}
      style={{ "--track-color": track.color, borderColor: isExpanded ? track.color + "44" : "var(--border)" }}>
      <div className="roadmap-topic-row" onClick={onToggleExpand}>
        <div className="roadmap-topic-left">
          <button className="check-btn interactable" 
            onClick={(e) => { 
              e.stopPropagation(); 
              if (resources.length === 0) onToggleDone(); 
              else {
                // If it has resources, we could expand or alert. Let's just expand for now.
                if (!isExpanded) onToggleExpand(e);
              }
            }}
            style={{ 
              width: 22, height: 22, borderRadius: 6, 
              border: `2px solid ${resources.length > 0 && !isDone ? 'var(--border)' : track.color}`,
              background: isDone ? track.color : "transparent", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center", 
              cursor: resources.length > 0 && !isDone ? "not-allowed" : "pointer", 
              transition: "all .2s",
              opacity: resources.length > 0 && !isDone ? 0.5 : 1
            }}>
            {isDone && <svg width="10" height="8" viewBox="0 0 12 10"><path d="M1 5L4.5 8.5L11 1" stroke="#0A0A0F" strokeWidth="2.2" fill="none" strokeLinecap="round"/></svg>}
            {(resources.length > 0 && !isDone) && <span style={{fontSize: 10, color: 'var(--text-dim)'}}>↳</span>}
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
                <span className="priority-badge" style={{ "--p-color": task.diff === "Hard" ? "var(--red)" : task.diff === "Medium" ? "var(--yellow)" : "var(--green)" }}>
                  {task.diff || "Medium"}
                </span>
              </div>
              <div className="topic-detail-row">
                <span className="topic-detail-label">Priority</span>
                <span className="priority-badge" style={{ "--p-color": task.pri === "High" || task.hrs >= 3 ? "var(--red)" : "var(--yellow)" }}>
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
                        <span className="resource-icon">{getLucideIcon(domain.includes("youtube") ? "🎬" : domain.includes("leetcode") ? "💡" : domain.includes("github") ? "🐙" : "🔗")}</span>
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

/* ═══ DAILY SCHEDULE VIEW ═══ */
const DailyScheduleView = ({ dateStr, onClose, tasks, done, toggle, TRACKS, activeTracks }) => {
  const displayTasks = tasks || [];
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        background: 'var(--bg)', 
        padding: '24px 32px',
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h2 style={{ fontSize: 28, margin: 0 }}>Dashboard • {new Date(dateStr).toLocaleDateString()}</h2>
            <div style={{ color: 'var(--sub)', fontSize: 14, marginTop: 4 }}>Check out latest updates for this date</div>
          </div>
          <button className="dash-btn interactable" onClick={onClose} style={{ background: 'var(--glass)', border: 'none' }}>✕ Close</button>
        </div>

        <div style={{ display: 'flex', gap: 16, marginBottom: 32, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none', flexShrink: 0 }}>
          {/* Card 1: Overall Progress */}
          <div style={{ minWidth: 260, flex: 1, background: 'var(--accent)', borderRadius: 20, padding: '24px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Overall Progress</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
                <span style={{ fontSize: 13, opacity: 0.9 }}>Progress</span>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{displayTasks.length > 0 ? Math.round(displayTasks.filter(t => done[t.id]).length / displayTasks.length * 100) : 0}%</span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.3)', borderRadius: 2, overflow: 'hidden', marginBottom: 16 }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${displayTasks.length > 0 ? Math.round(displayTasks.filter(t => done[t.id]).length / displayTasks.length * 100) : 0}%` }} transition={{ duration: 1 }} style={{ height: '100%', background: '#fff', borderRadius: 2 }} />
              </div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>{new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
            </div>
          </div>

          {/* Card 2: Scheduled Tasks */}
          <div style={{ minWidth: 260, flex: 1, background: '#EF4444', borderRadius: 20, padding: '24px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Scheduled Tasks</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
                <span style={{ fontSize: 13, opacity: 0.9 }}>Tasks</span>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{displayTasks.length}</span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.3)', borderRadius: 2, overflow: 'hidden', marginBottom: 16 }}>
                <div style={{ height: '100%', background: '#fff', borderRadius: 2, width: '100%' }} />
              </div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>{displayTasks.filter(t => done[t.id]).length} completed</div>
            </div>
          </div>

          {/* Card 3: Study Hours */}
          <div style={{ minWidth: 260, flex: 1, background: '#F59E0B', borderRadius: 20, padding: '24px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Study Hours</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
                <span style={{ fontSize: 13, opacity: 0.9 }}>Total</span>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{displayTasks.reduce((acc, t) => acc + (t.duration || 1), 0)}h</span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.3)', borderRadius: 2, overflow: 'hidden', marginBottom: 16 }}>
                <div style={{ height: '100%', background: '#fff', borderRadius: 2, width: '100%' }} />
              </div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Time allocated for today</div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderRadius: 8, background: 'var(--card)', border: '1px solid var(--border-light)' }}>
            <div style={{ color: 'var(--sub)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5v14"/></svg>
            </div>
            <input type="text" placeholder="Type to add a new task..." style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text)', fontSize: 15, outline: 'none' }} />
            <button style={{ background: 'var(--card2)', border: 'none', color: 'var(--text)', padding: '6px 12px', borderRadius: 6, fontSize: 13, fontWeight: 500 }}>Set date</button>
          </div>

          {displayTasks.length === 0 && (
            <div style={{textAlign:'center', color:'var(--sub)', padding: '24px 0'}}>No tasks scheduled for this date.</div>
          )}

          {displayTasks.map((task, idx) => {
            const tr = (activeTracks[task.track] || TRACKS[task.track] || TRACKS[0]);
            const isDone = !!done[task.id];
            return (
              <motion.div 
                key={task.id} 
                className="task-card-v2"
                style={{ 
                  opacity: isDone ? 0.6 : 1, 
                  margin: 0, 
                  padding: '16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 16,
                  borderRadius: 16,
                  border: '1px solid transparent',
                  background: 'var(--card)',
                  cursor: 'pointer'
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isDone ? 0.6 : 1, y: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.3 }}
              >
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: isDone ? 'var(--glass)' : `${tr.color}22`, color: isDone ? 'var(--sub)' : tr.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {isDone ? <polyline points="20 6 9 17 4 12"></polyline> : <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>}
                  </svg>
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ textDecoration: isDone ? 'line-through' : 'none', fontWeight: 600, fontSize: 16, color: isDone ? 'var(--sub)' : 'var(--text)', marginBottom: 4 }}>
                    {task.topic}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--sub)' }}>
                    {tr.label} • {task.duration || 1}h
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button 
                    className="check-btn interactable"
                    onClick={(e) => { e.stopPropagation(); toggle(task.id); }}
                    style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: isDone ? 'var(--accent)' : 'var(--card2)',
                      border: isDone ? 'none' : '2px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: isDone ? '#fff' : 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
    </motion.div>
  );
};

/* ═══ INTERACTIVE FEATURE CARD (GSAP) ═══ */
const FeatureHoverCard = ({ icon, title, desc, delay, velocityRef }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (window.InertiaPlugin) {
      gsap.registerPlugin(window.InertiaPlugin);
    }
    // Initial entrance animation
    gsap.fromTo(cardRef.current, 
      { opacity: 0, scale: 0.8 }, 
      { opacity: 1, scale: 1, delay: delay, duration: 0.8, ease: "elastic.out(1, 0.7)" }
    );
  }, [delay]);

  const handleMouseEnter = () => {
    if (!cardRef.current) return;
    
    const vx = velocityRef.current.x * 30; // Amplifier
    const vy = velocityRef.current.y * 30;
    
    // Kill existing animations on this element to prevent conflicts
    gsap.killTweensOf(cardRef.current);

    const tl = gsap.timeline({
      onComplete: () => tl.kill()
    });
    tl.timeScale(1.2);

    // Inertia shift
    if (window.InertiaPlugin) {
      tl.to(cardRef.current, {
        inertia: {
          x: { velocity: vx, end: 0 },
          y: { velocity: vy, end: 0 }
        }
      });
    } else {
      // Fallback if plugin fails to load
      tl.to(cardRef.current, {
        x: vx * 0.1, y: vy * 0.1, duration: 0.2, ease: "power2.out"
      }).to(cardRef.current, {
        x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.5)"
      });
    }

    // Random rotation
    tl.fromTo(cardRef.current, { rotate: 0 }, {
      duration: 0.4,
      rotate: (Math.random() - 0.5) * 30, // -15 to +15
      yoyo: true,
      repeat: 1,
      ease: 'power1.inOut'
    }, '<');
  };

  return (
    <div
      ref={cardRef}
      className="login-feature-card"
      onMouseEnter={handleMouseEnter}
    >
      <div className="login-fc-icon">{getLucideIcon(icon)}</div>
      <div className="login-fc-content">
        <div className="login-fc-title">{title}</div>
        <div className="login-fc-desc">{desc}</div>
      </div>
      <div className="login-fc-glow" />
    </div>
  );
};

/* ═══ LOGIN SCREEN ═══ */


/* ═══ TASK CENTER VIEW ═══ */
const TaskCenterView = ({ detailTask, TRACKS, activeTracks, activeResources, RESOURCES, closeDetail, fadeUp, doneMap, onToggleDone }) => {
  const tr = (activeTracks?.[detailTask.track] || TRACKS?.[detailTask.track] || TRACKS?.[0] || { color: '#888', label: 'General' });
  const resources = (activeResources?.[detailTask.topic] || RESOURCES?.[detailTask.topic] || []);
  const [aiData, setAiData] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem("vtask_gemini_key") || "");
  const [showKeyInput, setShowKeyInput] = useState(false);

  const handleAiAssist = async () => {
    if (!geminiKey) { setShowKeyInput(true); return; }
    setAiLoading(true); setAiData(null);
    try {
      const prompt = `You are an AI study assistant. Generate study material for the topic: "${detailTask.topic}". Return a JSON object EXACTLY in this format: {"notes": "Markdown string explaining the topic", "resources": [{"name": "Resource Name", "link": "https://...", "type": "Video or Article"}], "practiceProblems": [{"name": "Problem Name", "link": "https://...", "difficulty": "E or M or H"}]}`;
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await res.json();
      const text = data.candidates[0].content.parts[0].text;
      const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      setAiData(JSON.parse(jsonStr));
    } catch(e) {
      alert("AI request failed. Check API key.");
    }
    setAiLoading(false);
  };

  const saveKey = (k) => { setGeminiKey(k); localStorage.setItem("vtask_gemini_key", k); setShowKeyInput(false); handleAiAssist(); };

  return (
<motion.div className="page" key="task-center" {...fadeUp} style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
      <div style={{ padding: '0 32px', flex: 1, overflowY: 'auto', paddingBottom: 64 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, marginTop: 20 }}>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>
            # {tr.label} / Week {detailTask[0]} / Day {detailTask[1]}
          </div>
          <button className="interactable" onClick={closeDetail} style={{ background: 'transparent', color: 'var(--sub)', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>Close ✕</button>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 24, marginBottom: 32 }}>
          <h1 style={{ fontSize: 36, fontWeight: 700, margin: 0, color: 'var(--text)' }}>
            {detailTask.topic}
          </h1>
          <button className="interactable" onClick={handleAiAssist} style={{ background: 'var(--card2)', color: 'var(--text)', border: '1px solid var(--border)', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600 }}>
            <span>✨</span> AI Assist
          </button>
        </div>
        
        <div style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 40, maxWidth: 800 }}>
          {detailTask.desc ? (
            <div dangerouslySetInnerHTML={{ __html: detailTask.desc }} />
          ) : (
            'No description provided for this topic.'
          )}
        </div>

        {(() => {
          const learningMaterials = resources ? resources.filter(res => typeof res === 'string' || !res.difficulty) : [];
          const practiceProblems = resources ? resources.filter(res => typeof res !== 'string' && res.difficulty) : [];
          
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {learningMaterials.length > 0 && (
                <div style={{ border: '1px solid var(--border)', borderRadius: 16, padding: 24, background: 'rgba(255,255,255,0.02)', maxWidth: 800 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>Learning Resources</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {learningMaterials.map((res, i) => {
                      const isStr = typeof res === 'string';
                      const rName = isStr ? res : (res.name || res.title || "Resource");
                      const rLink = isStr ? res : (res.link || res.url || '#');
                      const rId = isStr ? `${detailTask.id}:res-${i}` : `${detailTask.id}:${res.id || i}`;
                      const isDone = !!(doneMap && doneMap[rId]);
                      
                      let badge = "Article";
                      let badgeColor = "#FBBF24";
                      if (rName.toLowerCase().includes('official') || rName.toLowerCase().includes('doc')) {
                        badge = "Official";
                        badgeColor = "#60A5FA";
                      } else if (rName.toLowerCase().includes('video') || rName.toLowerCase().includes('youtube')) {
                        badge = "Video";
                        badgeColor = "#F87171";
                      } else if (rName.toLowerCase().includes('feed') || rName.toLowerCase().includes('blog')) {
                        badge = "Feed";
                        badgeColor = "#A78BFA";
                      }

                      return (
                        <div key={i} className="premium-resource-card">
                          <div 
                            className={`premium-check-btn ${isDone ? 'checked' : ''}`}
                            onClick={(e) => { e.stopPropagation(); onToggleDone(rId, e, detailTask, resources); }}
                            style={{
                              border: `2px solid ${isDone ? tr.color : 'rgba(255,255,255,0.15)'}`,
                              background: isDone ? tr.color : "transparent", 
                              color: isDone ? '#0A0A0F' : 'transparent',
                              flexShrink: 0
                            }}
                          >
                            {isDone && <svg width="14" height="12" viewBox="0 0 12 10" style={{position:'relative', zIndex: 10}}><path d="M1 5L4.5 8.5L11 1" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          </div>
                          <a href={rLink} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, textDecoration: 'none', position: 'relative', zIndex: 2 }}>
                            <div className="premium-badge-icon" style={{ background: `${badgeColor}22`, color: badgeColor }}>
                              {badge === 'Video' ? '▶' : badge === 'Official' ? '📚' : badge === 'Feed' ? 'RSS' : '📄'}
                            </div>
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                              <div style={{ fontSize: 16, fontWeight: 600, color: isDone ? 'var(--sub)' : 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 4, textDecoration: isDone ? 'line-through' : 'none', transition: 'color 0.3s' }}>{rName}</div>
                              <div style={{ fontSize: 13, color: badgeColor, fontWeight: 600, display: 'inline-block' }}>{badge}</div>
                            </div>
                            <div className="premium-arrow">↗</div>
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {practiceProblems.length > 0 && (
                <div style={{ border: '1px solid var(--border)', borderRadius: 16, padding: 24, background: 'var(--card)', maxWidth: 800 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>Practice Problems</h3>
                    <div style={{ fontSize: 13, color: 'var(--sub)', fontWeight: 600 }}>{practiceProblems.filter(p => doneMap && doneMap[`${detailTask.id}:${p.id || p.title}`]).length} / {practiceProblems.length} Solved</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {practiceProblems.map((res, i) => {
                      const rId = `${detailTask.id}:${res.id || i}`;
                      const isDone = !!(doneMap && doneMap[rId]);
                      const isEasy = res.difficulty === 'E';
                      const isMed = res.difficulty === 'M';
                      const isHard = res.difficulty === 'H';
                      const badgeColor = isEasy ? '#3FB950' : isMed ? '#D29922' : isHard ? '#F85149' : '#7C8B9B';
                      const badgeText = isEasy ? 'Easy' : isMed ? 'Medium' : isHard ? 'Hard' : 'Theory';
                      
                      return (
                        <div key={i} style={{ 
                          display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', 
                          border: '1px solid var(--border)',
                          borderRadius: 12,
                          background: isDone ? 'var(--glass)' : 'var(--card-solid)',
                          boxShadow: '0 2px 8px var(--glass)',
                          transition: 'background 0.2s, transform 0.2s'
                        }}>
                          <div 
                            className={`premium-check-btn ${isDone ? 'checked' : ''}`}
                            onClick={(e) => { e.stopPropagation(); onToggleDone(rId, e, detailTask, resources); }}
                            style={{
                              width: 20, height: 20, borderRadius: 6,
                              border: `2px solid ${isDone ? '#3FB950' : 'var(--text-secondary)'}`,
                              background: isDone ? '#3FB950' : "transparent", 
                              color: isDone ? '#fff' : 'transparent',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0
                            }}
                          >
                            {isDone && <svg width="12" height="10" viewBox="0 0 12 10"><path d="M1 5L4.5 8.5L11 1" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          </div>
                          <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
                            <a href={res.link || res.url || '#'} target="_blank" rel="noopener noreferrer" style={{ fontSize: 15, fontWeight: 600, color: isDone ? 'var(--sub)' : 'var(--text)', textDecoration: isDone ? 'line-through' : 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
                              {res.title || res.name}
                            </a>
                          </div>
                          <div style={{ color: badgeColor, fontSize: 13, fontWeight: 700, width: 60, textAlign: 'right' }}>
                            {badgeText}
                          </div>
                          <a href={res.link || res.url || '#'} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--sub)', display: 'flex', alignItems: 'center', padding: '6px 8px', borderRadius: 6, background: 'var(--glass)', textDecoration: 'none', transition: 'all 0.2s', fontSize: 13, fontWeight: 600 }}>
                            Solve ↗
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {showKeyInput && (
          <div style={{ marginTop: 24, padding: 16, background: 'var(--card)', borderRadius: 12, border: '1px solid var(--border)' }}>
            <h4 style={{ marginBottom: 12, color: 'var(--text)' }}>Enter Gemini API Key</h4>
            <input type="text" placeholder="AIzaSy..." onBlur={(e) => saveKey(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--glass)', color: '#fff' }} />
            <p style={{ fontSize: 12, color: 'var(--sub)', marginTop: 8 }}>Get one from Google AI Studio. Stored locally.</p>
          </div>
        )}
        {aiLoading && <div style={{ marginTop: 24, padding: 16, textAlign: 'center', color: 'var(--sub)' }}>✨ AI is thinking...</div>}
        {aiData && (
          <div style={{ marginTop: 32, padding: 24, background: 'rgba(167, 139, 250, 0.05)', borderRadius: 16, border: '1px solid rgba(167, 139, 250, 0.2)' }}>
            <h3 style={{ fontSize: 24, fontWeight: 800, color: '#A78BFA', marginBottom: 16 }}>✨ AI Study Notes</h3>
            <div style={{ color: 'var(--text)', lineHeight: 1.6, marginBottom: 24, fontSize: 15 }} dangerouslySetInnerHTML={{ __html: aiData.notes?.replace(/\n/g, '<br/>') || '' }} />
            
            {aiData.resources?.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ color: '#fff', marginBottom: 12, fontSize: 18 }}>Recommended Resources</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {aiData.resources.map((r, i) => (
                    <a key={i} href={r.link} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', padding: 12, background: 'var(--card-solid)', borderRadius: 8, color: '#A78BFA', textDecoration: 'none', border: '1px solid var(--border)' }}>
                      <span style={{ marginRight: 8 }}>{r.type === 'Video' ? '▶' : '📄'}</span> {r.name} <span style={{ marginLeft: 'auto', fontSize: 12 }}>↗</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            {aiData.practiceProblems?.length > 0 && (
              <div>
                <h4 style={{ color: '#fff', marginBottom: 12, fontSize: 18 }}>Practice Problems</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {aiData.practiceProblems.map((p, i) => (
                    <a key={i} href={p.link} target="_blank" rel="noreferrer" style={{ display: 'flex', justifyContent: 'space-between', padding: 12, background: 'var(--card-solid)', borderRadius: 8, color: '#3FB950', textDecoration: 'none', border: '1px solid var(--border)' }}>
                      <span>{p.name} ↗</span>
                      <span style={{ fontWeight: 'bold' }}>[{p.difficulty}]</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const HomeRoadmapSwitcher = ({ joinedRoadmaps, activeRoadmap, ROADMAPS, switchRoadmap, haptic }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft) < scrollWidth - clientWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [joinedRoadmaps]);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 200, behavior: 'smooth' });
      setTimeout(checkScroll, 300);
    }
  };

  if (Object.keys(joinedRoadmaps).length <= 1) return null;

  return (
    <div style={{ position: 'relative', marginBottom: 24, display: 'flex', alignItems: 'center' }}>
      {canScrollLeft && (
        <button onClick={() => scroll(-1)} style={{ position: 'absolute', left: -10, zIndex: 2, background: 'linear-gradient(to right, var(--bg) 60%, transparent)', border: 'none', color: 'var(--text)', cursor: 'pointer', height: '100%', padding: '0 24px 0 10px', display: 'flex', alignItems: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
      )}
      <div ref={scrollRef} onScroll={checkScroll} style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, scrollBehavior: 'smooth', scrollbarWidth: 'none', msOverflowStyle: 'none' }} className="hide-scrollbar">
        {Object.keys(joinedRoadmaps).map(rmId => {
          const rm = ROADMAPS.find(r => r.id === rmId);
          if (!rm) return null;
          const isActive = activeRoadmap === rmId;
          return (
            <motion.button key={rmId}
              className="interactable"
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
              {rm.label}
            </motion.button>
          );
        })}
      </div>
      {canScrollRight && (
        <button onClick={() => scroll(1)} style={{ position: 'absolute', right: -10, zIndex: 2, background: 'linear-gradient(to left, var(--bg) 60%, transparent)', border: 'none', color: 'var(--text)', cursor: 'pointer', height: '100%', padding: '0 10px 0 24px', display: 'flex', alignItems: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      )}
    </div>
  );
};

/* ═══ ROADMAP APP WRAPPER ═══ */
export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for the preloader
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const [user, setUser] = useState(() => {
    try { return localStorage.getItem("vtask_logged_in_user") || null; } catch(e) { return null; }
  });

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        background: 'var(--bg)',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          fontSize: '48px',
          fontWeight: 900,
          background: 'linear-gradient(90deg, #fff, #a78bfa, #3b82f6, #fff)',
          backgroundSize: '300% 100%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'shimmer 2s infinite linear, pulse 2s infinite ease-in-out',
          letterSpacing: '-1px'
        }}>
          GuideMe
        </div>
        <div style={{
          width: '40px',
          height: '4px',
          background: 'var(--glass)',
          borderRadius: '4px',
          overflow: 'hidden',
          position: 'relative'
        }}>
           <div style={{
             position: 'absolute',
             top: 0,
             left: 0,
             height: '100%',
             width: '50%',
             background: 'var(--accent)',
             borderRadius: '4px',
             animation: 'loadingBar 1s infinite ease-in-out alternate'
           }} />
        </div>
      </div>
    );
  }

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
  useEffect(() => {
    // Lenis removed to fix internal scrollable areas (sidebar, app-content)
  }, []);

  const [isDbLoaded, setIsDbLoaded] = useState(false);
  const now = new Date();
  const rawDay = now.getDay();
  const [startDate, setStartDate] = useState(new Date().toISOString());
  const [assignedTracks, setAssignedTracks] = useState([0, 1, 2, 3]); // Loaded from Cloud

  /* ═══ MULTI-ROADMAP STATE ═══ */
  const [activeRoadmap, setActiveRoadmap] = useState("faang-90");
  const [joinedRoadmaps, setJoinedRoadmaps] = useState({ "faang-90": Date.now() });
  const [userProfile, setUserProfile] = useState({ name: user || "User", avatar: "", email: "", theme: "dark", onboardingCompleted: false });
  const [selectedActivityDate, setSelectedActivityDate] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Derived active roadmap data
  const activeRoadmapDef = useMemo(() => ROADMAPS.find(r => r.id === activeRoadmap) || ROADMAPS[0], [activeRoadmap]);
  const activePlan = useMemo(() => PLANS[activeRoadmap] || PLAN, [activeRoadmap]);
  const activeTracks = useMemo(() => ALL_TRACKS[activeRoadmap] || TRACKS, [activeRoadmap]);
  const activeRaw = useMemo(() => ALL_RAW[activeRoadmap] || RAW, [activeRoadmap]);
  const activeResources = useMemo(() => ALL_RESOURCES[activeRoadmap] || RESOURCES, [activeRoadmap]);

  const joinedDate = joinedRoadmaps[activeRoadmap] || Date.now();
  const getDayOffset = Math.floor((now - new Date(joinedDate)) / (1000 * 60 * 60 * 24));
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newTask, setNewTask] = useState({ name: "", desc: "", priority: "Medium", track: 0, week: 1, day: 0 });
  const [customTasks, setCustomTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [homeTab, setHomeTab] = useState("Today");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [liveProjects, setLiveProjects] = useState([]);
  const [roadmapTrack, setRoadmapTrack] = useState(null);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [expandedWeek, setExpandedWeek] = useState(1);
  const [notifsEnabled, setNotifsEnabled] = useState(false);
  const [alertEmail, setAlertEmail] = useState("");
  const [rightWidth, setRightWidth] = useState(350);
  const [taskNavWidth, setTaskNavWidth] = useState(450);
  const scrollRef = useRef(null);
  
  const rightResizing = useRef(false);
  const taskNavResizing = useRef(false);

  const startRightResize = useCallback((e) => {
    rightResizing.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const startTaskNavResize = useCallback((e) => {
    taskNavResizing.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', userProfile.theme || 'dark');
  }, [userProfile.theme]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (rightResizing.current) {
        let newWidth = document.body.clientWidth - e.clientX;
        if (newWidth < 150) newWidth = 0; // Snap to minimize
        else if (newWidth > 600) newWidth = 600;
        else if (newWidth < 250) newWidth = 250;
        setRightWidth(newWidth);
      } else if (taskNavResizing.current) {
        let newWidth = e.clientX - 72; // Left sidebar is 72px when detailTask is open
        if (newWidth < 150) newWidth = 0; // Snap to minimize
        else if (newWidth > 600) newWidth = 600;
        else if (newWidth < 300) newWidth = 300;
        setTaskNavWidth(newWidth);
      }
    };
    const handleMouseUp = () => {
      if (rightResizing.current || taskNavResizing.current) {
        rightResizing.current = false;
        taskNavResizing.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const openDetail = useCallback((task) => { window.history.pushState({ modal: 'detail' }, ''); setDetailTask(task); }, []);
  const closeDetail = useCallback(() => { if (window.history.state?.modal === 'detail') window.history.back(); else setDetailTask(null); }, []);
  const openCreate = useCallback(() => { setIsTaskModalOpen(true); }, []);
  const closeCreate = useCallback(() => { setIsTaskModalOpen(false); }, []);

  // Back button handler for modals
  useEffect(() => {
    const handlePopState = () => {
      setIsTaskModalOpen(false);
      setDetailTask(null);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Auto-scroll to top when section changes
  useEffect(() => {
    const sr = document.querySelector('.sidebar-right');
    if (sr) sr.scrollTop = 0;
    const ac = document.querySelector('.app-content');
    if (ac) ac.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [detailTask, tab, activeRoadmap]);

  // Reset day index when switching active roadmaps
  useEffect(() => {
    setDetailTask(null);
  }, [activeRoadmap, tab]);

  // Auto-collapse sidebar when on roadmap tab
  useEffect(() => {
    if (tab === 'roadmap') {
      setIsSidebarCollapsed(true);
    } else {
      setIsSidebarCollapsed(false);
    }
  }, [tab]);

  // Check if new user needs onboarding
  const [showOnboarding, setShowOnboarding] = useState(false);
  useEffect(() => {
    if (userProfile && userProfile.onboardingCompleted === false) {
      setShowOnboarding(true);
    }
  }, [userProfile]);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      
      // Try localStorage first as baseline
      const localKey = `vtask_user_${user}`;
      const localData = localStorage.getItem(localKey);
      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          if (parsed.progress) setDone(parsed.progress);
          if (parsed.customTasks) setCustomTasks(parsed.customTasks);
          if (parsed.meetings) setMeetings(parsed.meetings);
          if (parsed.liveProjects) setLiveProjects(parsed.liveProjects);
          if (parsed.email) setAlertEmail(parsed.email);
          if (parsed.selectedTracks) setAssignedTracks([...parsed.selectedTracks, 4]);
          if (parsed.userProfile) setUserProfile(parsed.userProfile);
          if (parsed.joinedRoadmaps) {
            let jr = parsed.joinedRoadmaps;
            if (Array.isArray(jr)) {
              const newJr = {};
              jr.forEach(rmId => { newJr[rmId] = Date.now(); });
              jr = newJr;
            }
            setJoinedRoadmaps(jr);
            setActiveRoadmap(parsed.activeRoadmap || Object.keys(jr)[0]);
          }
        } catch (e) { console.warn('Local data parse error', e); }
      }
      
      // Then try Firebase (may fail with permission errors)
      try {
        const docRef = doc(db, "users", user);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          if (data.progress) setDone(data.progress);
          if (data.customTasks) setCustomTasks(data.customTasks);
          if (data.meetings) setMeetings(data.meetings);
          if (data.liveProjects) setLiveProjects(data.liveProjects);
          if (data.email) setAlertEmail(data.email);
          if (data.selectedTracks) setAssignedTracks([...data.selectedTracks, 4]);
          if (data.userProfile) setUserProfile(data.userProfile);
          if (data.joinedRoadmaps) {
            let jr = data.joinedRoadmaps;
            if (Array.isArray(jr)) {
              const newJr = {};
              jr.forEach(rmId => { newJr[rmId] = Date.now(); });
              jr = newJr;
            }
            setJoinedRoadmaps(jr);
            setActiveRoadmap(data.activeRoadmap || Object.keys(jr)[0]);
          }
          // Sync to local as backup
          localStorage.setItem(localKey, JSON.stringify(data));
        } else {
          const defaultData = { progress: {}, customTasks: [], meetings: [], liveProjects: [], joinedRoadmaps: { "faang-90": Date.now() }, activeRoadmap: "faang-90", userProfile: { name: user, avatar: "", email: "", theme: "dark" } };
          try {
            await setDoc(docRef, defaultData, { merge: true });
          } catch (writeErr) {}
          localStorage.setItem(localKey, JSON.stringify(defaultData));
        }
      } catch (err) {}
      
      setIsDbLoaded(true);
    }
    loadData();
    if (Notification.permission === "granted") setNotifsEnabled(true);
  }, [user]);

  const pendingUpdates = useRef({});
  const flushTimeout = useRef(null);

  const flushToDatabase = useCallback(async () => {
    if (Object.keys(pendingUpdates.current).length === 0) return;
    const payload = { ...pendingUpdates.current };
    pendingUpdates.current = {}; // clear pending

    // Generate completedTaskNames on the fly if progress is updated
    if (payload.progress) {
      const d = payload.progress;
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
      payload.completedTaskNames = completedTaskNames;
    }

    try {
      await setDoc(doc(db, "users", user), payload, { merge: true });
    } catch(e) { }
  }, [user, customTasks]);

  const persist = useCallback((data) => {
    try {
      const localKey = `vtask_user_${user}`;
      const existing = JSON.parse(localStorage.getItem(localKey) || '{}');
      localStorage.setItem(localKey, JSON.stringify({ ...existing, ...data }));
    } catch(e) {}
    
    pendingUpdates.current = { ...pendingUpdates.current, ...data };
    if (flushTimeout.current) clearTimeout(flushTimeout.current);
    flushTimeout.current = setTimeout(() => flushToDatabase(), 3000);
  }, [user, flushToDatabase]);

  const handleUpdateCustomTask = useCallback((taskId, updatedData) => {
    setCustomTasks(prev => {
       const updated = prev.map(t => t.id === taskId ? { ...t, ...updatedData } : t);
       persist({ customTasks: updated });
       return updated;
    });
  }, [persist]);

  const handleDeleteCustomTask = useCallback((taskId) => {
    setCustomTasks(prev => {
       const updated = prev.filter(t => t.id !== taskId);
       persist({ customTasks: updated });
       return updated;
    });
  }, [persist]);

  const rmPrefix = activeRoadmap + ':';
  const combinedTasks = useMemo(() => {
    return [
      ...activeRaw.map(t => {
        const tCopy = [...t];
        tCopy.id = `${rmPrefix}${t[0]}-${t[1]}-${t[2]}`;
        return { ...tCopy, id: tCopy.id, 0: t[0], 1: t[1], 2: t[2], 3: t[3], 4: t[4], 5: t[5], 6: t[6], 7: t[7], 8: t[8], 9: t[9], 10: t[10], topic: t[3], sub: t[4], hrs: t[5], desc: t[8], probs: t[9], res: t[10], track: t[2], week: t[0], day: t[1] };
      }),
      ...customTasks.filter(ct => ct.roadmapId === activeRoadmap).map(ct => ({
        ...ct,
        0: ct.week,
        1: ct.day,
        2: ct.track,
        3: ct.topic,
        4: ct.sub,
        hrs: ct.hrs,
        desc: ct.desc,
        res: ct.res,
        probs: ct.probs,
        track: ct.track,
        week: ct.week,
        day: ct.day
      }))
    ];
  }, [activeRaw, customTasks, activeRoadmap, rmPrefix]);

  const actualTodayTasks = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const todayDowObj = today.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
    // map JS day of week to our M,T,W... array index.
    const mappedDow = todayDowObj === 0 ? 6 : todayDowObj - 1;

    const roadmapTasksToday = combinedTasks.filter(t => 
      !t.isCustom && 
      t.week === currentWeekIdx && 
      t.day === currentDayIdx && 
      assignedTracks.includes(t.track)
    );

    const customTasksToday = customTasks.filter(ct => {
      if (ct.rmId !== activeRoadmap) return false;
      if (ct.scheduleType === 'date') {
        return ct.date === todayStr;
      } else if (ct.scheduleType === 'repeat') {
        return ct.repeatDays && ct.repeatDays.includes(mappedDow);
      }
      // fallback for old tasks
      return ct.week === currentWeekIdx && ct.day === currentDayIdx; 
    });

    return [...roadmapTasksToday, ...customTasksToday];
  }, [combinedTasks, customTasks, currentWeekIdx, currentDayIdx, assignedTracks, activeRoadmap]);

  const incompletePastTasks = useMemo(() => {
    return combinedTasks.filter(t => {
      if (done[t.id]) return false;
      
      if (t.isCustom) {
        if (t.rmId !== activeRoadmap) return false;
        if (t.scheduleType === 'date') {
          const todayStr = new Date().toISOString().split('T')[0];
          return t.date < todayStr;
        } else if (t.scheduleType === 'repeat') {
          return false; // Repeating tasks don't pile up as 'past' tasks, they just appear today
        }
        // Fallback for old custom tasks
      }
      
      const tDaysElapsed = (t.week - 1) * 7 + t.day;
      const currentDaysElapsed = (currentWeekIdx - 1) * 7 + currentDayIdx;
      return tDaysElapsed < currentDaysElapsed && assignedTracks.includes(t.track);
    });
  }, [combinedTasks, currentWeekIdx, currentDayIdx, assignedTracks, done, customTasks, activeRoadmap]);

  const upcomingTasks = useMemo(() => {
    return combinedTasks.filter(t => {
      const tDaysElapsed = (t.week - 1) * 7 + t.day;
      const currentDaysElapsed = (currentWeekIdx - 1) * 7 + currentDayIdx;
      return tDaysElapsed > currentDaysElapsed && assignedTracks.includes(t.track) && !done[t.id];
    }).sort((a,b) => (a.week*10 + a.day) - (b.week*10 + b.day)).map(t => ({ ...t, dayLabel: DAYS[t.day] }));
  }, [combinedTasks, currentWeekIdx, currentDayIdx, assignedTracks, done]);

  useEffect(() => {
    if (notifsEnabled) setupNotifications(actualTodayTasks, done);
  }, [notifsEnabled, actualTodayTasks, done]);

  const toggle = useCallback((id, e, parentTask, resources) => {
    if (e) e.stopPropagation();

    if (typeof id === 'string' && id.includes(':')) {
      const rmId = id.split(':')[0];
      const isRoadmapTask = ROADMAPS.some(r => r.id === rmId);
      if (isRoadmapTask && !joinedRoadmaps[rmId]) {
        setToast("You must join this roadmap to track progress!");
        setTimeout(() => setToast(null), 3000);
        return;
      }
    }

    haptic("medium");
    if (!done[id]) playTing();
    setDone(prev => {
      const n = { ...prev };
      const isDone = !n[id];
      if (isDone) n[id] = new Date().toISOString();
      else delete n[id];

      if (parentTask && resources) {
        const allDone = resources.every((res, i) => {
          const isStr = typeof res === 'string';
          const rId = isStr ? `${parentTask.id}:res-${i}` : `${parentTask.id}:${res.id || i}`;
          return !!n[rId];
        });
        if (allDone) {
          n[parentTask.id] = new Date().toISOString();
        } else {
          delete n[parentTask.id];
        }
      }

      persist({ progress: n });
      return n;
    });
  }, [persist, joinedRoadmaps]);

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
        const tTask = actualTodayTasks.find(t => (t.track === targetTrackId || (t.track > targetTrackId)) && !done[t.id]);
        if (tTask) {
          const trackDef = activeTracks[tTask.track] || TRACKS[tTask.track] || TRACKS[0];
          new Notification("Time to focus!", { body: `Ready for ${tTask.topic}? Hop in and crush your ${trackDef.label} task!` });
          localStorage.setItem(lastNotifKey, "true");
        }
      }
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [notifsEnabled, actualTodayTasks, done]);

  const todayDone = useMemo(() => actualTodayTasks.filter(t => done[t.id]).length, [actualTodayTasks, done]);
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
    // Only persist to localStorage and Firebase if joined
    if (joinedRoadmaps[rmId]) {
      try {
        const localKey = `vtask_user_${user}`;
        const existing = JSON.parse(localStorage.getItem(localKey) || '{}');
        localStorage.setItem(localKey, JSON.stringify({ ...existing, activeRoadmap: rmId }));
      } catch(e) {}
      try { setDoc(doc(db, "users", user), { activeRoadmap: rmId }, { merge: true }); } catch(e) {};
    }
  }, [user, joinedRoadmaps]);

  const joinRoadmap = useCallback((rmId) => {
    if (joinedRoadmaps[rmId]) return;
    const updated = { ...joinedRoadmaps, [rmId]: Date.now() };
    setJoinedRoadmaps(updated);
    try {
      const localKey = `vtask_user_${user}`;
      const existing = JSON.parse(localStorage.getItem(localKey) || '{}');
      localStorage.setItem(localKey, JSON.stringify({ ...existing, joinedRoadmaps: updated, activeRoadmap: rmId }));
    } catch(e) {}
    try { setDoc(doc(db, "users", user), { joinedRoadmaps: updated, activeRoadmap: rmId }, { merge: true }); } catch(e) {};
    showToast(`Joined ${ROADMAPS.find(r => r.id === rmId)?.label} ✨`);
  }, [joinedRoadmaps, user]);

  const leaveRoadmap = useCallback((rmId) => {
    if (Object.keys(joinedRoadmaps).length <= 1) { showToast("You must have at least one active roadmap"); return; }
    
    const rmPrefix = rmId + ':';
    const updatedDone = { ...done };
    let hasChanges = false;
    for (const key in updatedDone) {
      if (key.startsWith(rmPrefix)) {
        delete updatedDone[key];
        hasChanges = true;
      }
    }
    if (hasChanges) setDone(updatedDone);

    const updated = { ...joinedRoadmaps };
    delete updated[rmId];
    setJoinedRoadmaps(updated);
    
    let newActive = activeRoadmap;
    if (activeRoadmap === rmId && tab !== 'roadmap') {
      newActive = Object.keys(updated)[0];
      setActiveRoadmap(newActive);
    }

    try {
      const localKey = `vtask_user_${user}`;
      const existing = JSON.parse(localStorage.getItem(localKey) || '{}');
      localStorage.setItem(localKey, JSON.stringify({ ...existing, joinedRoadmaps: updated, activeRoadmap: newActive, ...(hasChanges && { done: updatedDone }) }));
    } catch(e) {}
    try { setDoc(doc(db, "users", user), { joinedRoadmaps: updated, activeRoadmap: newActive, ...(hasChanges && { done: updatedDone }) }, { merge: true }); } catch(e) {};
    showToast(`Left ${ROADMAPS.find(r => r.id === rmId)?.label}`);
  }, [joinedRoadmaps, activeRoadmap, user, tab, done]);



  const toggleNotifs = async () => {
    if (notifsEnabled) {
      setNotifsEnabled(false);
      showToast("🔕 Reminders disabled");
    } else {
      if (!("Notification" in window)) { showToast("Notifications not supported"); return; }
      const p = await Notification.requestPermission();
      if (p === "granted") {
        setNotifsEnabled(true);
        showToast("🔔 Reminders enabled!");
        new Notification("StudyTrack", { body: "You'll get reminders based on task timings!" });
      } else showToast("Please allow notifications in settings");
    }
  };

  const navItems = [
    { id: "home", label: "Home", path: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" },
    { id: "calendar", label: "Calendar", path: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { id: "spacer" },
    { id: "notif_toggle", label: notifsEnabled ? "Alerts On" : "Alerts Off", onClick: toggleNotifs, path: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
    { id: "profile", label: "Profile", path: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  ];



  if (!isDbLoaded) {
    return <div className="app-shell" style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "var(--sub)", fontSize: 13 }}>Syncing with Firebase Cloud...</div>;
  }

  const showRightSidebar = tab === "home" || detailTask !== null;
  const isOverlayMode = tab === 'roadmap' && detailTask !== null;
  const computedRightWidth = isOverlayMode ? 0 : rightWidth;

  return (
    <motion.div 
      className="dashboard-layout" 
      ref={scrollRef} 
      animate={{ '--right-sidebar-width': showRightSidebar ? `${computedRightWidth}px` : '0px', '--left-sidebar-width': (isSidebarCollapsed || detailTask) ? '72px' : '250px' }}
      transition={{ '--left-sidebar-width': { duration: 0.3, ease: [0.16, 1, 0.3, 1] }, '--right-sidebar-width': { type: "spring", stiffness: 300, damping: 30 } }}
    >
      <AnimatePresence>{toast && (
        <motion.div className="toast-container" initial={{ opacity:0,y:14,scale:0.9 }} animate={{ opacity:1,y:0,scale:1 }} exit={{ opacity:0,y:14 }}>
          <div className="toast">{toast}</div>
        </motion.div>
      )}</AnimatePresence>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsSidebarOpen(false)}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 9998 }}
          />
        )}
      </AnimatePresence>

      <SidebarLeft 
        tab={tab} 
        setTab={(newTab) => { setTab(newTab); setIsSidebarOpen(false); }} 
        roadmapTrack={roadmapTrack} 
        setRoadmapTrack={setRoadmapTrack} 
        joinedRoadmaps={joinedRoadmaps}
        switchRoadmap={(id) => { switchRoadmap(id); setIsSidebarOpen(false); }}
        activeRoadmap={activeRoadmap}
        isOpen={isSidebarOpen}
        isHidden={false} 
        isCollapsed={isSidebarCollapsed || !!detailTask}
        userProfile={userProfile} 
        openProfileModal={() => setIsProfileModalOpen(true)}
        onLogout={onLogout}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', gridColumn: 2, gridRow: '1 / -1' }}>
        <TopHeader 
          tab={tab} 
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
          userProfile={userProfile}
          toggleTheme={() => {
            const nextTheme = userProfile.theme === 'light' ? 'dark' : 'light';
            const up = { ...userProfile, theme: nextTheme };
            setUserProfile(up);
            persist({ userProfile: up });
          }}
          openProfileModal={() => setIsProfileModalOpen(true)}
        />

      <div className="app-content">
        <AnimatePresence>
        {/* ═══ ROADMAP VIEW ═══ */}
        {tab === "roadmap" ? (() => {
          const rmPrefix = activeRoadmap + ':';
          const totalTasks = activeRaw.length;
          const totalDone = activeRaw.filter(r => done[`${rmPrefix}${r[0]}-${r[1]}-${r[2]}`]).length;
          const totalPct = totalTasks ? Math.round(totalDone / totalTasks * 100) : 0;
          return (
            <motion.div className="page" key="roadmap" {...fadeUp} style={{ padding: '24px 32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <button 
                    className="interactable"
                    onClick={() => switchTab('discover')}
                    style={{ background: 'var(--glass)', color: 'var(--text)', border: '1px solid var(--border)', padding: '8px 12px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <span style={{ fontSize: 16 }}>←</span> Back
                  </button>
                  <h2 style={{ fontSize: 24, fontWeight: 800 }}>{activeRoadmapDef.label} Roadmap</h2>
                </div>
                <button 
                  className="interactable" 
                  onClick={openCreate}
                  style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                >
                  + Add Task
                </button>
              </div>


              <div style={{ display: 'flex', gap: 24, marginTop: 24 }}>
                {/* ═══ NEW IN-WINDOW ROADMAP SUMMARY ═══ */}
                <div style={{ width: 320, flexShrink: 0, background: 'var(--card)', borderRadius: 16, padding: 20, border: '1px solid var(--border)', alignSelf: 'flex-start' }}>
                  <div style={{ fontSize: 13, color: 'var(--sub)', marginBottom: 16, lineHeight: 1.5 }}>
                    {activeRoadmapDef?.description}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div style={{ background: 'var(--glass)', padding: 12, borderRadius: 8 }}>
                      <div style={{ fontSize: 11, color: 'var(--sub)', marginBottom: 4 }}>Duration</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{activeRoadmapDef?.totalWeeks || 0} Weeks</div>
                    </div>
                    <div style={{ background: 'var(--glass)', padding: 12, borderRadius: 8 }}>
                      <div style={{ fontSize: 11, color: 'var(--sub)', marginBottom: 4 }}>Commitment</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                        {activeRaw && activeRoadmapDef?.totalWeeks 
                          ? Math.max(1, Math.round((activeRaw.reduce((acc, t) => acc + (parseInt(t[5]) || 2), 0)) / activeRoadmapDef.totalWeeks / 7)) 
                          : 2} hrs / day
                      </div>
                    </div>
                    <div style={{ background: 'var(--glass)', padding: 12, borderRadius: 8, gridColumn: 'span 2' }}>
                      <div style={{ fontSize: 11, color: 'var(--sub)', marginBottom: 4 }}>Difficulty</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{activeRoadmapDef?.difficulty || 'All Levels'}</div>
                    </div>
                  </div>

                  {activeRaw && activeRaw.length > 0 && (() => {
                    const nicheStats = {};
                    activeRaw.forEach(t => {
                      const trackId = t[2];
                      if (!nicheStats[trackId]) nicheStats[trackId] = { total: 0, done: 0 };
                      nicheStats[trackId].total += 1;
                      if (done[`${rmPrefix}${t[0]}-${t[1]}-${t[2]}`]) {
                        nicheStats[trackId].done += 1;
                      }
                    });
                    const total = activeRaw.length;
                    const doneTotal = activeRaw.filter(t => done[`${rmPrefix}${t[0]}-${t[1]}-${t[2]}`]).length;
                    
                    let currentBgOffset = 0;
                    const r = 36;
                    const c = 2 * Math.PI * r;

                    return (
                      <div style={{ marginTop: 24 }}>
                        <div style={{ fontSize: 11, color: 'var(--sub)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Topics Covered</div>
                        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                          <div style={{ position: 'relative', width: 100, height: 100 }}>
                            <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                              {Object.entries(nicheStats).map(([trackId, stats]) => {
                                const trackDef = (activeTracks && activeTracks[trackId]) || (TRACKS && TRACKS[trackId]);
                                if (!trackDef) return null;
                                const pct = stats.total / total;
                                const gap = 3;
                                const dashArray = `${Math.max(0, (pct * c) - gap)} ${c}`;
                                const dashOffset = -currentBgOffset;
                                currentBgOffset += pct * c;
                                return (
                                  <circle 
                                    key={`bg-${trackId}`}
                                    cx="50" cy="50" r={r}
                                    fill="transparent"
                                    stroke="var(--glass-border)"
                                    strokeWidth="8"
                                    strokeDasharray={dashArray}
                                    strokeDashoffset={dashOffset}
                                  />
                                )
                              })}
                              {(() => {
                                let currentFgOffset = 0;
                                return Object.entries(nicheStats).map(([trackId, stats]) => {
                                  const trackDef = (activeTracks && activeTracks[trackId]) || (TRACKS && TRACKS[trackId]);
                                  if (!trackDef) return null;
                                  
                                  const totalPct = stats.total / total;
                                  const donePct = (stats.done / stats.total) * totalPct; 
                                  const gap = 3;
                                  
                                  const dashArray = `${Math.max(0, (donePct * c) - gap)} ${c}`;
                                  const dashOffset = -currentFgOffset;
                                  currentFgOffset += totalPct * c;
                                  
                                  if (stats.done === 0) return null;
                                  return (
                                    <circle 
                                      key={`fg-${trackId}`}
                                      cx="50" cy="50" r={r}
                                      fill="transparent"
                                      stroke={trackDef.color || '#888'}
                                      strokeWidth="8"
                                      strokeDasharray={dashArray}
                                      strokeDashoffset={dashOffset}
                                      style={{ 
                                        transition: 'stroke-dasharray 0.6s cubic-bezier(0.16, 1, 0.3, 1)', 
                                        filter: `drop-shadow(0px 0px 6px ${trackDef.color})` 
                                      }}
                                    />
                                  )
                                });
                              })()}
                            </svg>
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                              <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>{doneTotal}/{total}</span>
                              <span style={{ fontSize: 9, color: 'var(--sub)', textTransform: 'uppercase', marginTop: 2 }}>Topics</span>
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                            {Object.entries(nicheStats).map(([trackId, stats]) => {
                              const trackDef = (activeTracks && activeTracks[trackId]) || (TRACKS && TRACKS[trackId]);
                              if (!trackDef) return null;
                              return (
                                <div key={trackId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: trackDef.color || '#888' }}></div>
                                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{trackDef.label}</span>
                                  </div>
                                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--sub)' }}>
                                    <span style={{ color: stats.done > 0 ? 'var(--text)' : 'inherit' }}>{stats.done}</span> / {stats.total}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {activeRoadmapDef?.tags && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 16 }}>
                      {activeRoadmapDef.tags.map(tag => (
                        <span key={tag} style={{ background: 'var(--glass)', padding: '4px 10px', borderRadius: 12, fontSize: 11, color: 'var(--text-secondary)' }}>{tag}</span>
                      ))}
                    </div>
                  )}

                  <button 
                    onClick={() => joinedRoadmaps[activeRoadmap] ? leaveRoadmap(activeRoadmap) : joinRoadmap(activeRoadmap)} 
                    style={{ width: '100%', marginTop: 24, padding: "12px 16px", background: joinedRoadmaps[activeRoadmap] ? "rgba(255, 50, 50, 0.2)" : "var(--accent)", color: joinedRoadmaps[activeRoadmap] ? "#ff8888" : "#fff", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14 }}
                  >
                    {joinedRoadmaps[activeRoadmap] ? "Leave Roadmap" : "Join Roadmap"}
                  </button>
                </div>

              <div style={{ flex: 1, height: 'calc(100vh - 120px)' }}>
                <RoadmapInteractiveTree 
                  activeRoadmapDef={activeRoadmapDef}
                  activeRaw={combinedTasks}
                  activeTracks={activeTracks}
                  doneMap={done}
                  onNodeClick={(task) => setDetailTask(task)}
                  isJoined={!!joinedRoadmaps[activeRoadmap]}
                />
              </div>
              </div>
            </motion.div>
          );
        })()

        /* ═══ HOME ═══ */
        : tab === "home" ? (
          <div style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden' }}>
            <motion.div 
              className="page" 
              key="home" 
              style={{ 
                flex: detailTask ? `0 0 ${taskNavWidth}px` : 1, 
                borderRight: detailTask ? '1px solid var(--border)' : 'none',
                overflowY: detailTask ? 'hidden' : 'auto',
                overflowX: 'hidden',
                resize: 'none',
                minWidth: detailTask ? '0px' : '100%',
                maxWidth: detailTask ? '100%' : '100%',
                background: detailTask ? 'var(--bg2)' : 'transparent',
                padding: 0,
                display: detailTask ? 'flex' : 'block',
                flexDirection: detailTask ? 'column' : 'unset',
                height: '100%'
              }} 
              {...fadeUp}
            >
            {/* ═══ ROADMAP SWITCHER ═══ */}
            <div style={{ flexShrink: 0, padding: detailTask ? '16px 16px 0' : '16px 32px 0' }}>
              <HomeRoadmapSwitcher
                joinedRoadmaps={joinedRoadmaps}
                activeRoadmap={activeRoadmap}
                ROADMAPS={ROADMAPS}
                switchRoadmap={(rmId) => {
                  setActiveRoadmap(rmId);
                  try {
                    const localKey = `vtask_user_${user}`;
                    const existing = JSON.parse(localStorage.getItem(localKey) || '{}');
                    localStorage.setItem(localKey, JSON.stringify({ ...existing, activeRoadmap: rmId }));
                  } catch(e) {}
                  try { setDoc(doc(db, "users", user), { activeRoadmap: rmId }, { merge: true }); } catch(e) {};
                }}
                haptic={haptic}
              />
            </div>
            
              {!detailTask && (
                <div style={{ padding: '16px 32px 32px', flexShrink: 0 }}>
                  <div style={{ marginBottom: 24 }}>
                    <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, color: 'var(--text)' }}>
                      Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {userProfile?.name?.split(' ')[0] || 'User'} {new Date().getHours() < 12 ? '☁️' : new Date().getHours() < 18 ? '☀️' : '🌙'}
                    </h1>
                  </div>
                  <div style={{ background: 'var(--accent)', borderRadius: 24, padding: '28px 32px', color: '#fff', marginBottom: 28, position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
                    <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div style={{ background: 'rgba(255,255,255,0.2)', width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {getLucideIcon('🚀')}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div style={{ fontSize: 16, fontWeight: 500, opacity: 0.9 }}>Your progress now</div>
                        <div style={{ fontSize: 24, fontWeight: 700 }}>{activeRaw.length > 0 ? Math.round(Object.keys(done).filter(k => k.startsWith(activeRoadmap+':')).length / activeRaw.length * 100) : 0}%</div>
                      </div>
                      <div style={{ height: 6, background: 'rgba(255,255,255,0.3)', borderRadius: 4, overflow: 'hidden' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${activeRaw.length > 0 ? Math.round(Object.keys(done).filter(k => k.startsWith(activeRoadmap+':')).length / activeRaw.length * 100) : 0}%` }} transition={{ duration: 1, ease: 'easeOut' }} style={{ height: '100%', background: '#fff', borderRadius: 4 }} />
                      </div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <CheckCircle size={14} /> {Object.keys(done).filter(k => k.startsWith(activeRoadmap+':')).length}/{activeRaw.length} Tasks Complete
                        </div>
                      </div>
                    </div>
                    {/* Decorative background circles */}
                    <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
                    <div style={{ position: 'absolute', bottom: -80, right: 40, width: 150, height: 150, background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
                  </div>
                </div>
              )}

              <div 
                className={detailTask ? "" : "dashboard-v2-grid"} 
                style={{ 
                  display: detailTask ? 'flex' : 'grid', 
                  flexDirection: detailTask ? 'column' : 'unset',
                  gridTemplateColumns: detailTask ? '1fr' : '1fr 1fr', 
                  gap: 24, 
                  marginBottom: detailTask ? 0 : 24, 
                  padding: detailTask ? '0 16px 16px' : '0 32px',
                  flex: detailTask ? 1 : 'none',
                  overflow: 'hidden'
                }}
              >
                  {/* TASKS LIST */}
                  <div 
                    className={detailTask ? "" : "animated-border-card"} 
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      padding: detailTask ? '16px 0 0' : '28px 32px', 
                      height: detailTask ? '100%' : 420,
                      background: detailTask ? 'transparent' : undefined,
                      border: detailTask ? 'none' : undefined,
                      boxShadow: detailTask ? 'none' : undefined
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                      <div style={{ display: 'flex', background: 'var(--card)', borderRadius: 20, padding: 4, gap: 4, border: '1px solid var(--border-light)' }}>
                        {['Recent', 'Today', 'Upcoming'].map(t => (
                          <button 
                            key={t}
                            className="dash-btn interactable" 
                            onClick={() => { haptic(); setHomeTab(t); }}
                            style={homeTab === t ? { background: 'var(--accent)', color: '#fff', border: 'none', padding: '6px 16px', boxShadow: 'var(--shadow-accent)', fontSize: 13, fontWeight: 600 } : { background: 'transparent', border: 'none', boxShadow: 'none', padding: '6px 16px', fontSize: 13, fontWeight: 600, color: 'var(--sub)' }}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <input type="text" className="search-input" placeholder="Search..." style={{ width: 120 }} />
                        <button className="dash-btn interactable" onClick={() => switchTab("calendar")}>📅</button>
                      </div>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, paddingRight: 16 }}>
                      {(() => {
                        let displayTasks = actualTodayTasks;
                        if (homeTab === 'Recent') {
                          // Show recently completed tasks for active roadmap
                          displayTasks = combinedTasks.filter(t => !!done[t.id]).slice(-10).reverse();
                        } else if (homeTab === 'Upcoming') {
                          displayTasks = upcomingTasks.slice(0, 10);
                        }
                        
                        if (displayTasks.length === 0) return <div style={{textAlign:'center', color:'var(--sub)', padding: '24px 0'}}>No tasks for {homeTab.toLowerCase()}.</div>;
                        
                        return displayTasks.map((task, idx) => {
                          const tr = (activeTracks[task.track] || TRACKS[task.track] || TRACKS[0]);
                          const isDone = !!done[task.id];
                          return (
                            <motion.div 
                              key={task.id} 
                              className="task-card-v2"
                              onClick={() => setDetailTask(task)} 
                              style={{ 
                                opacity: 1, 
                                margin: 0, 
                                padding: '16px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 16,
                                borderRadius: 16,
                                border: detailTask?.id === task.id ? '2px solid var(--accent)' : '1px solid transparent',
                                background: detailTask?.id === task.id ? 'var(--card-hover)' : 'var(--card)',
                                cursor: 'pointer',
                                flexShrink: 0
                              }}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.04, duration: 0.3 }}
                            >
                            <div style={{ width: 48, height: 48, borderRadius: '50%', background: `${tr.color}22`, color: tr.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              {getLucideIcon('📁')}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--text)', marginBottom: 4 }}>{task.topic}</div>
                              <div style={{ fontSize: 13, color: 'var(--sub)' }}>{tr.label} • {task.duration || 1}h</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <button 
                                className="check-btn interactable"
                                onClick={(e) => { e.stopPropagation(); toggle(task.id); }}
                                style={{
                                  width: 32, height: 32, borderRadius: '50%',
                                  background: isDone ? 'var(--accent)' : 'var(--card2)',
                                  border: isDone ? 'none' : '2px solid var(--border)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  color: isDone ? '#fff' : 'transparent',
                                  cursor: 'pointer'
                                }}
                              >
                                <CheckCircle size={18} />
                              </button>
                            </div>
                          </motion.div>
                        );
                      })
                      })()}
                    </div>
                  </div>

                  {/* PERFORMANCE HEATMAP */}
                  {!detailTask && (
                    <div className="animated-border-card" style={{ display: 'flex', flexDirection: 'column', padding: '24px 32px', height: 420 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>Activity Map</h3>
                      </div>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', overflowX: 'auto' }}>
                        <Heatmap doneMap={done} onDateClick={(dateStr) => { setSelectedActivityDate(dateStr); switchTab("calendar"); }} />
                      </div>
                    </div>
                  )}

              </div>
          </motion.div>
          
          {detailTask && taskNavWidth > 0 && (
            <div 
              onMouseDown={startTaskNavResize}
              style={{
                width: '6px',
                cursor: 'col-resize',
                background: 'transparent',
                position: 'relative',
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div style={{ width: 2, height: 30, background: 'var(--border-light)', borderRadius: 2 }} />
            </div>
          )}

          {/* DETAIL PANE */}
          {detailTask && (
            <div 
              style={{ 
                flex: 1, 
                overflowY: 'auto', 
                background: 'var(--bg)', 
                position: 'relative'
              }}
            >
              {taskNavWidth === 0 && (
                <button 
                  onClick={() => setTaskNavWidth(350)}
                  style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 110, background: 'var(--card)', border: '1px solid var(--border)', borderLeft: 'none', padding: '16px 8px', borderRadius: '0 8px 8px 0', cursor: 'pointer', color: 'var(--sub)' }}
                >
                  ▶
                </button>
              )}
              {rightWidth === 0 && (
                <button 
                  onClick={() => setRightWidth(350)}
                  style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 110, background: 'var(--card)', border: '1px solid var(--border)', borderRight: 'none', padding: '16px 8px', borderRadius: '8px 0 0 8px', cursor: 'pointer', color: 'var(--sub)' }}
                >
                  ◀
                </button>
              )}
              <TaskCenterView 
                key="task-detail" 
                detailTask={detailTask} 
                TRACKS={TRACKS} 
                activeTracks={activeTracks} 
                activeResources={activeResources} 
                RESOURCES={RESOURCES} 
                closeDetail={() => setDetailTask(null)} 
                fadeUp={fadeUp} 
                doneMap={done} 
                onToggleDone={toggle} 
              />
            </div>
          )}
          </div>
        )
        : tab === 'discover' ? (
            <motion.div key="discover" className="tab-pane active" {...fadeUp} style={{ maxWidth: 900, margin: '0 auto', paddingBottom: 100 }}>
              <div className="section-header" style={{ marginTop: 28 }}><h2>Discover Roadmaps</h2></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              {ROADMAPS.map((rm, idx) => {
                const isJoined = !!joinedRoadmaps[rm.id];
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
                      borderRadius: 18, padding: '20px', cursor: rm.isComingSoon ? 'default' : 'pointer',
                      position: 'relative', overflow: 'hidden',
                      opacity: rm.isComingSoon ? 0.6 : 1,
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    onClick={() => {
                      if (rm.isComingSoon) return;
                      switchRoadmap(rm.id);
                      switchTab("roadmap");
                    }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: 14,
                        background: rm.color + '1A',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 24, flexShrink: 0
                      }}>{getLucideIcon(rm.icon)}</div>
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
                        {rm.isComingSoon ? (
                          <div style={{ height: 17, marginBottom: 0 }}></div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div className="pbar" style={{ flex: 1, marginTop: 0, height: 5 }}>
                              <div className="pfill" style={{ width: `${rmPct}%`, background: rm.color }} />
                            </div>
                            <span style={{ fontSize: 11, color: rm.color, fontWeight: 600, flexShrink: 0 }}>{rmPct}%</span>
                          </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                          <span style={{ fontSize: 11, color: 'var(--sub)' }}>{rm.totalDays > 0 ? `${rm.totalDays} days · ` : ''}{rm.difficulty}</span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: rm.isComingSoon ? rm.color : (isJoined ? rm.color : 'var(--sub)') }}>
                            {rm.isComingSoon ? 'Coming Soon ⏳' : (isJoined ? (isActive ? 'Currently Active' : 'Switch →') : 'Join →')}
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

        /* ═══ CALENDAR / GANTT ═══ */
        : tab === "calendar" ? (
          detailTask ? (
            <TaskCenterView key="task-detail" detailTask={detailTask} TRACKS={TRACKS} activeTracks={activeTracks} activeResources={activeResources} RESOURCES={RESOURCES} closeDetail={() => setDetailTask(null)} fadeUp={fadeUp} doneMap={done} onToggleDone={toggle} />
          ) : selectedActivityDate ? (
            (() => {
              const dateObj = new Date(selectedActivityDate);
              const dayDowObj = dateObj.getDay();
              const mappedDow = dayDowObj === 0 ? 6 : dayDowObj - 1;
              
              let startD = userProfile?.startDate ? new Date(userProfile.startDate) : new Date();
              startD.setHours(0,0,0,0);
              const diffTime = Math.abs(dateObj - startD);
              const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
              const targetWeek = Math.floor(diffDays / 7) + 1;
              const targetDay = (diffDays % 7) + 1;

              const dateTasks = combinedTasks.filter(t => {
                if (t.isCustom) {
                  if (t.rmId !== activeRoadmap) return false;
                  if (t.scheduleType === 'date') return t.date === selectedActivityDate;
                  if (t.scheduleType === 'repeat') return t.repeatDays && t.repeatDays.includes(mappedDow);
                  return false;
                }
                return t.week === targetWeek && t.day === targetDay && assignedTracks.includes(t.track);
              });

              const displayTasks = dateTasks.length > 0 ? dateTasks : actualTodayTasks;

              return (
                <DailyScheduleView
                  dateStr={selectedActivityDate}
                  onClose={() => setSelectedActivityDate(null)}
                  tasks={displayTasks}
                  done={done}
                  toggle={toggle}
                  TRACKS={TRACKS}
                  activeTracks={activeTracks}
                />
              );
            })()
          ) : (
          <motion.div className="page" key="calendar" {...fadeUp} style={{ padding: '24px 32px' }}>
            <GanttCalendar 
              allTasks={combinedTasks} 
              doneMap={done} 
              onNodeClick={(task) => { setDetailTask(task); }} 
              startDate={userProfile?.startDate}
              onDateClick={(dateStr) => setSelectedActivityDate(dateStr)}
            />
          </motion.div>
          )
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
              {actualTodayTasks.map((task, idx) => {
                const tr = (activeTracks[task.track] || TRACKS[task.track] || TRACKS[0]), isDone = !!done[task.id];
                return (
                  <motion.div key={task.id} className="notif-item" initial={{ opacity:0,x:-8 }} animate={{ opacity:1,x:0 }} transition={{ delay: idx*0.06 }}>
                    <div className="avatar" style={{ background: tr.bg }}>{getLucideIcon(tr.icon)}</div>
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
                  <div className="avatar" style={{ background: tr.bg }}>{getLucideIcon(tr.icon)}</div>
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
        : tab === "profile" ? (() => {
          const wkAll = combinedTasks.filter(t => t.week === currentWeekIdx && assignedTracks.includes(t.track));
          const wkDone = wkAll.filter(t => done[t.id]).length;
          const todayDone = actualTodayTasks.filter(t => done[t.id]).length;
          const totalAll = combinedTasks.filter(t => assignedTracks.includes(t.track)).length;
          const totalDone = combinedTasks.filter(t => assignedTracks.includes(t.track) && done[t.id]).length;

          return (
          <motion.div className="page" key="profile" {...fadeUp}>
            <div className="page-header"><h1 style={{ fontSize: 22 }}>Profile</h1></div>
            
            <motion.div className="profile-hero" {...scaleIn}>
              <div className="profile-avatar" style={{ textTransform: "uppercase" }}>
                {userProfile.avatar || userProfile.name?.[0] || "U"}
              </div>
              <div className="profile-name">{userProfile.name}</div>
              <div className="profile-role">FAANG Candidate</div>
            </motion.div>

            <h3 className="section-title">Edit Profile</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24, padding: 16, background: 'var(--card)', borderRadius: 12, border: '1px solid var(--border)' }}>
              <div>
                <label style={{ fontSize: 12, color: 'var(--sub)', marginBottom: 4, display: 'block' }}>Display Name</label>
                <input 
                  type="text" 
                  value={userProfile.name} 
                  onChange={e => {
                    const up = { ...userProfile, name: e.target.value };
                    setUserProfile(up);
                    persist({ userProfile: up });
                  }}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--sub)', marginBottom: 4, display: 'block' }}>Email (for Notifications)</label>
                <input 
                  type="email" 
                  value={userProfile.email} 
                  onChange={e => {
                    const up = { ...userProfile, email: e.target.value };
                    setUserProfile(up);
                    persist({ userProfile: up });
                  }}
                  placeholder="name@example.com"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--sub)', marginBottom: 4, display: 'block' }}>Avatar Emoji/URL</label>
                <input 
                  type="text" 
                  value={userProfile.avatar} 
                  onChange={e => {
                    const up = { ...userProfile, avatar: e.target.value };
                    setUserProfile(up);
                    persist({ userProfile: up });
                  }}
                  placeholder="😎"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text)' }}
                />
              </div>
              <div style={{ marginTop: 8 }}>
                <button 
                  onClick={() => {
                    const nextTheme = userProfile.theme === 'light' ? 'dark' : 'light';
                    const up = { ...userProfile, theme: nextTheme };
                    setUserProfile(up);
                    persist({ userProfile: up });
                  }}
                  className="interactable"
                  style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}
                >
                  {userProfile.theme === 'light' ? '🌙 Switch to Dark Mode' : '☀️ Switch to Light Mode'}
                </button>
              </div>
            </div>

            <h3 className="section-title">Statistics</h3>
            <div className="stats-grid">
              {[{ label:"Completed",value:totalDone,icon:"✅",color:"var(--green)" },{ label:"Remaining",value:totalAll-totalDone,icon:"📋",color:"var(--yellow)" },{ label:"This Week",value:`${wkDone}/${wkAll.length}`,icon:"📅",color:"var(--purple)" },{ label:"Today",value:`${todayDone}/${actualTodayTasks.length}`,icon:"☀️",color:"var(--accent)" }]
                .map((s,i) => (
                  <motion.div key={s.label} className="stat-card interactable" initial={{ opacity:0,scale:0.9 }} animate={{ opacity:1,scale:1 }} transition={{ delay:i*0.06 }}>
                    <div className="stat-icon">{getLucideIcon(s.icon)}</div><div className="stat-value" style={{ color:s.color }}>{s.value}</div><div className="stat-label">{s.label}</div>
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
                    {getLucideIcon(t.icon)} {t.label} {isActive ? "✓" : "+"}
                  </div>
                );
              })}
            </div>

            <h3 className="section-title">My Roadmaps</h3>
            <div style={{ display: "flex", flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {ROADMAPS.map(rm => {
                const isJoined = !!joinedRoadmaps[rm.id];
                return (
                  <div key={rm.id} className="menu-item interactable" onClick={() => {
                    haptic();
                    if (isJoined) { leaveRoadmap(rm.id); }
                    else { joinRoadmap(rm.id); switchRoadmap(rm.id); }
                  }} style={{ border: isJoined ? `1px solid ${rm.color}44` : undefined }}>
                    <div className="menu-left">
                      <span className="menu-icon">{getLucideIcon(rm.icon)}</span>
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
                <span className="menu-icon">{getLucideIcon("📧")}</span>
                <input type="email" placeholder="Email for alerts..." value={alertEmail} 
                  onChange={e => {
                    setAlertEmail(e.target.value);
                    setDoc(doc(db, "users", user), { email: e.target.value }, { merge: true });
                  }}
                  style={{ background: "transparent", border: "none", color: "var(--text)", width: "100%", outline: "none", fontSize: 15 }} />
              </div>
            </div>
            {[{ label:"All Tasks",icon:"📋",action:()=>switchTab("calendar") },
              { label:"Reset Progress",icon:"🔄",action:()=>{setDone({});persist({ progress: {} });showToast("Progress reset");} },
              { label:"Log Out",icon:"🚪",action:onLogout }
            ]
              .map(item => (
                  <div key={item.label} className="menu-item interactable" onClick={() => { haptic(); item.action?.(); }}>
                  <div className="menu-left"><span className="menu-icon">{getLucideIcon(item.icon)}</span><span>{item.label}</span></div><span className="menu-arrow">›</span>
                </div>
              ))}
          </motion.div>
        );
      })() : null}
        </AnimatePresence>
      </div>
      </div>

      <AnimatePresence>
      {showRightSidebar && (
        <>
          {isOverlayMode && (
            <motion.div 
              key="sidebar-overlay-bg"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setDetailTask(null)}
              style={{
                position: 'fixed', inset: 0, zIndex: 40,
                background: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)'
              }} 
            />
          )}
          {!isOverlayMode && rightWidth > 0 && (
            <div 
              onMouseDown={startRightResize}
              style={{
                width: '6px',
                cursor: 'col-resize',
                background: 'transparent',
                position: 'absolute',
                right: computedRightWidth - 2,
                top: 0,
                bottom: 0,
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div style={{ width: 2, height: 30, background: 'var(--border-light)', borderRadius: 2 }} />
            </div>
          )}
          <SidebarRight 
            key="sidebar-right-panel"
            detailTask={detailTask} 
            closeDetail={() => setDetailTask(null)} 
            activeTracks={activeTracks} 
            TRACKS={TRACKS} 
            done={done} 
            activeResources={activeResources} 
            RESOURCES={RESOURCES} 
            activeRoadmapTitle={activeRoadmapDef.label}
            tab={tab}
            isJoined={!!joinedRoadmaps[activeRoadmap]}
            activeRaw={combinedTasks}
            activeRoadmapDef={activeRoadmapDef}
            joinRoadmap={() => joinRoadmap(activeRoadmap)}
            leaveRoadmap={() => leaveRoadmap(activeRoadmap)}
            toggleTaskDone={toggle}
            isOverlayMode={isOverlayMode}
            actualTodayTasks={actualTodayTasks}
            incompletePastTasks={incompletePastTasks}
            selectedActivityDate={selectedActivityDate}
            setSelectedActivityDate={setSelectedActivityDate}
            onOpenTaskModal={() => setIsTaskModalOpen(true)}
            onOpenMeetingModal={() => setIsMeetingModalOpen(true)}
            meetings={meetings}
            onEditCustomTask={(task) => {
              setEditingTask(task);
              setIsTaskModalOpen(true);
            }}
            onDeleteCustomTask={handleDeleteCustomTask}
          />
        </>
      )}

      {(() => {
        if (!selectedActivityDate) return null;
        
        const dateObj = new Date(selectedActivityDate);
        const dayDowObj = dateObj.getDay();
        const mappedDow = dayDowObj === 0 ? 6 : dayDowObj - 1;
        
        let startD = userProfile?.startDate ? new Date(userProfile.startDate) : new Date();
        startD.setHours(0,0,0,0);
        const diffTime = Math.abs(dateObj - startD);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const targetWeek = Math.floor(diffDays / 7) + 1;
        const targetDay = (diffDays % 7) + 1;

        const dateTasks = combinedTasks.filter(t => {
          if (t.isCustom) {
            if (t.rmId !== activeRoadmap) return false;
            if (t.scheduleType === 'date') return t.date === selectedActivityDate;
            if (t.scheduleType === 'repeat') return t.repeatDays && t.repeatDays.includes(mappedDow);
            return false;
          }
          return t.week === targetWeek && t.day === targetDay && assignedTracks.includes(t.track);
        });

        // Fallback to today's tasks if somehow empty (prototype visualization)
        const displayTasks = dateTasks.length > 0 ? dateTasks : actualTodayTasks;

        return (
          <DailyScheduleView
            dateStr={selectedActivityDate}
            onClose={() => setSelectedActivityDate(null)}
            tasks={displayTasks}
            done={done}
            toggle={toggle}
            TRACKS={TRACKS}
            activeTracks={activeTracks}
          />
        );
      })()}
      </AnimatePresence>



      {isProfileModalOpen && (
        <ProfileModal 
          userProfile={userProfile} 
          onClose={() => setIsProfileModalOpen(false)} 
          onSave={(newProfile) => {
            const up = { ...userProfile, ...newProfile };
            setUserProfile(up);
            persist({ userProfile: up });
            setIsProfileModalOpen(false);
          }} 
          onLogout={onLogout}
        />
      )}

      <AnimatePresence>
      {isTaskModalOpen && (
        <TaskModal
          editTask={editingTask}
          onClose={() => {
            setIsTaskModalOpen(false);
            setEditingTask(null);
          }}
          onSave={(taskData) => {
            if (editingTask) {
              handleUpdateCustomTask(editingTask.id, {
                topic: taskData.name,
                track: taskData.track !== undefined ? parseInt(taskData.track) : 0,
                desc: taskData.desc,
                scheduleType: taskData.scheduleType,
                date: taskData.date,
                repeatDays: taskData.selectedDays,
                priority: taskData.priority
              });
            } else {
              const newTask = {
                id: `custom_${Date.now()}`,
                topic: taskData.name,
                track: taskData.track !== undefined ? parseInt(taskData.track) : 0,
                duration: taskData.duration,
                desc: taskData.desc,
                isCustom: true,
                rmId: activeRoadmap,
                scheduleType: taskData.scheduleType,
                date: taskData.date,
                repeatDays: taskData.selectedDays,
                priority: taskData.priority,
                // fallbacks for old checks just in case
                week: currentWeekIdx,
                day: currentDayIdx
              };
              const updated = [...customTasks, newTask];
              setCustomTasks(updated);
              persist({ customTasks: updated });
            }
            setIsTaskModalOpen(false);
            setEditingTask(null);
          }}
          TRACKS={TRACKS}
          activeTracks={activeTracks}
        />
      )}
      </AnimatePresence>

      {isMeetingModalOpen && (
        <MeetingModal
          onClose={() => setIsMeetingModalOpen(false)}
          onSave={(meetingData) => {
            const updated = [...meetings, meetingData].sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
            setMeetings(updated);
            persist({ meetings: updated });
            setIsMeetingModalOpen(false);
          }}
        />
      )}

      {showOnboarding && (
        <OnboardingModal
          onClose={() => setShowOnboarding(false)}
          onComplete={() => {
            const up = { ...userProfile, onboardingCompleted: true };
            setUserProfile(up);
            persist({ userProfile: up });
            setShowOnboarding(false);
          }}
        />
      )}
    </motion.div>
  );
}
