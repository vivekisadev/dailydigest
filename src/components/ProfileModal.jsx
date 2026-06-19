import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ProfileModal({ userProfile, onClose, onSave }) {
  const [profile, setProfile] = useState({
    name: userProfile?.name || '',
    email: userProfile?.email || '',
    avatar: userProfile?.avatar || ''
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
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Edit Profile</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--sub)', fontSize: 20, cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, color: 'var(--sub)', marginBottom: 8, display: 'block', fontWeight: 600 }}>Display Name</label>
            <input 
              type="text" 
              value={profile.name} 
              onChange={e => setProfile({ ...profile, name: e.target.value })}
              style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text)', fontSize: 14, outline: 'none' }}
              placeholder="Your Name"
            />
          </div>
          <div>
            <label style={{ fontSize: 13, color: 'var(--sub)', marginBottom: 8, display: 'block', fontWeight: 600 }}>Email Address</label>
            <input 
              type="email" 
              value={profile.email} 
              onChange={e => setProfile({ ...profile, email: e.target.value })}
              style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text)', fontSize: 14, outline: 'none' }}
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label style={{ fontSize: 13, color: 'var(--sub)', marginBottom: 8, display: 'block', fontWeight: 600 }}>Avatar (URL or Emoji)</label>
            <input 
              type="text" 
              value={profile.avatar} 
              onChange={e => setProfile({ ...profile, avatar: e.target.value })}
              style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text)', fontSize: 14, outline: 'none' }}
              placeholder="😎 or https://..."
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32 }}>
          <button onClick={onClose} style={{ padding: '10px 16px', borderRadius: 8, background: 'transparent', color: 'var(--sub)', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>Cancel</button>
          <button onClick={() => onSave(profile)} style={{ padding: '10px 20px', borderRadius: 8, background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>Save Changes</button>
        </div>
      </motion.div>
    </div>
  );
}
