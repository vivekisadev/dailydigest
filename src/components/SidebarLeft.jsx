import React from 'react';
import { ROADMAPS } from '../data';

export default function SidebarLeft({ tab, setTab, roadmapTrack, setRoadmapTrack, joinedRoadmaps, switchRoadmap, activeRoadmap, isOpen, isHidden }) {
  const isNavActive = (id) => tab === id && roadmapTrack === null;

  const NavItem = ({ icon, label, isActive, onClick }) => (
    <div 
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', 
        borderRadius: '8px', cursor: 'pointer',
        background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
        color: isActive ? 'var(--text)' : 'var(--sub)',
        fontWeight: isActive ? 600 : 500,
        fontSize: 14, transition: 'all 0.2s'
      }}
    >
      <span style={{ fontSize: 16 }}>{icon}</span>
      {label}
    </div>
  );

  const classes = ['sidebar-left'];
  if (isOpen) classes.push('mobile-open');
  else if (isHidden) classes.push('sidebar-hidden');

  return (
    <div className={classes.join(' ')}>
      <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', marginBottom: 24 }}>
        <div style={{ width: 32, height: 32, background: 'var(--accent)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>✓</div>
        <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>StudyTrack</span>
      </div>

      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#555', letterSpacing: '0.05em', margin: '0 14px 12px' }}>Overview</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 24 }}>
        <NavItem icon="🏠" label="Home" isActive={isNavActive('home')} onClick={() => { setTab('home'); setRoadmapTrack(null); }} />
        <NavItem icon="🔔" label="Activity" isActive={isNavActive('notif')} onClick={() => { setTab('notif'); setRoadmapTrack(null); }} />
        <NavItem icon="📅" label="Calendar" isActive={isNavActive('calendar')} onClick={() => { setTab('calendar'); setRoadmapTrack(null); }} />
      </div>

      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#555', letterSpacing: '0.05em', margin: '0 14px 12px' }}>Development</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div 
          className="interactable"
          onClick={() => setTab('discover')}
          style={{ padding: '8px 14px', fontSize: 14, fontWeight: 600, color: '#aaa', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>📁</span> Roadmaps
          </div>
          <span>⌄</span>
        </div>
        
        <div style={{ paddingLeft: 36, display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
          {Object.keys(joinedRoadmaps || {}).map((rmId) => {
            const rm = ROADMAPS.find(r => r.id === rmId);
            if (!rm) return null;
            const isActive = activeRoadmap === rmId;
            return (
              <div 
                key={rmId} 
                onClick={() => { switchRoadmap(rmId); setTab('roadmap'); setRoadmapTrack(0); }} 
                style={{ 
                  padding: '8px 12px', fontSize: 13, borderRadius: 6, cursor: 'pointer',
                  color: isActive ? '#fff' : '#777',
                  background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                  fontWeight: isActive ? 600 : 500
                }}
              >
                {rm.label}
              </div>
            );
          })}
        </div>
      </div>
      
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 12, padding: '16px 14px' }}>
         <div style={{ fontSize: 10, color: '#444' }}>ver.3.214.000</div>
      </div>
    </div>
  );
}
