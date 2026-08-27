import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROADMAPS } from '../data';
import { LayoutDashboard, Calendar, Map, Activity, Search, MoreHorizontal, ChevronDown, ChevronRight } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';

const DashboardIcon = () => <LayoutDashboard size={20} />;
const CalendarIcon = () => <Calendar size={20} />;
const RoadmapIcon = () => <Map size={20} />;
const ActivityIcon = () => <Activity size={20} />;

export default function SidebarLeft({ tab, setTab, roadmapTrack, setRoadmapTrack, joinedRoadmaps, switchRoadmap, activeRoadmap, isOpen, isCollapsed, userProfile, openProfileModal, onLogout }) {
  const isNavActive = (id) => tab === id && roadmapTrack === null;
  const [roadmapsOpen, setRoadmapsOpen] = useState(true);

  // Group wrapper mimicking Shadcn SidebarGroup
  const SidebarGroup = ({ children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 12px', marginTop: 16 }}>
      {children}
    </div>
  );

  const SidebarGroupLabel = ({ children }) => (
    <div style={{
      fontSize: 12, fontWeight: 600, color: 'var(--sub)', textTransform: 'uppercase',
      letterSpacing: '0.05em', padding: '0 14px', marginBottom: 8,
      opacity: isCollapsed ? 0 : 1, transition: 'opacity 0.2s',
      whiteSpace: 'nowrap', overflow: 'hidden'
    }}>
      {children}
    </div>
  );

  const NavItem = ({ icon, label, isActive, onClick }) => {
    const [hover, setHover] = useState(false);
    return (
      <div 
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        title={isCollapsed ? label : ""}
        style={{
          display: 'flex', alignItems: 'center', 
          padding: isCollapsed ? '10px 0' : '10px 14px', 
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          borderRadius: '8px', cursor: 'pointer',
          background: isActive ? 'var(--glass)' : (hover ? 'var(--hover)' : 'transparent'),
          color: isActive ? 'var(--text)' : (hover ? 'var(--text)' : 'var(--sub)'),
          fontWeight: isActive ? 600 : 500,
          fontSize: 15, 
          transition: 'all 0.2s ease',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: isActive ? 'var(--text)' : 'inherit',
          transition: 'transform 0.2s ease',
          transform: hover && !isActive ? 'scale(1.05)' : 'scale(1)',
          minWidth: 20,
          marginRight: isCollapsed ? 0 : 14
        }}>
          {icon}
        </div>
        <motion.span 
          initial={false}
          animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : 'auto' }}
          style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
        >
          {label}
        </motion.span>
      </div>
    );
  };

  const SubItem = ({ label, count, isActive, onClick }) => {
    const [hover, setHover] = useState(false);
    return (
      <div 
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        title={isCollapsed ? label : ""}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
          padding: '8px 14px 8px 48px', 
          borderRadius: '8px', cursor: 'pointer',
          background: isActive ? 'var(--glass)' : (hover ? 'var(--hover)' : 'transparent'),
          color: isActive ? 'var(--text)' : (hover ? 'var(--text)' : 'var(--sub)'),
          fontWeight: 500,
          fontSize: 14, 
          transition: 'all 0.2s ease',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          display: isCollapsed ? 'none' : 'flex'
        }}
      >
        <span style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{label}</span>
        {count !== undefined && count !== "" && (
          <span style={{ background: isActive ? 'var(--glass)' : 'transparent', color: isActive ? 'var(--text)' : 'var(--sub)', fontSize: 12, padding: '2px 8px', borderRadius: 12 }}>
            {count}
          </span>
        )}
      </div>
    );
  };

  const classes = ['sidebar-left'];
  if (isOpen) classes.push('mobile-open');

  return (
    <div className={classes.join(' ')} style={{ width: isCollapsed ? 72 : 250, transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)', flexShrink: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* 1. PROFILE HEADER */}
      <div style={{ padding: '20px 16px 0', marginBottom: 8 }}>
        <ProfileDropdown 
          userProfile={userProfile} 
          isCollapsed={isCollapsed} 
          openProfileModal={openProfileModal} 
          onLogout={onLogout} 
        />
      </div>

      {/* SCROLLABLE NAV CONTENT */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '0 16px 20px', display: 'flex', flexDirection: 'column' }}>
        {/* MAIN NAV */}
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <NavItem icon={<DashboardIcon />} label="Dashboard" isActive={isNavActive('home')} onClick={() => { setTab('home'); setRoadmapTrack(null); }} />
          <NavItem icon={<CalendarIcon />} label="Calendar" isActive={isNavActive('calendar')} onClick={() => { setTab('calendar'); setRoadmapTrack(null); }} />
        </SidebarGroup>

        {/* ROADMAPS GROUP */}
        <SidebarGroup>
          <SidebarGroupLabel>Learning Paths</SidebarGroupLabel>
          <div 
            onClick={() => isCollapsed ? setTab('discover') : setRoadmapsOpen(!roadmapsOpen)}
            title={isCollapsed ? "Roadmaps" : ""}
            style={{
              display: 'flex', alignItems: 'center', 
              justifyContent: isCollapsed ? 'center' : 'space-between', 
              padding: isCollapsed ? '10px 0' : '10px 14px', borderRadius: '8px', cursor: 'pointer',
              background: roadmapsOpen && !isCollapsed ? 'var(--glass)' : 'transparent',
              color: 'var(--text)', fontWeight: 600, fontSize: 15, transition: 'all 0.2s ease',
              whiteSpace: 'nowrap', overflow: 'hidden'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-start', width: isCollapsed ? '100%' : 'auto' }}>
              <div style={{ minWidth: 20, marginRight: isCollapsed ? 0 : 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <RoadmapIcon />
              </div>
              <motion.span initial={false} animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : 'auto' }} style={{ overflow: 'hidden' }}>
                Roadmaps
              </motion.span>
            </div>
            <motion.div initial={false} animate={{ opacity: isCollapsed ? 0 : 1 }} style={{ color: 'var(--sub)' }}>
              {roadmapsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </motion.div>
          </div>
          <AnimatePresence>
            {roadmapsOpen && !isCollapsed && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }} 
                animate={{ height: 'auto', opacity: 1 }} 
                exit={{ height: 0, opacity: 0 }} 
                style={{ display: 'flex', flexDirection: 'column', gap: 2, overflow: 'hidden', marginTop: 4 }}
              >
                <SubItem label="Discover" count={ROADMAPS.length} isActive={tab === 'discover'} onClick={() => { setTab('discover'); setRoadmapTrack(null); }} />
                {Object.keys(joinedRoadmaps || {}).map((rmId) => {
                  const rm = ROADMAPS.find(r => r.id === rmId);
                  if (!rm) return null;
                  const isActive = activeRoadmap === rmId && tab === 'roadmap';
                  return (
                    <SubItem 
                      key={rmId} label={rm.label} count={isActive ? "Active" : ""} 
                      isActive={isActive} onClick={() => { switchRoadmap(rmId); setTab('roadmap'); setRoadmapTrack(0); }} 
                    />
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </SidebarGroup>

        <div style={{ flexGrow: 1 }} />

        {/* BOTTOM LINKS */}
        <SidebarGroup>
          <NavItem icon={<ActivityIcon />} label="Performance" isActive={isNavActive('notif')} onClick={() => { setTab('notif'); setRoadmapTrack(null); }} />
        </SidebarGroup>
      </div>
    </div>
  );
}
