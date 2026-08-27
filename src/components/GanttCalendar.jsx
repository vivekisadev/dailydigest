import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MonthCalendarView from './MonthCalendarView';

export default function GanttCalendar({ allTasks, doneMap, onNodeClick, startDate, onDateClick }) {
  const [viewMode, setViewMode] = useState('month'); // Default to month view

  // Group tasks by Week and Day
  const groupedTasks = {};
  
  allTasks.forEach(task => {
    const w = task.week || task[0] || 1;
    const d = task.day !== undefined ? task.day : (task[1] || 0);
    const dayKey = `Week ${w} - Day ${d + 1}`;
    
    if (!groupedTasks[dayKey]) groupedTasks[dayKey] = { w, d, label: dayKey, tasks: [] };
    groupedTasks[dayKey].tasks.push(task);
  });

  const columns = Object.values(groupedTasks).sort((a, b) => {
    if (a.w === b.w) return a.d - b.d;
    return a.w - b.w;
  });

  const scrollRef = React.useRef(null);
  const handleScroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 324, behavior: 'smooth' });
    }
  };

  return (
    <div className="gantt-calendar-root" style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', color: 'var(--text)', background: 'var(--bg)', overflow: 'hidden', minHeight: 0 }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px', borderBottom: '1px solid var(--border)' }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--sub)', marginBottom: 4 }}>Calendar / <span style={{ color: 'var(--text-secondary)' }}>Timeline</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: '-0.02em', color: 'var(--text)' }}>Calendar</h1>
            <div style={{ display: 'flex', background: 'var(--glass)', borderRadius: 8, padding: 4 }}>
              <button 
                onClick={() => setViewMode('month')}
                style={{ 
                  background: viewMode === 'month' ? 'var(--card-solid)' : 'transparent',
                  color: viewMode === 'month' ? 'var(--text)' : 'var(--sub)',
                  border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  boxShadow: viewMode === 'month' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                Month
              </button>
              <button 
                onClick={() => setViewMode('timeline')}
                style={{ 
                  background: viewMode === 'timeline' ? 'var(--card-solid)' : 'transparent',
                  color: viewMode === 'timeline' ? 'var(--text)' : 'var(--sub)',
                  border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  boxShadow: viewMode === 'timeline' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                Timeline
              </button>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'month' ? (
        <MonthCalendarView allTasks={allTasks} startDate={startDate} onNodeClick={onNodeClick} onDateClick={onDateClick} />
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'var(--sub)' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            <button onClick={() => handleScroll(-1)} style={{ background: 'var(--glass)', border: '1px solid var(--border)', color: 'var(--text)', width: 28, height: 28, borderRadius: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button onClick={() => handleScroll(1)} style={{ background: 'var(--glass)', border: '1px solid var(--border)', color: 'var(--text)', width: 28, height: 28, borderRadius: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
          <span>Roadmap Schedule</span>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--sub)' }}>
          <span style={{ cursor: 'pointer' }}>▽ Filter</span>
          <span style={{ cursor: 'pointer' }}>⇌ Sort</span>
        </div>
      </div>

      {/* Grid Area */}
      <div ref={scrollRef} style={{ flex: 1, overflowX: 'auto', overflowY: 'hidden', display: 'flex', padding: '24px 32px', gap: 24, scrollBehavior: 'smooth', minHeight: 0 }}>
        {columns.map((col, cIdx) => (
          <div key={col.label} style={{ flex: '0 0 300px', display: 'flex', flexDirection: 'column' }}>
            {/* Column Header */}
            <div style={{ marginBottom: 16, fontSize: 14, fontWeight: 600, color: 'var(--sub)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{col.label}</span>
              <span style={{ background: 'var(--glass)', padding: '2px 8px', borderRadius: 12, fontSize: 11, color: 'var(--sub)' }}>{col.tasks.length}</span>
            </div>

            {/* Tasks container */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, paddingRight: 4, paddingBottom: 32 }}>
              {col.tasks.map((task, i) => {
                const topic = task.topic || task[3] || 'Task';
                const sub = task.sub || task[4] || '';
                const hrs = task.hrs || task[5] || 2;
                const isDone = !!doneMap[task.id];
                
                return (
                  <motion.div 
                    key={task.id || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => onNodeClick && onNodeClick(task)}
                    style={{
                      background: 'var(--card)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid',
                      borderColor: isDone ? 'rgba(16, 185, 129, 0.2)' : 'var(--border)',
                      borderRadius: 12,
                      padding: 16,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 10, background: isDone ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99,102,241,0.1)', color: isDone ? '#10b981' : 'var(--accent)', padding: '2px 8px', borderRadius: 6, fontWeight: 600 }}>
                        {isDone ? 'DONE' : 'TO DO'}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--sub)' }}>{hrs} hrs</span>
                    </div>
                    
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 6, lineHeight: 1.4, wordBreak: 'break-word' }}>
                      {topic}
                    </div>
                    
                    {sub && (
                      <div style={{ fontSize: 12, color: 'var(--sub)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
                        {sub}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      </>
    )}
  </div>
);
}
