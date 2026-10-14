import React, { useState, useRef } from 'react';
import { Concept, ConceptNode, TaskStatus } from '../types';
import { Brain, Plus, Sparkles, CheckCircle, Clock, CircleDot, Info, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import { LogoIcon } from './ConceptAILogo';

interface ConceptGraphViewProps {
  concepts: Concept[];
  onOpenAIDecompose: () => void;
  onUpdateNodeStatus?: (conceptId: string, nodeId: string, status: TaskStatus) => void;
  onSelectTask?: (taskId: string) => void;
}

export const ConceptGraphView: React.FC<ConceptGraphViewProps> = ({
  concepts,
  onOpenAIDecompose,
  onUpdateNodeStatus,
}) => {
  const [selectedConceptId, setSelectedConceptId] = useState<string>(concepts[0]?.id || '');
  const [selectedNode, setSelectedNode] = useState<ConceptNode | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});
  const svgRef = useRef<SVGSVGElement | null>(null);

  const activeConcept = concepts.find((c) => c.id === selectedConceptId) || concepts[0];

  const getNodePos = (node: ConceptNode) => {
    return nodePositions[node.id] || { x: node.x, y: node.y };
  };

  const handleMouseDown = (nodeId: string) => {
    setDraggedNodeId(nodeId);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggedNodeId || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoomLevel;
    const y = (e.clientY - rect.top) / zoomLevel;

    setNodePositions((prev) => ({
      ...prev,
      [draggedNodeId]: { x: Math.max(40, Math.min(x, 660)), y: Math.max(40, Math.min(y, 480)) },
    }));
  };

  const handleMouseUp = () => {
    setDraggedNodeId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-4 rounded-xl border border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <LogoIcon width={24} height={24} animate={true} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Neural Concept Mind-Map
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Interactive Graph
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Interactive synaptical graph mapping high-level concepts into execution milestones and tasks.
            </p>
          </div>
        </div>

        {/* Concept Selector & AI Action */}
        <div className="flex items-center gap-3">
          <select
            value={selectedConceptId}
            onChange={(e) => {
              setSelectedConceptId(e.target.value);
              setSelectedNode(null);
            }}
            className="bg-slate-900 text-cyan-300 text-xs rounded-lg px-3 py-2 border border-cyan-500/30 focus:outline-none focus:border-cyan-400"
          >
            {concepts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>

          <button
            onClick={onOpenAIDecompose}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:brightness-110 transition-all shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Breakdown
          </button>
        </div>
      </div>

      {/* Main Canvas & Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Canvas Area */}
        <div className="lg:col-span-3 relative rounded-2xl glass-panel border border-cyan-500/20 overflow-hidden bg-[#040816] min-h-[520px] flex flex-col justify-between">
          {/* Subtle Grid Background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(56, 189, 248, 0.4) 1px, transparent 0)`,
              backgroundSize: '28px 28px',
            }}
          />

          {/* Canvas Controls */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-cyan-900/60 backdrop-blur">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
              className="p-1.5 text-slate-400 hover:text-cyan-300 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono text-cyan-400 px-1">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
              className="p-1.5 text-slate-400 hover:text-cyan-300 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setZoomLevel(1);
                setNodePositions({});
              }}
              className="p-1.5 text-slate-400 hover:text-cyan-300 transition-colors"
              title="Reset View"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Concept Header inside canvas */}
          <div className="relative z-10 p-5 bg-gradient-to-b from-slate-950/80 to-transparent">
            <span className="text-xs uppercase font-semibold tracking-wider text-cyan-400">
              {activeConcept?.category} Concept Graph
            </span>
            <h3 className="text-lg font-extrabold text-white">{activeConcept?.title}</h3>
            <p className="text-xs text-slate-400 max-w-xl mt-1">{activeConcept?.description}</p>
          </div>

          {/* Interactive SVG Node & Synapse Graph */}
          <div className="relative flex-1 w-full h-[440px] overflow-hidden select-none">
            <svg
              ref={svgRef}
              className="w-full h-full cursor-crosshair"
              viewBox="0 0 700 520"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <defs>
                <linearGradient id="synapseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.6" />
                </linearGradient>
                <filter id="glowEffect" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Render Synapse Edges */}
              {activeConcept?.edges.map((edge, idx) => {
                const fromNode = activeConcept.nodes.find((n) => n.id === edge.from);
                const toNode = activeConcept.nodes.find((n) => n.id === edge.to);
                if (!fromNode || !toNode) return null;

                const p1 = getNodePos(fromNode);
                const p2 = getNodePos(toNode);

                // Curvature control point
                const midX = (p1.x + p2.x) / 2;
                const midY = (p1.y + p2.y) / 2 - 20;

                return (
                  <g key={`edge-${idx}`}>
                    <path
                      d={`M ${p1.x} ${p1.y} Q ${midX} ${midY} ${p2.x} ${p2.y}`}
                      stroke="url(#synapseGrad)"
                      strokeWidth="2.5"
                      fill="none"
                      strokeDasharray="4 2"
                      opacity="0.75"
                    />
                    {edge.label && (
                      <text
                        x={midX}
                        y={midY - 4}
                        fill="#67e8f9"
                        fontSize="10"
                        fontFamily="monospace"
                        textAnchor="middle"
                        className="select-none"
                      >
                        {edge.label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Render Neural Nodes */}
              {activeConcept?.nodes.map((node) => {
                const pos = getNodePos(node);
                const isSelected = selectedNode?.id === node.id;
                const isCore = node.type === 'core';
                const isMilestone = node.type === 'milestone';

                const nodeColor =
                  node.status === 'completed'
                    ? '#10b981'
                    : node.status === 'in_progress'
                    ? '#06b6d4'
                    : isCore
                    ? '#38bdf8'
                    : '#94a3b8';

                return (
                  <g
                    key={node.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    className="cursor-pointer transition-transform"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleMouseDown(node.id);
                      setSelectedNode(node);
                    }}
                  >
                    {/* Glowing outer halo */}
                    <circle
                      r={isCore ? 34 : isMilestone ? 28 : 22}
                      fill={nodeColor}
                      fillOpacity={isSelected ? 0.25 : 0.12}
                      stroke={nodeColor}
                      strokeWidth={isSelected ? 3 : 1.5}
                      strokeDasharray={isSelected ? '0' : '3 3'}
                      filter="url(#glowEffect)"
                    />

                    {/* Central Core Circle */}
                    <circle
                      r={isCore ? 20 : isMilestone ? 16 : 13}
                      fill="#060d22"
                      stroke={nodeColor}
                      strokeWidth="2"
                    />

                    {/* Status glyph or inner dot */}
                    <circle
                      r={isCore ? 8 : isMilestone ? 6 : 4}
                      fill={nodeColor}
                      className="transition-all"
                    />

                    {/* Node Label Text */}
                    <text
                      y={isCore ? 46 : 38}
                      textAnchor="middle"
                      fill="#f1f5f9"
                      fontSize={isCore ? 12 : 11}
                      fontWeight={isCore ? 700 : 500}
                      className="select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                    >
                      {node.label}
                    </text>

                    {/* Node Type Pill */}
                    <text
                      y={isCore ? 58 : 50}
                      textAnchor="middle"
                      fill="#38bdf8"
                      fontSize="9"
                      fontFamily="monospace"
                      opacity="0.8"
                    >
                      [{node.type.toUpperCase()}]
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Canvas Footer Hint */}
          <div className="p-3 bg-slate-950/80 border-t border-cyan-900/40 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              Drag nodes to adjust synaptical layout • Click any node to inspect details
            </span>
            <span className="text-cyan-400 font-mono">
              Nodes: {activeConcept?.nodes.length} | Connections: {activeConcept?.edges.length}
            </span>
          </div>
        </div>

        {/* Node Detail Inspector Panel */}
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-cyan-900/40">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <Brain className="w-4 h-4 text-cyan-400" />
                Synapse Inspector
              </h4>
              {selectedNode && (
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  {selectedNode.type}
                </span>
              )}
            </div>

            {selectedNode ? (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-[11px] text-slate-400 font-medium">Node Title</label>
                  <p className="text-sm font-bold text-cyan-300 mt-0.5">{selectedNode.label}</p>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-medium">Description</label>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    {selectedNode.description || 'Core concept execution node wired directly to task engine.'}
                  </p>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-medium">Execution Status</label>
                  <div className="grid grid-cols-3 gap-1.5 mt-2">
                    {(['todo', 'in_progress', 'completed'] as TaskStatus[]).map((status) => {
                      const isActive = selectedNode.status === status;
                      return (
                        <button
                          key={status}
                          onClick={() => {
                            if (activeConcept && onUpdateNodeStatus) {
                              onUpdateNodeStatus(activeConcept.id, selectedNode.id, status);
                              setSelectedNode({ ...selectedNode, status });
                            }
                          }}
                          className={`px-2 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all ${
                            isActive
                              ? status === 'completed'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50'
                                : status === 'in_progress'
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50'
                                : 'bg-slate-700/50 text-slate-200 border border-slate-500'
                              : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
                          }`}
                        >
                          {status.replace('_', ' ')}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-3 border-t border-cyan-900/40 text-xs text-slate-400 space-y-2">
                  <div className="flex justify-between">
                    <span>Coordinates</span>
                    <span className="font-mono text-cyan-400">
                      X: {Math.round(getNodePos(selectedNode).x)} | Y: {Math.round(getNodePos(selectedNode).y)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Synapse Cluster</span>
                    <span className="font-mono text-slate-300">{activeConcept.category}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-500 space-y-3">
                <CircleDot className="w-8 h-8 mx-auto text-cyan-500/40 animate-pulse" />
                <p className="text-xs">Click on any neural node in the canvas to inspect its parameters and state.</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-cyan-900/40">
            <button
              onClick={onOpenAIDecompose}
              className="w-full py-2.5 px-3 rounded-xl bg-cyan-950 border border-cyan-400/40 text-cyan-300 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-cyan-900/60 transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Decompose More Nodes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
