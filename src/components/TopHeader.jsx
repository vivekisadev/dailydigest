import React from 'react';

export default function TopHeader({ tab, onToggleSidebar, userProfile, toggleTheme, openProfileModal }) {
  return (
    <div className="top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {tab === 'roadmap' && (
          <button 
            onClick={onToggleSidebar}
            style={{ background: 'transparent', border: 'none', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            {userProfile?.avatar && userProfile.avatar.startsWith('http') ? (
              <img src={userProfile.avatar} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} alt="profile" />
            ) : (
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16 }}>
                {userProfile?.avatar || userProfile?.name?.[0] || 'U'}
              </div>
            )}
          </button>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '400px', background: 'var(--glass)', borderRadius: 8, padding: '8px 16px', border: '1px solid var(--border)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--sub)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
          <input type="text" placeholder="Search (⌘ + S)" style={{ background: 'transparent', border: 'none', color: 'var(--text)', fontSize: 13, outline: 'none', width: '100%' }} />
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', color: 'var(--sub)', cursor: 'pointer' }}>
          {userProfile?.theme === 'light' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
          )}
        </button>
        <div style={{ width: 1, height: 24, background: 'var(--border)', margin: '0 8px' }}></div>
        <button style={{ position: 'relative', background: 'transparent', border: 'none', color: 'var(--sub)', cursor: 'pointer' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
          <div style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: 'var(--yellow)', borderRadius: '50%' }}></div>
        </button>

      </div>
    </div>
  );
}
