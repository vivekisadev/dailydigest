import React from "react";
import { motion } from "framer-motion";
import "./GradientButtonGroupBottom.css";

function haptic(s = "light") {
  try {
    navigator.vibrate?.(s === "heavy" ? 30 : s === "medium" ? 15 : 8);
  } catch (e) {}
}

export default function GradientButtonGroupBottom({
  navItems,
  activeTab,
  onTabChange,
  onCreate,
}) {
  return (
    <div className="gbg-nav-container">
      {navItems.map((item) => {
        if (item.id === "spacer") {
          return <div key="spacer" style={{ width: 16 }} />;
        }

        const active = activeTab === item.id;

        return (
          <button
            key={item.id}
            className={`gbg-btn interactable ${active ? "active" : ""}`}
            onClick={() => {
              haptic("light");
              if (item.onClick) {
                item.onClick();
              } else {
                onTabChange(item.id);
              }
            }}
            aria-label={item.label}
          >
            <div className="gbg-btn-glow" />
            <svg
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={item.path} />
            </svg>
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
