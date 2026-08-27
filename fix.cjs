const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf8');

const imports = `import { Zap, Puzzle, Monitor, Building, Rocket, Brain, Crown, Settings, User, Map, ClipboardList, Laptop, BarChart3, CalendarDays, Trophy, CheckCircle, Sun, Folder, Youtube, Lightbulb, Github, Link, Mail, RefreshCw, LogOut, Lock, Eye, EyeOff } from 'lucide-react';

const getLucideIcon = (emoji) => {
  switch (emoji) {
    case '⚡': return <Zap size={20} />;
    case '🔗': return <Link size={20} />;
    case '🧩': return <Puzzle size={20} />;
    case '🖥️': return <Monitor size={20} />;
    case '🏗️': return <Building size={20} />;
    case '🚀': return <Rocket size={20} />;
    case '🧠': return <Brain size={20} />;
    case '👑': return <Crown size={20} />;
    case '⚙️': return <Settings size={20} />;
    case '🧑‍💻': return <User size={20} />;
    case '📚': return '📚';
    case '🎬': return <Youtube size={16} />;
    case '💡': return <Lightbulb size={16} />;
    case '🐙': return <Github size={16} />;
    case '🗺️': return <Map size={24} />;
    case '📋': return <ClipboardList size={24} />;
    case '💻': return <Laptop size={24} />;
    case '📊': return <BarChart3 size={24} />;
    case '📅': return <CalendarDays size={24} />;
    case '🏆': return <Trophy size={24} />;
    case '✅': return <CheckCircle size={18} />;
    case '📧': return <Mail size={20} />;
    case '🔄': return <RefreshCw size={20} />;
    case '🚪': return <LogOut size={20} />;
    case '☀️': return <Sun size={20} />;
    case '📁': return <Folder size={18} />;
    default: return emoji;
  }
};
`;

if (!content.includes('getLucideIcon')) {
    content = content.replace("import React,", imports + "\nimport React,");
}

content = content.replace(/{icon}/g, '{getLucideIcon(icon)}');
content = content.replace(/{rm\.icon}/g, '{getLucideIcon(rm.icon)}');
content = content.replace(/{isDone \? '✅' : '📁'}/g, "{getLucideIcon(isDone ? '✅' : '📁')}");
content = content.replace(/{tr\.icon}/g, '{getLucideIcon(tr.icon)}');
content = content.replace(/{s\.icon}/g, '{getLucideIcon(s.icon)}');
content = content.replace(/{t\.icon}/g, '{getLucideIcon(t.icon)}');
content = content.replace(/📧/g, '{getLucideIcon("📧")}');
content = content.replace(/{item\.icon}/g, '{getLucideIcon(item.icon)}');

const emojis = ['🗺️', '📋', '💻', '📊', '📅', '🏆'];
for (const e of emojis) {
    content = content.split(`icon="${e}"`).join(`icon={getLucideIcon("${e}")}`);
}

const old_res = '{domain.includes("youtube") ? "🎬" : domain.includes("leetcode") ? "💡" : domain.includes("github") ? "🐙" : "🔗"}';
const new_res = '{getLucideIcon(domain.includes("youtube") ? "🎬" : domain.includes("leetcode") ? "💡" : domain.includes("github") ? "🐙" : "🔗")}';
content = content.replace(old_res, new_res);

const login_user = '<svg className="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
const login_email = '<svg className="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>';
const login_pass = '<svg className="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
const eye = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
const eye_off = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';

content = content.replace(login_user, '<User className="login-input-icon" size={18} />');
content = content.replace(login_email, '<Mail className="login-input-icon" size={18} />');
content = content.replace(login_pass, '<Lock className="login-input-icon" size={18} />');
content = content.replace(eye, '<Eye size={18} />');
content = content.replace(eye_off, '<EyeOff size={18} />');

// also handle for the roadmap tag on dashboard do not use any icons
// The user asked to remove roadmap tag icon. We will look for {rm.icon} inside a span.
// In App.jsx line ~753: <span>{rm.icon}</span> {rm.label} -> let's find it.
// Actually it's probably better to do this manually after running this script.

fs.writeFileSync('src/App.jsx', content, 'utf8');
console.log('App.jsx updated');
