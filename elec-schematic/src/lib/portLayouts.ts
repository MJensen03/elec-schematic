import type { Node } from '@xyflow/react'
import { boardPorts } from './breadboard'
import { ledPorts } from './led'
import { limitSwitchPorts } from './limitSwitch'
import type { Port, PortLayout } from './ports'

/**
 * Node type -> port layout. This is the only file plug detection consults, and
 * the only one a new part has to be added to.
 *
 * Adding a resistor, limit switch, speaker, etc:
 *   1. src/lib/<part>.ts  -- geometry constants + a `PortLayout`
 *   2. src/components/<Part>Node.tsx -- renders from those constants
 *   3. one line here, and one entry in componentLibrary.ts
 */
export const PORT_LAYOUTS: Record<string, PortLayout> = {
  breadboard: boardPorts,
  led: ledPorts,
  limitSwitch: limitSwitchPorts,
}

export function portsOf(node: Node): Port[] {
  const layout = PORT_LAYOUTS[node.type ?? '']
  return layout ? layout(node) : []
}
