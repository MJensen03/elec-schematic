import type { Edge, Node } from '@xyflow/react'
import { portsOf } from './portLayouts'

/**
 * Turns physical coincidence into electrical connection: a pin sitting exactly
 * on a socket becomes an edge, so `holeNet()` resolves a seated part onto the
 * board's net without any special-casing downstream.
 *
 * Plug edges are hidden -- both endpoints are at the same point, so drawing
 * one would be a zero-length smudge. Contact is shown by seating the part.
 * They are also non-deletable: you unplug by dragging the part off, not by
 * selecting a wire you cannot see.
 */

const PLUG_PREFIX = 'plug__'

export const isPlugEdge = (edge: Edge) => edge.id.startsWith(PLUG_PREFIX)

type PlacedPort = {
  nodeId: string
  portId: string
  x: number
  y: number
}

/** Lattice snapping makes coincident ports exactly equal, so round and key. */
const at = (x: number, y: number) => `${Math.round(x)},${Math.round(y)}`

/**
 * Recomputed from scratch on every move rather than diffed. Unplugging is then
 * just "the pin no longer matches", with no stale-edge bookkeeping.
 */
export function computePlugEdges(nodes: Node[]): Edge[] {
  const pins: PlacedPort[] = []
  const socketAt = new Map<string, PlacedPort>()

  for (const node of nodes) {
    for (const port of portsOf(node)) {
      const placed: PlacedPort = {
        nodeId: node.id,
        portId: port.id,
        x: node.position.x + port.x,
        y: node.position.y + port.y,
      }
      if (port.kind === 'socket') {
        socketAt.set(at(placed.x, placed.y), placed)
      } else {
        pins.push(placed)
      }
    }
  }

  const edges: Edge[] = []
  for (const pin of pins) {
    const socket = socketAt.get(at(pin.x, pin.y))
    if (!socket || socket.nodeId === pin.nodeId) continue

    edges.push({
      id: `${PLUG_PREFIX}${pin.nodeId}.${pin.portId}__${socket.nodeId}.${socket.portId}`,
      source: pin.nodeId,
      sourceHandle: pin.portId,
      target: socket.nodeId,
      targetHandle: socket.portId,
      hidden: true,
      selectable: false,
      deletable: false,
    })
  }

  return edges
}

/** Node ids with at least one pin seated, for the "plugged in" styling. */
export function seatedNodeIds(edges: Edge[]): Set<string> {
  const ids = new Set<string>()
  for (const edge of edges) {
    if (isPlugEdge(edge)) ids.add(edge.source)
  }
  return ids
}
