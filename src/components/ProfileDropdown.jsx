import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, Moon, Sun, Layers, HelpCircle, LogOut } from 'lucide-react';

export default function ProfileDropdown({ userProfile, isCollapsed, openProfileModal, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => setIsOpen(!isOpen);

  const DropdownItem = ({ icon: Icon, label, addon, onClick }) => {
    const [hover, setHover] = useState(false);
    return (
      <div 
        onClick={() => { onClick?.(); setIsOpen(false); }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 12px', borderRadius: 6, cursor: 'pointer',
          background: hover ? 'var(--hover)' : 'transparent',
          color: hover ? 'var(--text)' : 'var(--sub)',
          transition: 'all 0.15s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon size={16} />
          <span style={{ fontSize: 14, fontWeight: 500 }}>{label}</span>
        </div>
        {addon && (
          <span style={{ fontSize: 12, color: 'var(--sub)', opacity: hover ? 1 : 0.6 }}>{addon}</span>
        )}
      </div>
    );
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
      {/* TRIGGER (Mimicking the Sidebar Header we replaced) */}
      <div 
        onClick={handleToggle}
        style={{ 
          display: 'flex', alignItems: 'center', 
          padding: isCollapsed ? '12px 0' : '24px 20px 24px 16px', 
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden',
          borderBottom: '1px solid var(--border)', marginBottom: 8,
          background: isOpen ? 'var(--glass)' : 'transparent',
          transition: 'background 0.2s'
        }}
      >
        <div style={{ flexShrink: 0, marginRight: isCollapsed ? 0 : 12, position: 'relative', display: 'flex', justifyContent: 'center' }}>
          {userProfile?.avatar && userProfile.avatar.startsWith('http') ? (
            <img src={userProfile.avatar} style={{ width: 36, height: 36, borderRadius: '8px', objectFit: 'cover' }} alt="Profile" />
          ) : (
            <div style={{ width: 36, height: 36, borderRadius: '8px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 15, fontWeight: 'bold' }}>
              {userProfile?.avatar || userProfile?.name?.[0] || 'U'}
            </div>
          )}
          {/* Online status indicator */}
          <div style={{ position: 'absolute', bottom: -2, right: -2, width: 10, height: 10, background: '#10B981', border: '2px solid var(--bg2)', borderRadius: '50%' }} />
        </div>
        <motion.div 
          initial={false}
          animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : 'auto' }}
          style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        >
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', textOverflow: 'ellipsis', overflow: 'hidden' }}>{userProfile?.name || 'User'}</span>
          <span style={{ fontSize: 11, color: 'var(--sub)', textOverflow: 'ellipsis', overflow: 'hidden' }}>{userProfile?.email || 'Free Plan'}</span>
        </motion.div>
      </div>

      {/* DROPDOWN MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            style={{
              position: 'absolute', top: '100%', left: 16, width: 240,
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: 12, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
              zIndex: 999, overflow: 'hidden', marginTop: -4
            }}
          >
            {/* Header / AvatarLabelGroup Area */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flexShrink: 0 }}>
                {userProfile?.avatar && userProfile.avatar.startsWith('http') ? (
                  <img src={userProfile.avatar} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} alt="Profile" />
                ) : (
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
                    {userProfile?.avatar || userProfile?.name?.[0] || 'U'}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userProfile?.name || 'User'}</span>
                <span style={{ fontSize: 12, color: 'var(--sub)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userProfile?.email || 'Free Plan'}</span>
              </div>
            </div>

            {/* Menu Items */}
            <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <DropdownItem icon={User} label="View profile" addon="⌘K→P" onClick={openProfileModal} />
              <DropdownItem icon={Settings} label="Settings" addon="⌘S" />
              
              <div style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 12px', borderRadius: 6, cursor: 'pointer',
                color: 'var(--sub)'
              }} onClick={() => setIsDarkMode(!isDarkMode)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
                  <span style={{ fontSize: 14, fontWeight: 500 }}>Dark mode</span>
                </div>
                {/* Custom Toggle switch */}
                <div style={{ width: 28, height: 16, borderRadius: 8, background: isDarkMode ? 'var(--accent)' : 'var(--border)', position: 'relative' }}>
                  <motion.div layout style={{ position: 'absolute', top: 2, left: isDarkMode ? 14 : 2, width: 12, height: 12, borderRadius: 6, background: '#fff' }} />
                </div>
              </div>

              <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />

              <DropdownItem icon={Layers} label="Changelog" addon="⌘C" />
              <DropdownItem icon={HelpCircle} label="Support" />
            </div>

            {/* Footer / Sign Out */}
            <div style={{ padding: 8, borderTop: '1px solid var(--border)' }}>
              <button 
                onClick={onLogout}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '8px 0', background: 'transparent', border: '1px solid var(--border)',
                  borderRadius: 6, color: 'var(--text)', fontSize: 13, fontWeight: 600, cursor: 'pointer'
                }}
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
