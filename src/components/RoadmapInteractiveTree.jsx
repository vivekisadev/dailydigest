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
  <div className="interactable" onClick={() => data.onClick(data.task)} style={{ width: 120, height: 42, background: '#eab308', border: '1.5px solid #ca8a04', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
    <Handle type="target" position={Position.Top} style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0 }} />
    <span style={{ color: '#000000', fontFamily: 'sans-serif', fontSize: 13, fontWeight: 700 }}>{data.title}</span>
    <Handle type="source" position={Position.Bottom} style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0 }} />
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

const nodeTypes = {
  root: RootNode,
  week: WeekNode,
  topic: TopicNode,
  niche: NicheNode,
  back: BackNode
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
        // OVERVIEW: WEEKS
        let maxWeek = 0;
        activeRaw.forEach(t => { if (t[0] > maxWeek) maxWeek = t[0]; });
        const totalWeeks = Math.max(activeRoadmapDef?.totalWeeks || maxWeek, maxWeek);

        for (let w = 1; w <= totalWeeks; w++) {
          const weekId = `week-${w}`;
          nds.push({
            id: weekId,
            type: 'week',
            position: { x: CENTER_X - 60, y: currentY },
            data: { 
              title: `Week ${w}`,
              task: { type: 'week', value: w },
              onClick: (t) => setDrillDown(t)
            }
          });

          eds.push({
            id: `e-${edgeIdCounter++}`,
            source: prevNodeId,
            target: weekId,
            type: 'straight',
            style: { stroke: "#ca8a04", strokeWidth: 2 }
          });

          currentY += 100;
          prevNodeId = weekId;
        }
      }
    } else {
      // DETAILED MODE
      const backId = 'back-node';
      nds.push({
        id: backId,
        type: 'back',
        position: { x: CENTER_X - 100, y: 0 },
        data: { onClick: () => setDrillDown(null) }
      });

      let prevNodeId = backId;
      
      // Filter raw tasks based on drillDown
      const filteredRaw = activeRaw.filter(t => {
        if (drillDown.type === 'week') return parseInt(t[0], 10) === drillDown.value;
        if (drillDown.type === 'track') return t[2] === drillDown.value;
        return true;
      });

      const weeks = {};
      filteredRaw.forEach(task => {
        const w = parseInt(task[0], 10);
        if (!weeks[w]) weeks[w] = [];
        weeks[w].push({
          id: task.id,
          topic: task[3],
          track: task[2],
          hrs: task[5],
          desc: task[8],
          priority: task[7],
          isDone: !!(doneMap && doneMap[task.id])
        });
      });

      const sortedWeeks = Object.keys(weeks).map(Number).sort((a,b)=>a-b);
      
      sortedWeeks.forEach(w => {
        const weekId = `week-${w}`;
        const isRightSide = (w % 2 !== 0);

        nds.push({
          id: weekId,
          type: 'week',
          position: { x: CENTER_X - 60, y: currentY },
          data: { 
            title: `Week ${w}`,
            task: { type: 'week', weekNum: w, tasks: weeks[w] || [] },
            onClick: onNodeClick 
          }
        });

        eds.push({
          id: `e-${edgeIdCounter++}`,
          source: prevNodeId,
          target: weekId,
          type: 'straight',
          style: { stroke: "#ca8a04", strokeWidth: 2 }
        });

        const tasks = weeks[w] || [];
        const topicSpacingY = 50;
        const startTopicY = currentY - ((tasks.length - 1) * topicSpacingY) / 2;

        tasks.forEach((task, tIdx) => {
          const topicId = task.id;
          const topicY = startTopicY + tIdx * topicSpacingY;
          const topicX = isRightSide ? CENTER_X + 120 : CENTER_X - 340; 

          nds.push({
            id: topicId,
            type: 'topic',
            position: { x: topicX, y: topicY },
            data: {
              task: task,
              title: task.topic,
              isDone: task.isDone,
              isJoined: isJoined,
              side: isRightSide ? 'right' : 'left',
              onClick: onNodeClick
            }
          });

          eds.push({
            id: `e-${edgeIdCounter++}`,
            source: weekId,
            target: topicId,
            type: 'smoothstep',
            style: { stroke: "#6b7280", strokeWidth: 2 },
            pathOptions: { borderRadius: 24 }
          });
        });

        currentY += Math.max(1, tasks.length) * topicSpacingY + 60;
        prevNodeId = weekId;
      });
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
