import { useState, useCallback, useMemo, useRef } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
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
import { LedNode } from './components/LedNode'
import { LimitSwitchNode } from './components/LimitSwitchNode'
import { Sidebar } from './components/Sidebar'
import { WirePalette } from './components/WirePalette'
import { DEFAULT_WIRE_COLOR } from './lib/wireColors'
import { PITCH, snap } from './lib/geometry'
import { computePlugEdges, isPlugEdge, seatedNodeIds } from './lib/plugging'
import type { ComponentSpec } from './lib/componentLibrary'
import '@xyflow/react/dist/style.css'
import './App.css'

// Must live outside the component: a new object each render makes React Flow
// re-register every node type and warn about it.
const nodeTypes: NodeTypes = {
  breadboard: BreadboardNode,
  led: LedNode,
  limitSwitch: LimitSwitchNode,
}

// Wires must paint above the boards they run across: React Flow renders the
// edge layer before the node layer, and both default to z-index 0. Selecting a
// node lifts it to SELECTED_NODE_Z (1000) and edges do not follow, so sit above
// that too -- on a schematic a wire is always on top of the board.
const WIRE_Z = 1001

const initialNodes: Node[] = [
  { id: 'n1', type: 'breadboard', position: { x: 0, y: 0 }, data: {} },
  // Seats into U3:e / U4:e on the board above -- drag it off to unplug.
  { id: 'n2', type: 'led', position: { x: 28, y: 70 }, data: { color: '#ef1000' } },
]

const initialEdges: Edge[] = computePlugEdges(initialNodes)

let nodeSeq = 0
const nextNodeId = () => `c${++nodeSeq}`

function Editor() {
  const [nodes, setNodes] = useState(initialNodes)
  const [edges, setEdges] = useState(initialEdges)
  const [wireColor, setWireColor] = useState(DEFAULT_WIRE_COLOR)

  const canvasRef = useRef<HTMLDivElement>(null)
  const { screenToFlowPosition, getNodes } = useReactFlow()

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

  // Drop every plug edge and rebuild, so unseating a part clears its
  // connections without any per-edge bookkeeping. Wires you drew are untouched.
  const reconcilePlugs = useCallback((currentNodes: Node[]) => {
    setEdges((edgesSnapshot) => [
      ...edgesSnapshot.filter((edge) => !isPlugEdge(edge)),
      ...computePlugEdges(currentNodes),
    ])
  }, [])

  // getNodes() reads the live store, so this sees the final dropped position.
  const onNodeDragStop = useCallback(() => reconcilePlugs(getNodes()), [getNodes, reconcilePlugs])

  // Drop new components at the middle of whatever the user is currently
  // looking at, snapped to the lattice so they can seat immediately.
  const addComponent = useCallback(
    (spec: ComponentSpec) => {
      const rect = canvasRef.current?.getBoundingClientRect()
      const raw = rect
        ? screenToFlowPosition({ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 })
        : { x: 0, y: 0 }
      const position = { x: snap(raw.x), y: snap(raw.y) }

      setNodes((nodesSnapshot) => {
        const next = [
          ...nodesSnapshot,
          { id: nextNodeId(), type: spec.type, position, data: { ...spec.data } },
        ]
        reconcilePlugs(next)
        return next
      })
    },
    [screenToFlowPosition, reconcilePlugs],
  )

  // Seated parts get a marker class so their pins can read as "in the hole".
  const seated = useMemo(() => seatedNodeIds(edges), [edges])
  const renderNodes = useMemo(
    () => nodes.map((node) => (seated.has(node.id) ? { ...node, className: 'is-seated' } : node)),
    [nodes, seated],
  )

  return (
    <div className="editor">
      <Sidebar onAdd={addComponent} />
      <div className="canvas" ref={canvasRef}>
        <ReactFlow
          nodes={renderNodes}
          edges={edges}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          defaultEdgeOptions={{ zIndex: WIRE_Z }}
          deleteKeyCode={['Delete', 'Backspace']}
          snapToGrid
          snapGrid={[PITCH, PITCH]}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDragStop={onNodeDragStop}
          fitView
        >
          <Background gap={PITCH} />
          <WirePalette value={wireColor} onChange={pickWireColor} />
        </ReactFlow>
      </div>
    </div>
  )
}

// screenToFlowPosition needs the store, and the sidebar sits outside <ReactFlow>.
export default function App() {
  return (
    <ReactFlowProvider>
      <Editor />
    </ReactFlowProvider>
  )
}
