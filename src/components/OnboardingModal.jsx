import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, CheckCircle, Search, ArrowRight, X } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: "Welcome to GuideMe 🚀",
    description: "Your personal mentor for acing tech interviews. Let's get you set up in under a minute.",
    icon: <Search size={40} color="var(--accent)" />,
    color: "var(--accent)"
  },
  {
    id: 2,
    title: "1. Discover a Roadmap",
    description: "Head over to the Discover tab to find a 90-day plan tailored for your goals, like MANGO or Data Analyst.",
    icon: <Map size={40} color="#10B981" />,
    color: "#10B981"
  },
  {
    id: 3,
    title: "2. Track Daily Tasks",
    description: "Every day, you'll get a curated list of tasks. Complete them to maintain your streak and master new concepts.",
    icon: <CheckCircle size={40} color="#F59E0B" />,
    color: "#F59E0B"
  }
];

export default function OnboardingModal({ onClose, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
      onClose();
    }
  };

  const step = steps[currentStep];

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 99999, padding: 20
    }}>
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentStep}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          style={{
            background: 'var(--bg2)', borderRadius: 24, padding: '40px 32px',
            width: '100%', maxWidth: 440, position: 'absolute',
            border: '1px solid var(--border)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'transparent', border: 'none', color: 'var(--sub)', cursor: 'pointer' }}>
            <X size={20} />
          </button>

          <div style={{ 
            width: 80, height: 80, borderRadius: '50%', 
            background: `${step.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 24
          }}>
            {step.icon}
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>{step.title}</h2>
          <p style={{ fontSize: 16, color: 'var(--sub)', lineHeight: 1.6, marginBottom: 32 }}>
            {step.description}
          </p>

          <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
            {steps.map((_, idx) => (
              <div key={idx} style={{ 
                width: idx === currentStep ? 24 : 8, height: 8, borderRadius: 4, 
                background: idx === currentStep ? 'var(--accent)' : 'var(--border)',
                transition: 'all 0.3s ease'
              }} />
            ))}
          </div>

          <button 
            onClick={nextStep}
            style={{
              background: 'var(--accent)', color: '#fff', border: 'none',
              padding: '16px 24px', borderRadius: 12, fontSize: 16, fontWeight: 600,
              width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'transform 0.2s, opacity 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = 0.9}
            onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {currentStep === steps.length - 1 ? "Let's Get Started" : "Continue"}
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
