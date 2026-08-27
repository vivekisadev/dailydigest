import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ActivityFeed from './ActivityFeed';

export default function SidebarRight({ detailTask, closeDetail, activeTracks, TRACKS, done, activeResources, RESOURCES, activeRoadmapTitle, tab, isJoined, activeRaw, activeRoadmapDef, joinRoadmap, leaveRoadmap, toggleTaskDone, isOverlayMode, actualTodayTasks, incompletePastTasks, selectedActivityDate, setSelectedActivityDate, onOpenTaskModal, onOpenMeetingModal, meetings, onEditCustomTask, onDeleteCustomTask }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [detailActiveTab, setDetailActiveTab] = useState('comments');

  useEffect(() => {
    if (selectedActivityDate) {
      setActiveTab('Activity');
    }
  }, [selectedActivityDate]);

  const [expandedTopics, setExpandedTopics] = useState({});
  const [viewAll, setViewAll] = useState(false);

  const toggleTopic = (id) => {
    setExpandedTopics(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (detailTask) {
    if (detailTask.type === 'week') {
      const { weekNum, tasks } = detailTask;
      return (
        <motion.div 
          className="sidebar-right" 
          initial={isOverlayMode ? { x: '100%' } : { opacity: 1 }}
          animate={isOverlayMode ? { x: 0 } : { opacity: 1 }}
          exit={isOverlayMode ? { x: '100%' } : { opacity: 1 }}
          transition={{ type: 'spring', damping: 30, stiffness: 250 }}
          style={{ 
            padding: 0, display: 'flex', flexDirection: 'column',
            ...(isOverlayMode ? { position: 'fixed', right: 0, top: 0, bottom: 0, width: '60vw', zIndex: 50, boxShadow: '-20px 0 40px rgba(0,0,0,0.5)', borderLeft: '1px solid var(--border)', background: 'var(--card)', backdropFilter: 'blur(20px)' } : {})
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Week {weekNum} Overview</div>
            <button className="interactable" onClick={closeDetail} style={{ background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer' }}>✕</button>
          </div>
          
          <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Week {weekNum}</div>
              <div style={{ fontSize: 13, color: 'var(--sub)' }}>{tasks.length} topics • {tasks.reduce((acc, t) => acc + (parseInt(t.hrs)||2), 0)} hours total</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {tasks.map((task, i) => {
                const isExpanded = !!expandedTopics[task.id];
                const tr = (activeTracks?.[task.track] || TRACKS?.[task.track] || TRACKS?.[0] || { color: '#888', label: 'General' });
                const resources = (activeResources?.[task.topic] || RESOURCES?.[task.topic] || []);
                return (
                  <div key={task.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
                    <div 
                      className="interactable"
                      onClick={() => toggleTopic(task.id)}
                      style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: isExpanded ? 'rgba(255,255,255,0.05)' : 'transparent' }}
                    >
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{task.topic}</div>
                        <div style={{ fontSize: 12, color: '#888', display: 'flex', gap: 12 }}>
                          <span>⏱ {task.hrs || 2}h</span>
                          <span style={{ color: tr.color }}>{tr.label}</span>
                        </div>
                      </div>
                      <div style={{ color: '#888' }}>{isExpanded ? '▲' : '▼'}</div>
                    </div>
                    {isExpanded && (
                      <div style={{ padding: '0 16px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 16, paddingTop: 16 }}>
                        <div style={{ fontSize: 13, color: '#ccc', marginBottom: 16, lineHeight: 1.5 }}>
                          {task.desc ? (
                            <div dangerouslySetInnerHTML={{ __html: task.desc }} />
                          ) : (
                            'No description available for this topic.'
                          )}
                        </div>
                        {resources.length > 0 && (
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#888', marginBottom: 8, textTransform: 'uppercase' }}>Resources</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                              {resources.map((res, j) => {
                                const rName = res.name || res.title || res;
                                const rLink = res.link || res.url || null;
                                return (
                                  <a key={j} href={rLink || '#'} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--glass)', borderRadius: 6, color: 'var(--text)', textDecoration: 'none', fontSize: 12 }}>
                                    <span style={{ color: tr.color }}>🔗</span> <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rName}</span>
                                  </a>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      );
    }

    // REGULAR TASK DETAIL
    const tr = (activeTracks?.[detailTask.track] || TRACKS?.[detailTask.track] || TRACKS?.[0] || { color: '#888', label: 'General' });
    const isDone = !!done[detailTask.id];
    let resources = detailTask.probs?.length > 0 ? detailTask.probs : (activeResources?.[detailTask.topic] || RESOURCES?.[detailTask.topic] || detailTask.res || []);
    if (!Array.isArray(resources)) {
      resources = resources ? [resources] : [];
    }
    
    return (
      <motion.div 
        className="sidebar-right" 
        initial={isOverlayMode ? { x: '100%' } : { opacity: 1 }}
        animate={isOverlayMode ? { x: 0 } : { opacity: 1 }}
        exit={isOverlayMode ? { x: '100%' } : { opacity: 1 }}
        transition={{ type: 'spring', damping: 30, stiffness: 250 }}
        style={{ 
          padding: 0, display: 'flex', flexDirection: 'column',
          ...(isOverlayMode ? { position: 'fixed', right: 0, top: 0, bottom: 0, width: '60vw', zIndex: 50, boxShadow: '-20px 0 40px rgba(0,0,0,0.5)', borderLeft: '1px solid var(--border)', background: 'var(--card)', backdropFilter: 'blur(20px)' } : {})
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <button style={{ background: 'var(--glass)', color: 'var(--text)', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: 6, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>📦</span> Resources
            </button>
            
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <select 
                value={isDone ? 'done' : 'pending'} 
                onChange={() => {
                  if (typeof toggleTaskDone === 'function') toggleTaskDone(detailTask.id);
                }}
                style={{ 
                  background: 'transparent', color: isDone ? '#10b981' : '#aaa', 
                  border: '1px solid var(--border)', padding: '6px 28px 6px 32px', 
                  borderRadius: 6, fontSize: 13, outline: 'none', cursor: 'pointer',
                  appearance: 'none', fontWeight: 600
                }}
              >
                <option value="pending" style={{ background: '#111', color: '#aaa' }}>Pending</option>
                <option value="done" style={{ background: '#111', color: '#10b981' }}>Completed</option>
              </select>
              <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 8, height: 8, borderRadius: '50%', background: isDone ? '#10b981' : '#555' }} />
              <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: '#aaa', pointerEvents: 'none' }}>▼</div>
            </div>
            <button className="interactable" onClick={closeDetail} style={{ background: 'var(--glass)', border: '1px solid var(--border)', color: 'var(--sub)', borderRadius: 6, width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>✕</button>
          </div>
        </div>
        
        <div style={{ padding: '32px 20px 20px', display: 'flex', flexDirection: 'column', overflowY: 'auto', flex: 1, scrollBehavior: 'smooth' }}>
          {tab === 'roadmap' ? (
            <div style={{ animation: 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <span style={{ background: `${tr.color}22`, color: tr.color, padding: '6px 12px', borderRadius: 8, fontSize: 13, fontWeight: 700 }}>{tr.label}</span>
                <span style={{ color: '#aaa', fontSize: 14, display: 'flex', alignItems: 'center' }}>⏱ {detailTask.hrs || 2} hours</span>
              </div>
              <div style={{ fontSize: 46, fontWeight: 900, color: 'var(--text)', marginBottom: 24, lineHeight: 1.1, letterSpacing: '-0.02em' }}>{detailTask.topic}</div>
              
              <div style={{ fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 40, padding: '24px', background: 'var(--glass)', borderRadius: 16, border: '1px solid var(--glass-border)' }}>
                {detailTask.desc ? (
                  <div dangerouslySetInnerHTML={{ __html: detailTask.desc }} />
                ) : (
                  'No description provided for this topic.'
                )}
              </div>

              {resources && resources.length > 0 && (
                <div style={{ border: '1px solid var(--border)', borderRadius: 20, padding: 32, background: 'rgba(255,255,255,0.01)' }}>
                  <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginBottom: 24 }}>Learning Resources & Problems</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {resources.map((res, i) => {
                      const isStr = typeof res === 'string';
                      const rName = isStr ? res : (res.name || res.title || "Resource");
                      const isUrlStr = isStr && res.startsWith('http');
                      const rLink = isStr ? (isUrlStr ? res : `https://leetcode.com/problemset/all/?search=${encodeURIComponent(res.replace('LC ', ''))}`) : (res.link || res.url || '#');
                      const rId = isStr ? `${detailTask.id}:res-${i}` : `${detailTask.id}:${res.id || i}`;
                      const isResDone = !!(done && done[rId]);
                      
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

                      if (!isStr && res.difficulty) {
                        badge = res.difficulty === 'E' ? 'Easy' : res.difficulty === 'M' ? 'Medium' : res.difficulty === 'H' ? 'Hard' : 'Theory';
                        badgeColor = res.difficulty === 'E' ? '#3FB950' : res.difficulty === 'M' ? '#D29922' : res.difficulty === 'H' ? '#F85149' : '#7C8B9B';
                      }

                      return (
                        <div key={i} className="premium-resource-card" style={{ padding: '20px 24px' }}>
                          <div 
                            className={`premium-check-btn ${isResDone ? 'checked' : ''}`}
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              if (typeof toggleTaskDone === 'function') toggleTaskDone(rId, e, detailTask, resources); 
                            }}
                            style={{
                              border: `2px solid ${isResDone ? tr.color : 'rgba(255,255,255,0.15)'}`,
                              background: isResDone ? tr.color : "transparent", 
                              color: isResDone ? '#0A0A0F' : 'transparent',
                              flexShrink: 0, width: 32, height: 32
                            }}
                          >
                            {isResDone && <svg width="16" height="14" viewBox="0 0 12 10" style={{position:'relative', zIndex: 10}}><path d="M1 5L4.5 8.5L11 1" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          </div>
                          <a href={typeof rLink === 'string' ? rLink : '#'} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 20, flex: 1, textDecoration: 'none', position: 'relative', zIndex: 2 }}>
                            <div className="premium-badge-icon" style={{ background: `${badgeColor}22`, color: badgeColor, width: 48, height: 48, fontSize: 22 }}>
                              {badge === 'Video' ? '▶' : badge === 'Official' ? '📚' : badge === 'Feed' ? 'RSS' : (!isStr && res.difficulty) ? '💻' : '📄'}
                            </div>
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                              <div style={{ fontSize: 18, fontWeight: 700, color: isResDone ? 'var(--sub)' : 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 6, textDecoration: isResDone ? 'line-through' : 'none', transition: 'color 0.3s' }}>{rName}</div>
                              <div style={{ fontSize: 14, color: badgeColor, fontWeight: 600, display: 'inline-block' }}>{badge}</div>
                            </div>
                            <div className="premium-arrow" style={{ width: 36, height: 36 }}>↗</div>
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#777' }}>Roadmap:</span>
                  <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: 6, fontSize: 12, color: '#aaa' }}>{activeRoadmapTitle || 'Roadmap'}</span>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#777' }}>Time:</span>
                  <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: 6, fontSize: 12, color: '#aaa' }}>{detailTask.hrs || 2} hours</span>
                </div>
              </div>

              {resources && resources.length > 0 && (
                <div style={{ border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 12, padding: 20, background: 'rgba(16, 185, 129, 0.02)', marginBottom: 32 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#10b981', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>💚</span> Free Resources
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {resources.map((res, i) => {
                      const isStr = typeof res === 'string';
                      const rName = isStr ? res : (res.name || res.title || res);
                      const isUrlStr = isStr && res.startsWith('http');
                      const rLink = isStr ? (isUrlStr ? res : `https://leetcode.com/problemset/all/?search=${encodeURIComponent(res.replace('LC ', ''))}`) : (res.link || res.url || '#');
                      
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
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ background: badgeColor, color: '#000', fontSize: 11, fontWeight: 700, padding: '2px 6px', borderRadius: 4, whiteSpace: 'nowrap' }}>{badge}</span>
                          <a href={rLink || '#'} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text)', textDecoration: 'underline', textDecorationColor: 'var(--border)', textUnderlineOffset: 4, fontSize: 14, fontWeight: 500, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {rName}
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
            {['comments', 'activity'].map(t => (
              <div 
                key={t} 
                onClick={() => setActiveTab(t)}
                style={{ 
                  paddingBottom: 12, 
                  fontSize: 13, 
                  fontWeight: activeTab === t ? 600 : 500, 
                  color: activeTab === t ? 'var(--text)' : 'var(--sub)', 
                  borderBottom: activeTab === t ? '2px solid var(--accent)' : '2px solid transparent',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {t}
              </div>
            ))}
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: 20 }}>
            {activeTab === 'comments' && (
              <>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 16 }}>
                   <div style={{ fontSize: 13, color: '#888', fontStyle: 'italic' }}>No comments yet.</div>
                </div>
                <div style={{ marginTop: 'auto', background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <input type="text" placeholder="Add a comment (C)" style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text)', fontSize: 13, outline: 'none' }} />
                </div>
              </>
            )}
            {activeTab === 'activity' && <div style={{ color: '#aaa', fontSize: 13 }}>No recent activity.</div>}
          </div>
        </div>
      </motion.div>
    );
  }

  // If we are on the roadmap tab, show Roadmap Progress/Overview
  if (tab === 'roadmap') {
    const easyTasks = activeRaw?.filter(t => t[6] === 1 || String(t[6]).toLowerCase() === 'easy') || [];
    const hardTasks = activeRaw?.filter(t => t[6] === 3 || String(t[6]).toLowerCase() === 'hard') || [];
    const medTasks = activeRaw?.filter(t => t[6] === 2 || String(t[6]).toLowerCase() === 'medium' || String(t[6]).toLowerCase() === 'med') || [];
    const unclassified = activeRaw?.filter(t => ![1,2,3,'easy','medium','med','hard'].includes(t[6] !== undefined ? t[6] : -1)) || [];
    
    const numEasy = easyTasks.length;
    const numMed = medTasks.length + unclassified.length;
    const numHard = hardTasks.length;
    const totalTasks = (numEasy + numMed + numHard) || 1;

    const doneEasy = easyTasks.filter(t => done[t.id]).length;
    const doneMed = medTasks.filter(t => done[t.id]).length + unclassified.filter(t => done[t.id]).length;
    const doneHard = hardTasks.filter(t => done[t.id]).length;
    const completedTasks = doneEasy + doneMed + doneHard;

    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const arcAngle = 260; // 260 degrees total arc
    const startAngle = 140; // Starts at bottom left
    const gapAngle = 6; // 6 degrees gap
    const availableAngle = arcAngle - (2 * gapAngle);
    
    const degPerTask = availableAngle / totalTasks;
    const easyAngle = numEasy * degPerTask;
    const medAngle = numMed * degPerTask;
    const hardAngle = numHard * degPerTask;

    const easyStart = startAngle;
    const medStart = easyStart + easyAngle + gapAngle;
    const hardStart = medStart + medAngle + gapAngle;

    const renderArc = (startDeg, sweepDeg, color, progress, isBg) => {
      if (sweepDeg <= 0) return null;
      const sweepLen = (sweepDeg / 360) * circumference;
      const offset = circumference - (startDeg / 360) * circumference;
      const actualSweep = isBg ? sweepLen : sweepLen * progress;
      const actualEmpty = circumference - actualSweep;
      
      // If progress is 0, we shouldn't draw a dot for the active stroke.
      if (!isBg && progress === 0) return null;

      return (
        <circle 
          key={startDeg + '-' + isBg}
          cx="50" cy="50" r={radius} 
          fill="none" 
          stroke={color} 
          strokeWidth={isBg ? "3" : "5"} 
          strokeLinecap="round"
          strokeDasharray={`${actualSweep} ${actualEmpty}`}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dasharray 0.5s ease', opacity: isBg ? 0.3 : 1 }}
        />
      );
    };

    return (
      <div className="sidebar-right" style={{ padding: '24px 20px' }}>
        <div style={{ background: 'var(--card)', borderRadius: 16, padding: 20, marginBottom: 24, border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: 16, alignItems: 'center' }}>
                <span style={{ fontSize: 14, color: '#34D399', fontWeight: 600 }}>Easy</span>
                <span style={{ fontSize: 14, color: 'var(--text)', textAlign: 'right', fontWeight: 500 }}>{isJoined ? `${doneEasy}/${numEasy}` : `-/${numEasy}`}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: 16, alignItems: 'center' }}>
                <span style={{ fontSize: 14, color: '#FBBF24', fontWeight: 600 }}>Med</span>
                <span style={{ fontSize: 14, color: 'var(--text)', textAlign: 'right', fontWeight: 500 }}>{isJoined ? `${doneMed}/${numMed}` : `-/${numMed}`}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: 16, alignItems: 'center' }}>
                <span style={{ fontSize: 14, color: '#F87171', fontWeight: 600 }}>Hard</span>
                <span style={{ fontSize: 14, color: 'var(--text)', textAlign: 'right', fontWeight: 500 }}>{isJoined ? `${doneHard}/${numHard}` : `-/${numHard}`}</span>
              </div>
            </div>
            
            <div style={{ position: 'relative', width: 120, height: 120 }}>
              <svg width="120" height="120" viewBox="0 0 100 100">
                {renderArc(easyStart, easyAngle, '#34D399', 1, true)}
                {renderArc(medStart, medAngle, '#FBBF24', 1, true)}
                {renderArc(hardStart, hardAngle, '#F87171', 1, true)}

                {isJoined && renderArc(easyStart, easyAngle, '#34D399', numEasy > 0 ? doneEasy/numEasy : 0, false)}
                {isJoined && renderArc(medStart, medAngle, '#FBBF24', numMed > 0 ? doneMed/numMed : 0, false)}
                {isJoined && renderArc(hardStart, hardAngle, '#F87171', numHard > 0 ? doneHard/numHard : 0, false)}
              </svg>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'baseline' }}>
                  {isJoined ? completedTasks : 0}<span style={{ fontSize: 13, color: '#888', fontWeight: 600, marginLeft: 2 }}>/{totalTasks}</span>
                </div>
                <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>Solved</div>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--glass)', borderRadius: 8, padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', border: '1px solid var(--border)' }}>
            <span>{activeRoadmapDef?.icon || '🚀'}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{activeRoadmapDef?.label || 'Roadmap'}</span>
            <span style={{ fontSize: 10, color: '#888' }}>▼</span>
          </div>
        </div>
      </div>
    );
  }

  const renderTask = (task, isPast, isSelected = false) => {
    const isDone = done && done[task.id];
    const checkboxColor = '#A78BFA'; // Soft purple for checkbox
    
    return (
      <div 
        key={task.id} 
        className="interactable" 
        onClick={() => { if (typeof toggleTaskDone === 'function') toggleTaskDone(task.id); }} 
        style={{ 
          background: 'var(--card)', 
          border: isSelected ? `1.5px solid ${checkboxColor}` : '1.5px solid var(--border)', 
          borderRadius: 12, 
          padding: '12px 14px', 
          cursor: 'pointer', 
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ 
            width: 20, height: 20, borderRadius: 6, 
            border: isDone ? 'none' : '1.5px solid var(--border)', 
            background: isDone ? checkboxColor : 'transparent', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            {isDone && <svg width="10" height="8" viewBox="0 0 12 10"><path d="M1 5L4.5 8.5L11 1" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
          <div>
            <div style={{ fontSize: 14, color: 'var(--text)', fontWeight: 600, marginBottom: 2, textDecoration: isDone ? 'line-through' : 'none', opacity: isDone ? 0.7 : 1 }}>{task.topic}</div>
            <div style={{ fontSize: 12, color: 'var(--sub)' }}>Week {task.week} • Day {task.day} {isPast && <span style={{ color: '#EF4444', marginLeft: 4 }}>(Overdue)</span>}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {task.isCustom && (
            <>
              <div 
                onClick={(e) => { e.stopPropagation(); if (typeof onEditCustomTask === 'function') onEditCustomTask(task); }} 
                style={{ color: 'var(--sub)', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                title="Edit Task"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </div>
              <div 
                onClick={(e) => { e.stopPropagation(); if (typeof onDeleteCustomTask === 'function') onDeleteCustomTask(task.id); }} 
                style={{ color: '#EF4444', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                title="Delete Task"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </div>
            </>
          )}
          {!task.isCustom && (
            <div style={{ color: 'var(--sub)', padding: '0 4px', fontSize: 18, cursor: 'pointer', fontWeight: 800, paddingBottom: 4 }}>⋮</div>
          )}
        </div>
      </div>
    );
  };

  const safePast = Array.isArray(incompletePastTasks) ? incompletePastTasks : [];
  // Filter out completed tasks from the sidebar display
  const safeToday = (Array.isArray(actualTodayTasks) ? actualTodayTasks : []).filter(t => !done[t.id]);
  const combinedList = [...safePast, ...safeToday];

  if (viewAll) {
    return (
      <div className="sidebar-right">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button className="interactable" onClick={() => setViewAll(false)} style={{ background: 'var(--glass)', border: 'none', color: 'var(--text)', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>All Tasks</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', flex: 1, paddingBottom: 24 }}>
          {combinedList.length === 0 ? <div style={{ color: 'var(--sub)', fontSize: 13, fontStyle: 'italic' }}>No pending tasks! 🎉</div> : combinedList.map(t => renderTask(t, safePast.includes(t)))}
        </div>
      </div>
    );
  }

  return (
    <div className="sidebar-right">
      <div style={{ display: 'flex', background: 'var(--glass)', borderRadius: 8, padding: 4, marginBottom: 24 }}>
        <div onClick={() => { setActiveTab('Overview'); setSelectedActivityDate?.(null); }} style={{ flex: 1, textAlign: 'center', padding: '6px', background: activeTab === 'Overview' ? 'var(--accent)' : 'transparent', borderRadius: 6, color: activeTab === 'Overview' ? '#fff' : 'var(--sub)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Overview</div>
        <div onClick={() => setActiveTab('Activity')} style={{ flex: 1, textAlign: 'center', padding: '6px', background: activeTab === 'Activity' ? 'var(--accent)' : 'transparent', borderRadius: 6, color: activeTab === 'Activity' ? '#fff' : 'var(--sub)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Activity</div>
      </div>

      {activeTab === 'Activity' ? (
        <ActivityFeed 
          doneMap={done} 
          allTasks={activeRaw} 
          TRACKS={TRACKS} 
          activeTracks={activeTracks} 
          targetDate={selectedActivityDate} 
        />
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px' }}>Tasks today</div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <button onClick={onOpenTaskModal} style={{ cursor: 'pointer', background: 'var(--accent)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>+ Add Task</button>
            </div>
          </div>
          <div style={{ fontSize: 15, color: 'var(--sub)', marginBottom: 16, fontWeight: 500 }}>Pending items</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {combinedList.length === 0 ? (
               <div style={{ color: 'var(--sub)', fontSize: 13, fontStyle: 'italic' }}>No pending tasks! 🎉</div>
            ) : (
               combinedList.slice(0, 5).map((t, idx) => {
                 // The image shows the first uncompleted task has a highlighted border
                 const firstUncompletedIdx = combinedList.findIndex(task => !(done && done[task.id]));
                 const isSelected = idx === firstUncompletedIdx;
                 return renderTask(t, safePast.includes(t), isSelected);
               })
            )}
          </div>

      <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Upcoming meetings</div>
        <div onClick={onOpenMeetingModal} style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}>New meeting</div>
      </div>

      {meetings?.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {meetings.slice(0, 5).map(m => {
            const mDate = new Date(`${m.date}T${m.time}`);
            const month = mDate.toLocaleString('default', { month: 'short' });
            const day = mDate.getDate();
            const timeStr = mDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return (
              <div key={m.id} style={{ background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: 8, padding: 16 }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(99,102,241,0.2)', color: 'var(--accent)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase' }}>{month}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, lineHeight: 1 }}>{day}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600, marginBottom: 4 }}>{m.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--sub)' }}>{timeStr} • {m.duration} min</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ color: 'var(--sub)', fontSize: 13, fontStyle: 'italic' }}>No upcoming meetings.</div>
      )}
      </>
      )}
    </div>
  );
}
