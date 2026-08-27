import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { TRACKS } from '../data';

export default function MonthCalendarView({ allTasks, startDate, onNodeClick, onDateClick }) {
  const [currentDate, setCurrentDate] = useState(new Date(startDate || new Date()));

  // Derived state for calendar grid
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Create real dates for tasks based on user startDate
  const taskMap = useMemo(() => {
    const map = {};
    const baseDate = new Date(startDate || new Date());
    // Zero out time for baseDate
    baseDate.setHours(0, 0, 0, 0);

    allTasks.forEach(task => {
      const w = task.week || task[0] || 1;
      const d = task.day !== undefined ? task.day : (task[1] || 0);
      
      const totalDaysOffset = (w - 1) * 7 + d;
      
      const taskDate = new Date(baseDate);
      taskDate.setDate(baseDate.getDate() + totalDaysOffset);
      
      const dateKey = `${taskDate.getFullYear()}-${taskDate.getMonth()}-${taskDate.getDate()}`;
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(task);
    });
    return map;
  }, [allTasks, startDate]);

  // Navigate functions
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const goToday = () => setCurrentDate(new Date());

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Generate grid cells
  const cells = [];
  
  // Previous month padding
  for (let i = 0; i < firstDayOfMonth; i++) {
    cells.push({
      date: daysInPrevMonth - firstDayOfMonth + i + 1,
      isCurrentMonth: false,
      dateKey: `${month === 0 ? year - 1 : year}-${month === 0 ? 11 : month - 1}-${daysInPrevMonth - firstDayOfMonth + i + 1}`
    });
  }
  
  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({
      date: i,
      isCurrentMonth: true,
      dateKey: `${year}-${month}-${i}`
    });
  }
  
  // Next month padding to complete the last row
  const remainingCells = (7 - (cells.length % 7)) % 7;
  for (let i = 1; i <= remainingCells; i++) {
    cells.push({
      date: i,
      isCurrentMonth: false,
      dateKey: `${month === 11 ? year + 1 : year}-${month === 11 ? 0 : month + 1}-${i}`
    });
  }

  // Fallback track colors if TRACKS is missing or out of bounds
  const getTrackColor = (trackId) => {
    const track = TRACKS.find(t => t.id === trackId);
    return track ? track.color : "#6366f1";
  };

  return (
    <div className="full-calendar-root" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Calendar Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: 8, padding: '4px 12px' }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--sub)', textTransform: 'uppercase' }}>{monthNames[month].substring(0, 3)}</span>
            <span style={{ fontSize: 18, fontWeight: 700 }}>{new Date().getDate()}</span>
          </div>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              {monthNames[month]} {year}
            </h2>
            <div style={{ fontSize: 13, color: 'var(--sub)' }}>{monthNames[month]} 1, {year} – {monthNames[month]} {daysInMonth}, {year}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button style={{ background: 'transparent', border: 'none', color: 'var(--sub)', cursor: 'pointer', padding: 8 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
          
          <div style={{ display: 'flex', background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
            <button onClick={prevMonth} style={{ background: 'transparent', border: 'none', borderRight: '1px solid var(--border)', padding: '8px 12px', cursor: 'pointer', color: 'var(--text)' }}>
              <ChevronLeft size={16} />
            </button>
            <button onClick={goToday} style={{ background: 'transparent', border: 'none', borderRight: '1px solid var(--border)', padding: '8px 16px', fontWeight: 600, fontSize: 14, cursor: 'pointer', color: 'var(--text)' }}>
              Today
            </button>
            <button onClick={nextMonth} style={{ background: 'transparent', border: 'none', padding: '8px 12px', cursor: 'pointer', color: 'var(--text)' }}>
              <ChevronRight size={16} />
            </button>
          </div>

          <div style={{ padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, fontWeight: 600, background: 'var(--glass)', cursor: 'pointer' }}>
            Month view 
          </div>

          <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={16} />
            Add event
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border)' }}>
        {/* Day Headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--border)' }}>
          {dayNames.map(day => (
            <div key={day} style={{ padding: '12px 0', textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--sub)' }}>
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: '1fr', overflowY: 'auto' }}>
          {cells.map((cell, idx) => {
            const isToday = new Date().getDate() === cell.date && new Date().getMonth() === month && new Date().getFullYear() === year && cell.isCurrentMonth;
            const tasksForDay = taskMap[cell.dateKey] || [];

            return (
              <div key={idx} 
                onClick={() => {
                  if (onDateClick) onDateClick(cell.dateKey);
                }}
                style={{ 
                borderRight: '1px solid var(--border)', 
                borderBottom: '1px solid var(--border)', 
                padding: '8px',
                background: cell.isCurrentMonth ? 'transparent' : 'rgba(0,0,0,0.02)',
                minHeight: 120,
                display: 'flex', flexDirection: 'column',
                cursor: onDateClick ? 'pointer' : 'default'
              }}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 8 }}>
                  <span style={{ 
                    fontSize: 13, 
                    fontWeight: 600, 
                    color: cell.isCurrentMonth ? (isToday ? '#fff' : 'var(--text)') : 'var(--sub)',
                    background: isToday ? '#8b5cf6' : 'transparent',
                    width: 24, height: 24, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    borderRadius: '50%' 
                  }}>
                    {cell.date}
                  </span>
                </div>
                
                {/* Events */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, overflowY: 'auto' }}>
                  {tasksForDay.map((task, i) => {
                    const tColor = getTrackColor(task.track || task[2]);
                    return (
                      <div 
                        key={i} 
                        onClick={(e) => { e.stopPropagation(); onNodeClick(task); }}
                        style={{ 
                          fontSize: 11, fontWeight: 600,
                          padding: '4px 6px', borderRadius: 4,
                          background: `color-mix(in srgb, ${tColor} 20%, transparent)`,
                          color: tColor,
                          border: `1px solid color-mix(in srgb, ${tColor} 40%, transparent)`,
                          cursor: 'pointer',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}
                      >
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.topic || task[3]}</span>
                        <span style={{ flexShrink: 0, opacity: 0.8, fontSize: 10 }}>{(task.hrs || task[5])}h</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
