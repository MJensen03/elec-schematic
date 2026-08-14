import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'
import {
  ANODE_X,
  BODY_SIZE,
  CATHODE_X,
  DEFAULT_LED_COLOR,
  LED_HEIGHT,
  LED_WIDTH,
  LEG_TOP,
  PIN_Y,
} from '../lib/led'

/**
 * A 5mm LED. Geometry lives in ../lib/led so plug detection measures the same
 * pin positions this file draws.
 *
 * Body color comes from node data, so one component definition covers the
 * whole bag of LEDs.
 */

export type LedData = {
  /** Lens color. Defaults to red. */
  color?: string
}

type LedNodeType = Node<LedData, 'led'>

export function LedNode({ data }: NodeProps<LedNodeType>) {
  const color = data.color ?? DEFAULT_LED_COLOR

  return (
    <div className="led-node" style={{ width: LED_WIDTH, height: LED_HEIGHT }}>
      <div
        className="led-body"
        style={{
          width: BODY_SIZE,
          height: BODY_SIZE,
          left: LED_WIDTH / 2 - BODY_SIZE / 2,
          background: color,
          boxShadow: `0 0 7px ${color}`,
        }}
      >
        {/* the flat on a real LED marks the cathode */}
        <span className="led-flat" />
      </div>

      <span className="led-polarity" style={{ left: ANODE_X - 9, top: LEG_TOP + 2 }}>+</span>

      <div className="led-leg" style={{ left: ANODE_X, top: LEG_TOP, height: PIN_Y - LEG_TOP }} />
      <div className="led-leg" style={{ left: CATHODE_X, top: LEG_TOP, height: PIN_Y - LEG_TOP }} />

      <Handle
        id="A:1"
        type="source"
        position={Position.Bottom}
        className="port led-pin"
        style={{ left: ANODE_X, top: PIN_Y }}
      />
      <Handle
        id="K:1"
        type="source"
        position={Position.Bottom}
        className="port led-pin"
        style={{ left: CATHODE_X, top: PIN_Y }}
      />
    </div>
  )
}
