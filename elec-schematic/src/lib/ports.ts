import type { Node } from '@xyflow/react'

/**
 * A port is one electrical contact on a part, positioned relative to that
 * part's top-left corner.
 *
 * `socket` accepts a pin (a breadboard hole). `pin` seats into a socket (a
 * component leg). Plug detection only ever asks for ports, so it works for any
 * part without knowing what the part is.
 */

export type PortKind = 'pin' | 'socket'

export type Port = {
  /** Doubles as the React Flow handle id. Format: `<net>:<hole>`. */
  id: string
  x: number
  y: number
  kind: PortKind
}

/**
 * Returns a part's ports. Takes the node so layout can depend on node data --
 * e.g. a resistor whose body length varies, or a header with a pin-count prop.
 */
export type PortLayout = (node: Node) => Port[]
