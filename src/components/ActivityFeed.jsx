import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function ActivityFeed({ doneMap, allTasks, TRACKS, activeTracks, targetDate = null }) {
  const activities = useMemo(() => {
    return Object.entries(doneMap || {}).filter(([id, timestamp]) => {
      if (!timestamp) return false;
      // Timestamps can be ISO strings or epoch numbers
      const ts = typeof timestamp === 'number' ? new Date(timestamp).toISOString() : String(timestamp);
      if (targetDate) {
        return ts.startsWith(targetDate);
      }
      return true;
    }).map(([id, timestamp]) => {
      const task = allTasks?.find(t => t.id === id) || { id, topic: id.split(':').pop()?.replace(/-/g, ' ') || 'Task', track: 0 };
      const completedAt = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp);
      return { ...task, completedAt };
    }).filter(a => !isNaN(a.completedAt.getTime()))
      .sort((a, b) => b.completedAt - a.completedAt);
  }, [doneMap, allTasks, targetDate]);

  const today = new Date().toISOString().split('T')[0];
  const displayDate = targetDate === today ? 'Today' : targetDate;

  // Group activities by date for better display
  const groupedByDate = useMemo(() => {
    if (targetDate) return null; // Don't group when filtering by specific date
    const groups = {};
    activities.forEach(a => {
      const dateKey = a.completedAt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(a);
    });
    return groups;
  }, [activities, targetDate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Header */}
      {targetDate && (
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: 10, 
          padding: '12px 16px', 
          background: 'var(--accent-glow)', 
          borderRadius: 12, 
          marginBottom: 8,
          border: '1px solid var(--border-accent)'
        }}>
          <div style={{ 
            width: 32, height: 32, borderRadius: 10, 
            background: 'var(--accent)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14
          }}>📅</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
              {displayDate}
            </div>
            <div style={{ fontSize: 11, color: 'var(--sub)' }}>
              {activities.length} {activities.length === 1 ? 'task' : 'tasks'} completed
            </div>
          </div>
        </div>
      )}

      {activities.length === 0 ? (
        <div style={{ 
          textAlign: 'center', padding: '40px 20px', 
          color: 'var(--sub)', fontSize: 13 
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🌙</div>
          <div style={{ fontWeight: 600, marginBottom: 4, color: 'var(--text)' }}>
            {targetDate ? 'No activity on this date' : 'No recent activity'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--sub)' }}>
            {targetDate ? 'Try selecting a different date from the calendar.' : 'Complete tasks to see your progress here.'}
          </div>
        </div>
      ) : targetDate ? (
        // Single date view - flat list
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {activities.map((t, i) => {
            const tr = activeTracks?.[t.track] || TRACKS?.[t.track] || TRACKS?.[0] || { color: 'var(--accent)', label: 'General' };
            return (
              <motion.div 
                key={t.id} 
                initial={{ opacity: 0, x: -8 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: i * 0.04 }}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: 12, 
                  background: 'var(--glass)', 
                  border: '1px solid var(--glass-border)', 
                  padding: '14px 16px', borderRadius: 12,
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ 
                  width: 34, height: 34, borderRadius: 10, 
                  background: `${tr.color}15`, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, flexShrink: 0
                }}>✅</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {t.topic}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--sub)' }}>
                    {tr.label} • {t.completedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div style={{ 
                  padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700,
                  background: 'rgba(16,185,129,0.1)', color: '#10b981'
                }}>DONE</div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        // All activities - grouped by date
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {Object.entries(groupedByDate || {}).slice(0, 5).map(([date, tasks]) => (
            <div key={date}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--sub)', letterSpacing: '0.05em', marginBottom: 8, paddingLeft: 4 }}>
                {date}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {tasks.map((t, i) => {
                  const tr = activeTracks?.[t.track] || TRACKS?.[t.track] || TRACKS?.[0] || { color: 'var(--accent)', label: 'General' };
                  return (
                    <motion.div 
                      key={t.id}
                      initial={{ opacity: 0, y: 4 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: i * 0.03 }}
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: 10, 
                        padding: '10px 12px', borderRadius: 10,
                        background: 'var(--glass)',
                        border: '1px solid var(--glass-border)'
                      }}
                    >
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: tr.color, flexShrink: 0 }} />
                      <div style={{ flex: 1, fontSize: 13, color: 'var(--text)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {t.topic}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--muted)', flexShrink: 0 }}>
                        {t.completedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
