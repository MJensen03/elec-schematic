import { useState, useCallback } from 'react'
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  ConnectionMode,
  type NodeTypes,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
} from '@xyflow/react'
import { BreadboardNode } from './components/BreadboardNode'
import { WirePalette } from './components/WirePalette'
import { DEFAULT_WIRE_COLOR } from './lib/wireColors'
import '@xyflow/react/dist/style.css'
import './App.css'

// Must live outside the component: a new object each render makes React Flow
// re-register every node type and warn about it.
const nodeTypes: NodeTypes = { breadboard: BreadboardNode }

// Wires must paint above the boards they run across: React Flow renders the
// edge layer before the node layer, and both default to z-index 0. Selecting a
// node lifts it to SELECTED_NODE_Z (1000) and edges do not follow, so sit above
// that too -- on a schematic a wire is always on top of the board.
const WIRE_Z = 1001

const initialNodes: Node[] = [
  { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
  { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
  { id: 'n3', type: 'breadboard', position: { x: 250, y: 0 }, data: {} },
]

const initialEdges: Edge[] = [
  { id: 'n1-n2', source: 'n1', target: 'n2', zIndex: WIRE_Z },
]

function App() {
  const [nodes, setNodes] = useState(initialNodes)
  const [edges, setEdges] = useState(initialEdges)
  const [wireColor, setWireColor] = useState(DEFAULT_WIRE_COLOR)

  const onNodesChange = useCallback<OnNodesChange>((changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)), [])
  const onEdgesChange = useCallback<OnEdgesChange>((changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)), [])
  const onConnect = useCallback<OnConnect>(
    (params) => setEdges((edgesSnapshot) => addEdge({ ...params, style: { stroke: wireColor } }, edgesSnapshot)),
    [wireColor],
  )

  // Picking a color arms it for the next wire, and recolors any selected wires
  // so you can fix a mistake without redrawing it.
  const pickWireColor = useCallback((hex: string) => {
    setWireColor(hex)
    setEdges((edgesSnapshot) =>
      edgesSnapshot.map((edge) =>
        edge.selected ? { ...edge, style: { ...edge.style, stroke: hex } } : edge,
      ),
    )
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        defaultEdgeOptions={{ zIndex: WIRE_Z }}
        deleteKeyCode={['Delete', 'Backspace']}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <WirePalette value={wireColor} onChange={pickWireColor} />
      </ReactFlow>
    </div>
  )
}

export default App
