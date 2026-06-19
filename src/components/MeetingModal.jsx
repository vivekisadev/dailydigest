import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function MeetingModal({ onClose, onSave }) {
  const [meeting, setMeeting] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    link: '',
    duration: 30
  });

  return (
    <div className="modal-overlay" onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div 
        className="modal" 
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        style={{ width: '100%', maxWidth: 400, background: 'var(--card-solid)', borderRadius: 16, padding: 24, boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Add Meeting</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--sub)', fontSize: 20, cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, color: 'var(--sub)', marginBottom: 8, display: 'block', fontWeight: 600 }}>Meeting Title</label>
            <input 
              type="text" 
              value={meeting.title} 
              onChange={e => setMeeting({ ...meeting, title: e.target.value })}
              style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text)', fontSize: 14, outline: 'none' }}
              placeholder="e.g. Sync with team"
            />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13, color: 'var(--sub)', marginBottom: 8, display: 'block', fontWeight: 600 }}>Date</label>
              <input 
                type="date" 
                value={meeting.date} 
                onChange={e => setMeeting({ ...meeting, date: e.target.value })}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text)', fontSize: 14, outline: 'none' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13, color: 'var(--sub)', marginBottom: 8, display: 'block', fontWeight: 600 }}>Time</label>
              <input 
                type="time" 
                value={meeting.time} 
                onChange={e => setMeeting({ ...meeting, time: e.target.value })}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text)', fontSize: 14, outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13, color: 'var(--sub)', marginBottom: 8, display: 'block', fontWeight: 600 }}>Duration (min)</label>
              <select 
                value={meeting.duration} 
                onChange={e => setMeeting({ ...meeting, duration: parseInt(e.target.value) })}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text)', fontSize: 14, outline: 'none' }}
              >
                {[15, 30, 45, 60, 90, 120].map(m => <option key={m} value={m}>{m} minutes</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: 13, color: 'var(--sub)', marginBottom: 8, display: 'block', fontWeight: 600 }}>Meeting Link (optional)</label>
            <input 
              type="text" 
              value={meeting.link} 
              onChange={e => setMeeting({ ...meeting, link: e.target.value })}
              style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text)', fontSize: 14, outline: 'none' }}
              placeholder="https://zoom.us/j/..."
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32 }}>
          <button onClick={onClose} style={{ padding: '10px 16px', borderRadius: 8, background: 'transparent', color: 'var(--sub)', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>Cancel</button>
          <button 
            onClick={() => {
              if (!meeting.title.trim()) return;
              onSave({ ...meeting, id: `meeting_${Date.now()}` });
            }} 
            style={{ padding: '10px 20px', borderRadius: 8, background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}
          >
            Add Meeting
          </button>
        </div>
      </motion.div>
    </div>
  );
}
