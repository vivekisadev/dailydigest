import React, { useMemo, useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  Background
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// --- CUSTOM NODES ---

const RootNode = ({ data }) => (
  <div style={{ width: 290, height: 38, background: '#3B3FA0', border: '1.5px solid #6b6fd6', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Handle type="source" position={Position.Bottom} style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0 }} />
    <span style={{ color: '#ffffff', fontFamily: 'sans-serif', fontSize: 13, fontWeight: 700 }}>{data.text}</span>
  </div>
);

const WeekNode = ({ data }) => (
  <div className="interactable" onClick={() => data.onClick(data.task)} style={{ width: 120, height: 42, background: '#eab308', border: '1.5px solid #ca8a04', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
    <Handle type="target" id="top" position={Position.Top} style={{ opacity: 0 }} />
    <Handle type="target" id="left" position={Position.Left} style={{ opacity: 0 }} />
    <Handle type="target" id="right" position={Position.Right} style={{ opacity: 0 }} />
    <span style={{ color: '#000000', fontFamily: 'sans-serif', fontSize: 13, fontWeight: 700 }}>{data.title}</span>
    <Handle type="source" id="bottom" position={Position.Bottom} style={{ opacity: 0 }} />
  </div>
);

const TopicNode = ({ data }) => {
  const isDone = data.isJoined && data.isDone;
  const bgColor = isDone ? '#4ade80' : '#fef08a';
  const strokeColor = isDone ? '#16a34a' : '#eab308';
  
  return (
    <div 
      className="interactable"
      onClick={() => data.onClick(data.task)}
      style={{ 
        width: 220, height: 38, background: bgColor, 
        border: `2px solid ${strokeColor}`, 
        borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 12px',
        cursor: 'pointer', position: 'relative'
      }}
    >
      <Handle type="target" position={Position.Top} style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0 }} />
      <span style={{ color: '#000000', fontFamily: 'sans-serif', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.title}</span>
      {isDone && (
        <span style={{ position: 'absolute', right: -6, top: -6, background: '#10b981', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>✓</span>
      )}
      <Handle type="source" position={Position.Bottom} style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0 }} />
    </div>
  );
};

const NicheNode = ({ data }) => (
  <div className="interactable" onClick={() => data.onClick(data.task)} style={{ width: 180, height: 42, background: data.color || '#3b82f6', border: `1.5px solid ${data.color || '#2563eb'}`, borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
    <Handle type="target" position={Position.Top} style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0 }} />
    <span style={{ color: '#ffffff', fontFamily: 'sans-serif', fontSize: 13, fontWeight: 700 }}>{data.title}</span>
    <Handle type="source" position={Position.Bottom} style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0 }} />
  </div>
);

const BackNode = ({ data }) => (
  <div className="interactable" onClick={data.onClick} style={{ width: 200, height: 38, background: '#1f2937', border: '1.5px solid #374151', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
    <Handle type="source" position={Position.Bottom} style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0 }} />
    <span style={{ color: '#ffffff', fontFamily: 'sans-serif', fontSize: 13, fontWeight: 700 }}>← Back to Overview</span>
  </div>
);

// --- MIND-MAP NODES (HORIZONTAL) ---
const MMWeekNode = ({ data }) => (
  <div style={{ width: 140, height: 48, background: '#f59e0b', border: '2px solid #d97706', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(245, 158, 11, 0.2)' }}>
    <Handle type="target" id="t-left" position={Position.Left} style={{ opacity: 0 }} />
    <Handle type="source" id="left" position={Position.Left} style={{ top: '50%', left: -8, width: 8, height: 8, background: '#d97706', border: 'none' }} />
    <span style={{ color: '#000000', fontFamily: 'sans-serif', fontSize: 16, fontWeight: 800 }}>{data.title}</span>
    <Handle type="target" id="t-right" position={Position.Right} style={{ opacity: 0 }} />
    <Handle type="source" id="right" position={Position.Right} style={{ top: '50%', right: -8, width: 8, height: 8, background: '#d97706', border: 'none' }} />
  </div>
);

const MMTrackNode = ({ data }) => (
  <div style={{ width: 180, height: 40, background: data.color || '#fcd34d', border: `2px solid ${data.color || '#fbbf24'}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)' }}>
    <Handle type="source" id="left" position={Position.Left} style={{ top: '50%', left: -8, width: 8, height: 8, background: data.color || '#fbbf24', border: 'none' }} />
    <span style={{ color: '#000000', fontFamily: 'sans-serif', fontSize: 13, fontWeight: 700 }}>{data.title}</span>
    <Handle type="source" id="right" position={Position.Right} style={{ top: '50%', right: -8, width: 8, height: 8, background: data.color || '#fbbf24', border: 'none' }} />
  </div>
);

const MMTopicNode = ({ data }) => {
  const isDone = data.isJoined && data.isDone;
  const bgColor = isDone ? '#34d399' : '#a7f3d0';
  const strokeColor = isDone ? '#10b981' : '#6ee7b7';
  
  return (
    <div 
      className="interactable"
      onClick={() => data.onClick(data.task)}
      style={{ 
        width: 220, minHeight: 38, background: bgColor, 
        border: `2px solid ${strokeColor}`, 
        borderRadius: 8, display: 'flex', alignItems: 'center', padding: '8px 12px',
        cursor: 'pointer', position: 'relative',
        boxShadow: `0 4px 15px rgba(52, 211, 153, ${isDone ? 0.3 : 0.1})`
      }}
    >
      <Handle type="target" id="left" position={Position.Left} style={{ top: '50%', left: -8, width: 8, height: 8, background: strokeColor, border: 'none' }} />
      <span style={{ color: '#064e3b', fontFamily: 'sans-serif', fontSize: 12, fontWeight: 600, lineHeight: 1.3 }}>{data.title}</span>
      {isDone && (
        <span style={{ position: 'absolute', right: -6, top: -6, background: '#059669', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>✓</span>
      )}
      <Handle type="target" id="right" position={Position.Right} style={{ top: '50%', right: -8, width: 8, height: 8, background: strokeColor, border: 'none' }} />
    </div>
  );
};

const nodeTypes = {
  root: RootNode,
  week: WeekNode,
  topic: TopicNode,
  niche: NicheNode,
  back: BackNode,
  'mm-week': MMWeekNode,
  'mm-track': MMTrackNode,
  'mm-topic': MMTopicNode
};

// --- CUSTOM SCROLLBAR OVERLAY ---
const ScrollbarOverlay = ({ reactFlowInstance, bounds }) => {
  const [thumbTop, setThumbTop] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef(null);
  
  const handleScrollDrag = useCallback((e) => {
    if (!reactFlowInstance || !trackRef.current) return;
    const track = trackRef.current.getBoundingClientRect();
    let y = e.clientY - track.top;
    y = Math.max(0, Math.min(y, track.height - 40)); 
    
    const pct = y / (track.height - 40);
    setThumbTop(y);
    
    const zoom = reactFlowInstance.getZoom();
    const rangeY = (bounds.maxY - bounds.minY) * zoom;
    const panY = - (pct * rangeY) + 100;
    
    const { x } = reactFlowInstance.getViewport();
    reactFlowInstance.setViewport({ x, y: panY, zoom });
  }, [reactFlowInstance, bounds]);

  return (
    <div 
      ref={trackRef}
      style={{
        position: 'absolute', right: 8, top: 20, bottom: 20, width: 8,
        background: 'rgba(255,255,255,0.05)', borderRadius: 4, zIndex: 10
      }}
      onPointerDown={(e) => {
        setIsDragging(true);
        handleScrollDrag(e);
        e.target.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => { if (isDragging) handleScrollDrag(e); }}
      onPointerUp={(e) => { setIsDragging(false); e.target.releasePointerCapture(e.pointerId); }}
    >
      <div style={{
        position: 'absolute', top: thumbTop, width: '100%', height: 40,
        background: isDragging ? 'var(--accent)' : 'rgba(255,255,255,0.2)',
        borderRadius: 4, cursor: 'pointer', transition: isDragging ? 'none' : 'background 0.2s'
      }} />
    </div>
  );
};

export default function RoadmapInteractiveTree({ activeRoadmapDef, activeRaw, activeTracks, doneMap, onNodeClick, isJoined }) {
  const [rfInstance, setRfInstance] = useState(null);
  const [drillDown, setDrillDown] = useState(null);

  const { initialNodes, initialEdges, bounds } = useMemo(() => {
    const nds = [];
    const eds = [];
    let edgeIdCounter = 0;
    let currentY = 100;
    const CENTER_X = 400;

    if (drillDown === null) {
      // OVERVIEW MODE
      const rootId = 'root-node';
      nds.push({
        id: rootId,
        type: 'root',
        position: { x: CENTER_X - 145, y: 0 },
        data: { text: `${activeRoadmapDef?.label || 'Roadmap'} Curriculum` }
      });

      let prevNodeId = rootId;

      if (activeRoadmapDef?.tieredByTrack || activeRoadmapDef?.id === 'combined-master') {
        // OVERVIEW: NICHES
        const tracks = activeTracks || [];
        tracks.forEach((track, i) => {
          const trackId = `track-${track.id}`;
          
          nds.push({
            id: trackId,
            type: 'niche',
            position: { x: CENTER_X - 90, y: currentY },
            data: {
              title: track.label,
              color: track.color,
              task: { type: 'track', value: track.id },
              onClick: (t) => setDrillDown(t)
            }
          });

          eds.push({
            id: `e-${edgeIdCounter++}`,
            source: prevNodeId,
            target: trackId,
            type: 'straight',
            style: { stroke: track.color || "#3b82f6", strokeWidth: 2 }
          });
          
          currentY += 100;
          prevNodeId = trackId;
        });
      } else {
        // OVERVIEW: WEEKS (SNAKE LAYOUT)
        let maxWeek = 0;
        activeRaw.forEach(t => { if (t[0] > maxWeek) maxWeek = t[0]; });
        const totalWeeks = Math.max(activeRoadmapDef?.totalWeeks || maxWeek, maxWeek);

        for (let w = 1; w <= totalWeeks; w++) {
          const weekId = `week-${w}`;
          
          // Alternating positions for snake layout
          const isLeft = (w % 2 !== 0);
          const xPos = isLeft ? CENTER_X - 160 : CENTER_X + 40;

          nds.push({
            id: weekId,
            type: 'week',
            position: { x: xPos, y: currentY },
            data: { 
              title: `Week ${w}`,
              task: { type: 'week', value: w },
              onClick: (t) => setDrillDown(t)
            }
          });

          let targetHandle = 'top';
          if (w > 1) {
            targetHandle = isLeft ? 'right' : 'left';
          }

          eds.push({
            id: `e-${edgeIdCounter++}`,
            source: prevNodeId,
            sourceHandle: prevNodeId === rootId ? undefined : 'bottom',
            target: weekId,
            targetHandle: targetHandle,
            type: w > 1 ? 'smoothstep' : 'straight',
            style: { stroke: "#ca8a04", strokeWidth: 3 },
            animated: true
          });

          currentY += 80;
          prevNodeId = weekId;
        }
      }
    } else {
      // DETAILED MODE (Mind-Map Layout)
      const backId = 'back-node';
      nds.push({
        id: backId,
        type: 'back',
        position: { x: 50, y: 0 },
        data: { onClick: () => setDrillDown(null) }
      });

      // Filter raw tasks based on drillDown
      const filteredRaw = activeRaw.filter(t => {
        if (drillDown.type === 'week') return parseInt(t[0], 10) === drillDown.value;
        if (drillDown.type === 'track') return t[2] === drillDown.value;
        return true;
      });

      // Group: We no longer group by week if drillDown is track. We use ONE central node.
      const tasks = filteredRaw.map(task => ({
        id: task.id,
        topic: task[3],
        track: task[2],
        hrs: task[5],
        desc: task[8],
        priority: task[7],
        isDone: !!(doneMap && doneMap[task.id]),
        rawTask: task
      }));

      let centralId = '';
      let centralTitle = '';
      let centralType = 'mm-week';
      let centralColor = '#f59e0b';

      if (drillDown.type === 'track') {
        const trackDef = activeTracks?.find(t => t.id === drillDown.value);
        centralId = `track-${drillDown.value}`;
        centralTitle = trackDef?.label || 'Track';
        centralType = 'mm-track';
        centralColor = trackDef?.color || '#3b82f6';
      } else {
        centralId = `week-${drillDown.value}`;
        centralTitle = `Week ${drillDown.value}`;
      }

      let currentY = 100;
      
      if (drillDown.type === 'track') {
        // HIERARCHY: Track -> Week -> Topics
        const weeks = {};
        tasks.forEach(task => {
          const w = task.rawTask[0];
          if (!weeks[w]) weeks[w] = [];
          weeks[w].push(task);
        });

        const sortedWeeks = Object.keys(weeks).map(Number).sort((a,b)=>a-b);
        
        let leftY = currentY;
        let rightY = currentY;
        let isLeft = true;

        sortedWeeks.forEach((w) => {
          const weekTasks = weeks[w];
          const weekId = `week-${w}`;
          
          let yPtr = isLeft ? leftY : rightY;
          let startWeekY = yPtr;

          weekTasks.forEach(task => {
            const topicId = task.id;
            nds.push({
              id: topicId,
              type: 'mm-topic',
              position: { x: isLeft ? -560 : 600, y: yPtr },
              data: {
                task: task.rawTask,
                title: task.topic,
                isDone: task.isDone,
                isJoined: isJoined,
                onClick: onNodeClick
              }
            });

            eds.push({
              id: `e-${edgeIdCounter++}`,
              source: weekId,
              sourceHandle: isLeft ? 'left' : 'right',
              target: topicId,
              targetHandle: isLeft ? 'right' : 'left',
              type: 'smoothstep',
              style: { stroke: centralColor, strokeWidth: 2, opacity: 0.6 },
              pathOptions: { borderRadius: 30 }
            });

            yPtr += 56;
          });

          // Draw intermediate week node
          const weekCenterY = startWeekY + (yPtr - startWeekY)/2 - 24;
          nds.push({
            id: weekId,
            type: 'mm-week',
            position: { x: isLeft ? -260 : 300, y: weekCenterY },
            data: { title: `Week ${w}` }
          });

          // Edge from Track to Week
          eds.push({
            id: `e-${edgeIdCounter++}`,
            source: centralId,
            sourceHandle: isLeft ? 'left' : 'right',
            target: weekId,
            targetHandle: isLeft ? 't-right' : 't-left',
            type: 'smoothstep',
            style: { stroke: centralColor, strokeWidth: 3, opacity: 0.9 },
            pathOptions: { borderRadius: 30 }
          });

          yPtr += 30; // space after week block
          
          if (isLeft) leftY = yPtr;
          else rightY = yPtr;
          
          isLeft = !isLeft;
        });

        const maxSideY = Math.max(leftY, rightY) || currentY;
        const centralY = currentY + (maxSideY - currentY) / 2 - 24;
        
        nds.push({
          id: centralId,
          type: centralType,
          position: { x: 20, y: centralY },
          data: { 
            title: centralTitle,
            color: centralColor,
            task: drillDown,
            onClick: onNodeClick 
          }
        });

        currentY = maxSideY + 60;

      } else {
        // FLAT: Week -> Topics (already balanced)
        const shouldSplit = tasks.length > 5;
        let leftY = currentY;
        let rightY = currentY;
        let leftCount = 0;
        let rightCount = 0;

        tasks.forEach((task) => {
          const topicId = task.id;
          const trackColor = activeTracks?.find(t => t.id === task.track)?.color || '#3b82f6';
          
          const isLeft = shouldSplit && (leftCount <= rightCount);
          let yPtr = isLeft ? leftY : rightY;
          
          nds.push({
            id: topicId,
            type: 'mm-topic',
            position: { x: isLeft ? -260 : 300, y: yPtr },
            data: {
              task: task.rawTask,
              title: task.topic,
              isDone: task.isDone,
              isJoined: isJoined,
              onClick: onNodeClick
            }
          });

          eds.push({
            id: `e-${edgeIdCounter++}`,
            source: centralId,
            sourceHandle: isLeft ? 'left' : 'right',
            target: topicId,
            targetHandle: isLeft ? 'right' : 'left',
            type: 'smoothstep',
            style: { stroke: trackColor, strokeWidth: 2, opacity: 0.8 },
            pathOptions: { borderRadius: 30 }
          });

          if (isLeft) {
            leftCount++;
            leftY += 56;
          } else {
            rightCount++;
            rightY += 56;
          }
        });

        const maxSideY = Math.max(leftY, rightY) || currentY;
        const centralY = currentY + (maxSideY - currentY) / 2 - 24;
        
        nds.push({
          id: centralId,
          type: centralType,
          position: { x: 20, y: centralY },
          data: { 
            title: centralTitle,
            color: centralColor,
            task: drillDown,
            onClick: onNodeClick 
          }
        });

        currentY = maxSideY + 60;
      }
    }

    return { initialNodes: nds, initialEdges: eds, bounds: { minY: 0, maxY: currentY } };
  }, [activeRoadmapDef, activeRaw, activeTracks, doneMap, isJoined, drillDown, onNodeClick]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  React.useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    if (rfInstance) {
      window.requestAnimationFrame(() => {
        rfInstance.fitView({ padding: 0.2, duration: 800 });
      });
    }
  }, [initialNodes, initialEdges, setNodes, setEdges, rfInstance]);

  const onNodeClickInternal = useCallback((event, node) => {
    if (node.type === 'topic' && onNodeClick) {
      onNodeClick(node.data.task);
    }
  }, [onNodeClick]);

  return (
    <div style={{ width: '100%', height: '100%', minHeight: 600, position: 'relative', background: 'var(--card)', borderRadius: 12, border: '1px solid var(--border)' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClickInternal}
        nodeTypes={nodeTypes}
        fitView
        onInit={setRfInstance}
        minZoom={0.2}
        maxZoom={3}
        nodesDraggable={true}
        panOnScroll={true}
        panOnDrag={true}
        zoomOnScroll={true}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#2a2c40" gap={16} />
      </ReactFlow>

      {rfInstance && <ScrollbarOverlay reactFlowInstance={rfInstance} bounds={bounds} />}
    </div>
  );
}
