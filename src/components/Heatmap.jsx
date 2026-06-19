import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

export default function Heatmap({ doneMap, onDateClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Build an activity map: "YYYY-MM-DD" -> count
  const activityMap = useMemo(() => {
    const map = {};
    Object.values(doneMap).forEach(val => {
      if (typeof val === 'string' || typeof val === 'number') {
        const d = new Date(val);
        if (!isNaN(d.getTime())) {
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          map[key] = (map[key] || 0) + 1;
        }
      }
    });
    return map;
  }, [doneMap]);

  // Generate days for the current month view
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const days = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return (
    <div style={{ width: '100%', color: 'var(--text)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={prevMonth} style={{ background: 'var(--glass)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 6, width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <button onClick={nextMonth} style={{ background: 'var(--glass)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 6, width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 8 }}>
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 11, color: 'var(--sub)', fontWeight: 600 }}>{d}</div>
        ))}
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
        {days.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} style={{ width: '100%', aspectRatio: '1/1' }} />;
          
          const key = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const count = activityMap[key] || 0;
          const isToday = key === todayKey;
          
          let bg = 'var(--glass)';
          if (count === 1) bg = '#064e3b';
          else if (count === 2) bg = '#065f46';
          else if (count === 3) bg = '#047857';
          else if (count >= 4) bg = '#10b981';

          return (
            <motion.div 
              key={idx}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.008 }}
              onClick={() => onDateClick?.(key)}
              style={{
                width: '100%',
                aspectRatio: '1/1',
                background: bg,
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                fontWeight: count > 0 ? 700 : 500,
                color: count > 0 ? '#fff' : 'var(--sub)',
                border: isToday ? '2px solid var(--accent)' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: count > 0 ? `0 2px 8px ${bg}66` : 'none'
              }}
              title={`${key}: ${count} tasks completed`}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
            >
              {day}
            </motion.div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, justifyContent: 'flex-end' }}>
        <span style={{ fontSize: 10, color: 'var(--sub)' }}>Less</span>
        {[
          'var(--glass)',
          '#064e3b',
          '#065f46',
          '#047857',
          '#10b981'
        ].map((c, i) => (
          <div key={i} style={{ width: 12, height: 12, borderRadius: 3, background: c, border: '1px solid var(--border)' }} />
        ))}
        <span style={{ fontSize: 10, color: 'var(--sub)' }}>More</span>
      </div>
    </div>
  );
}
