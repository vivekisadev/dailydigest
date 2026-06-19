import React from 'react';
import { motion } from 'framer-motion';

export default function TaskDetailCenter({ detailTask, activeRoadmapTitle, closeDetail, isDone, onToggleDone }) {
  if (!detailTask) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '32px 40px', color: '#fff', maxWidth: 900 }}>
      {/* Breadcrumbs & Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: '#777', fontWeight: 500, letterSpacing: '0.02em' }}>
          <span style={{ cursor: 'pointer', color: '#888' }} onClick={closeDetail}>Roadmaps</span> / <span style={{ cursor: 'pointer', color: '#888' }} onClick={closeDetail}>{activeRoadmapTitle || 'Roadmap'}</span> / <span style={{ color: '#aaa' }}>{detailTask.topic}</span>
        </div>
        <button 
          onClick={onToggleDone}
          style={{ background: isDone ? '#10b981' : 'var(--accent)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          {isDone ? 'Completed ✓' : 'Mark as done'}
        </button>
      </div>

      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12, letterSpacing: '-0.02em' }}>{detailTask.topic}</h1>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: '#34d399', marginBottom: 24 }}>{detailTask.sub}</h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: '#777', marginBottom: 32 }}>
        <span style={{ cursor: 'pointer' }}>📎 Attachments</span>
        <span style={{ cursor: 'pointer' }}>💬 Comments</span>
        <span style={{ cursor: 'pointer' }}>🔗 Share</span>
      </div>

      {/* Description */}
      <div style={{ marginBottom: 40 }}>
        <h3 style={{ fontSize: 14, color: '#888', marginBottom: 12, fontWeight: 600 }}>Description</h3>
        <div style={{ fontSize: 14, color: '#ddd', lineHeight: 1.6, background: 'rgba(255,255,255,0.02)', padding: 16, borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
          {typeof detailTask.desc === 'string' && detailTask.desc.includes('<div') ? (
             <div dangerouslySetInnerHTML={{ __html: detailTask.desc }} />
          ) : (
             <div style={{ whiteSpace: 'pre-wrap' }}>{detailTask.desc || `Focus on ${detailTask.sub}.`}</div>
          )}
        </div>
      </div>

      {detailTask.probs && detailTask.probs.length > 0 && (
        <>
          <hr style={{ borderColor: 'var(--border)', margin: '0 0 32px 0' }} />
          <div style={{ marginBottom: 40 }}>
            <h3 style={{ fontSize: 14, color: '#888', marginBottom: 16, fontWeight: 600 }}>Problems / Exercises</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {detailTask.probs.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--yellow)' }}></div>
                  {p.link ? (
                    <a href={p.link} target="_blank" rel="noreferrer" style={{ color: '#eee', textDecoration: 'none', fontSize: 14 }}>{p.name || p.link}</a>
                  ) : (
                    <span style={{ color: '#eee', fontSize: 14 }}>{p.name || p}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {detailTask.res && detailTask.res.length > 0 && (
        <>
          <hr style={{ borderColor: 'var(--border)', margin: '0 0 32px 0' }} />
          <div style={{ marginBottom: 40 }}>
            <h3 style={{ fontSize: 14, color: '#888', marginBottom: 16, fontWeight: 600 }}>Resources</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {detailTask.res.map((r, i) => {
                // Determine resource name/link handling if it's an object or string
                const rName = r.name || r.title || r;
                const rLink = r.link || r.url || null;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6' }}></div>
                    {rLink ? (
                      <a href={rLink} target="_blank" rel="noreferrer" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: 14 }}>{rName}</a>
                    ) : (
                      <span style={{ color: '#eee', fontSize: 14 }}>{rName}</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
