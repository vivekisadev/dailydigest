import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function TaskModal({ onClose, onSave, activeTracks, TRACKS, editTask }) {
  const getInitialState = () => {
    if (editTask) {
      return {
        id: editTask.id,
        name: editTask.topic || '',
        desc: editTask.desc || '',
        track: editTask.track || 0,
        priority: editTask.priority || 'Medium',
        scheduleType: editTask.scheduleType || 'date',
        date: editTask.date || new Date().toISOString().split('T')[0],
        selectedDays: editTask.repeatDays || [0]
      };
    }
    return { 
      name: '', desc: '', track: activeTracks?.[0]?.id || TRACKS?.[0]?.id || 0, 
      priority: 'Medium', scheduleType: 'date', date: new Date().toISOString().split('T')[0], selectedDays: [0] 
    };
  };

  const [newTask, setNewTask] = useState(getInitialState());
  
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
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', margin: 0 }}>{editTask ? 'Edit Task' : 'Create New Task'}</h2>
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
              <label style={{ fontSize: 13, color: 'var(--sub)', marginBottom: 8, display: 'block', fontWeight: 600 }}>Schedule Type</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button 
                  onClick={() => setNewTask({ ...newTask, scheduleType: 'date' })}
                  style={{ 
                    flex: 1, padding: '10px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    background: newTask.scheduleType === 'date' ? 'var(--accent)' : 'var(--glass)',
                    color: newTask.scheduleType === 'date' ? '#fff' : 'var(--text)',
                    border: newTask.scheduleType === 'date' ? '1px solid transparent' : '1px solid var(--border)',
                    transition: 'all 0.2s'
                  }}
                >
                  One-Time
                </button>
                <button 
                  onClick={() => setNewTask({ ...newTask, scheduleType: 'repeat' })}
                  style={{ 
                    flex: 1, padding: '10px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    background: newTask.scheduleType === 'repeat' ? 'var(--accent)' : 'var(--glass)',
                    color: newTask.scheduleType === 'repeat' ? '#fff' : 'var(--text)',
                    border: newTask.scheduleType === 'repeat' ? '1px solid transparent' : '1px solid var(--border)',
                    transition: 'all 0.2s'
                  }}
                >
                  Repeating
                </button>
              </div>
            </div>
          </div>

          <div>
            {newTask.scheduleType === 'date' ? (
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, color: 'var(--sub)', marginBottom: 8, display: 'block', fontWeight: 600 }}>Date</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input 
                    type="date"
                    value={newTask.date}
                    onChange={e => setNewTask({ ...newTask, date: e.target.value })}
                    style={{ flex: 1, padding: '10.5px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text)', fontSize: 14, outline: 'none' }}
                  />
                  <button 
                    onClick={() => setNewTask({ ...newTask, date: new Date().toISOString().split('T')[0] })}
                    style={{ padding: '0 16px', borderRadius: 8, background: 'var(--glass)', color: 'var(--text)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
                  >
                    Today
                  </button>
                  <button 
                    onClick={() => {
                      const tmrw = new Date();
                      tmrw.setDate(tmrw.getDate() + 1);
                      setNewTask({ ...newTask, date: tmrw.toISOString().split('T')[0] });
                    }}
                    style={{ padding: '0 16px', borderRadius: 8, background: 'var(--glass)', color: 'var(--text)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
                  >
                    Tomorrow
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, color: 'var(--sub)', marginBottom: 12, display: 'block', fontWeight: 600 }}>Select Days</label>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => {
                    const isSelected = newTask.selectedDays.includes(i);
                    return (
                      <button 
                        key={i}
                        onClick={() => {
                          const newDays = isSelected 
                            ? newTask.selectedDays.filter(day => day !== i)
                            : [...newTask.selectedDays, i];
                          if (newDays.length > 0) {
                            setNewTask({ ...newTask, selectedDays: newDays });
                          }
                        }}
                        style={{ 
                          width: 40, height: 40, flexShrink: 0, borderRadius: '50%', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                          background: isSelected ? 'var(--accent)' : 'var(--glass)',
                          color: isSelected ? '#fff' : 'var(--sub)',
                          border: isSelected ? 'none' : '1px solid var(--border)',
                          transition: 'all 0.2s ease',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
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
            {editTask ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
