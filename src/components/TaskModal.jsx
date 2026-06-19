import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function TaskModal({ onClose, onSave, activeTracks, TRACKS }) {
  const [newTask, setNewTask] = useState({ name: '', desc: '', track: activeTracks?.[0]?.id || TRACKS?.[0]?.id || 0, priority: 'Medium', week: 1, day: 0 });
  
  const DAYS = ["Day 1 (Mon)", "Day 2 (Tue)", "Day 3 (Wed)", "Day 4 (Thu)", "Day 5 (Fri)", "Day 6 (Sat)", "Day 7 (Sun)"];
  const maxWeeks = 12; // default to 12 weeks for generic custom task

  // Fallback to TRACKS if activeTracks is not available
  const trackList = activeTracks || TRACKS || [];

  return (
    <div className="modal-overlay" onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div 
        className="modal" 
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        style={{ width: '100%', maxWidth: 450, background: 'var(--card-solid)', borderRadius: 16, padding: 24, boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Create New Task</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--sub)', fontSize: 20, cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, color: 'var(--sub)', marginBottom: 8, display: 'block', fontWeight: 600 }}>Task Name</label>
            <input 
              type="text" 
              value={newTask.name} 
              onChange={e => setNewTask({ ...newTask, name: e.target.value })}
              style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text)', fontSize: 14, outline: 'none' }}
              placeholder="Enter task name..."
            />
          </div>
          <div>
            <label style={{ fontSize: 13, color: 'var(--sub)', marginBottom: 8, display: 'block', fontWeight: 600 }}>Description</label>
            <textarea 
              value={newTask.desc} 
              onChange={e => setNewTask({ ...newTask, desc: e.target.value })}
              style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text)', fontSize: 14, outline: 'none', minHeight: 80, resize: 'vertical' }}
              placeholder="Add description..."
            />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13, color: 'var(--sub)', marginBottom: 8, display: 'block', fontWeight: 600 }}>Week</label>
              <select 
                value={newTask.week} 
                onChange={e => setNewTask({ ...newTask, week: parseInt(e.target.value) })}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text)', fontSize: 14, outline: 'none' }}
              >
                {[...Array(maxWeeks)].map((_, i) => <option key={i+1} value={i+1}>Week {i+1}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13, color: 'var(--sub)', marginBottom: 8, display: 'block', fontWeight: 600 }}>Day</label>
              <select 
                value={newTask.day} 
                onChange={e => setNewTask({ ...newTask, day: parseInt(e.target.value) })}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text)', fontSize: 14, outline: 'none' }}
              >
                {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: 13, color: 'var(--sub)', marginBottom: 8, display: 'block', fontWeight: 600 }}>Track (Category)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {trackList.map(tr => (
                <button 
                  key={tr.id} 
                  onClick={() => setNewTask({ ...newTask, track: tr.id })}
                  style={{ 
                    flex: '1 1 30%', padding: '8px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    background: newTask.track === tr.id ? tr.color : 'transparent',
                    color: newTask.track === tr.id ? '#0A0A0F' : tr.color,
                    border: `1px solid ${tr.color}`,
                    transition: 'all 0.2s'
                  }}
                >
                  {tr.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: 13, color: 'var(--sub)', marginBottom: 8, display: 'block', fontWeight: 600 }}>Priority</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {["Low", "Medium", "High"].map(p => {
                const colors = { Low: "var(--green)", Medium: "var(--yellow)", High: "var(--red)" };
                const c = colors[p];
                return (
                  <button 
                    key={p} 
                    onClick={() => setNewTask({ ...newTask, priority: p })}
                    style={{ 
                      flex: 1, padding: '8px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      background: newTask.priority === p ? c : 'transparent',
                      color: newTask.priority === p ? '#0A0A0F' : c,
                      border: `1px solid ${c}`,
                      transition: 'all 0.2s'
                    }}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32 }}>
          <button onClick={onClose} style={{ padding: '10px 16px', borderRadius: 8, background: 'transparent', color: 'var(--sub)', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>Cancel</button>
          <button 
            onClick={() => {
              if (!newTask.name.trim()) return; // Needs toast handling, but ignoring for now
              onSave(newTask);
            }} 
            style={{ padding: '10px 20px', borderRadius: 8, background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}
          >
            Create Task
          </button>
        </div>
      </motion.div>
    </div>
  );
}
