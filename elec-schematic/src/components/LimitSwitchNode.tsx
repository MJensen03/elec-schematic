import { Handle, Position } from '@xyflow/react'
import {
  BODY_HEIGHT,
  BODY_TOP,
  LABEL_TOP,
  LEG_TOP,
  LEVER_HEIGHT,
  LEVER_TOP,
  PINS,
  PIN_XS,
  PIN_Y,
  SWITCH_HEIGHT,
  SWITCH_WIDTH,
} from '../lib/limitSwitch'

/**
 * A snap-action limit switch. Geometry lives in ../lib/limitSwitch so plug
 * detection measures the same pin positions this file draws.
 */
export function LimitSwitchNode() {
  return (
    <div className="limit-switch-node" style={{ width: SWITCH_WIDTH, height: SWITCH_HEIGHT }}>
      <div className="ls-lever" style={{ top: LEVER_TOP, height: LEVER_HEIGHT }} />
      <div className="ls-body" style={{ top: BODY_TOP, height: BODY_HEIGHT }} />

      {PINS.map((pin, i) => (
        <div
          key={`leg-${pin.id}`}
          className="ls-leg"
          style={{ left: PIN_XS[i], top: LEG_TOP, height: PIN_Y - LEG_TOP }}
        />
      ))}

      {PINS.map((pin, i) => (
        <Handle
          key={pin.id}
          id={pin.id}
          type="source"
          position={Position.Bottom}
          className="port ls-pin"
          style={{ left: PIN_XS[i], top: PIN_Y }}
        />
      ))}

      {PINS.map((pin, i) => (
        <span key={`label-${pin.id}`} className="ls-label" style={{ left: PIN_XS[i], top: LABEL_TOP }}>
          {pin.label}
        </span>
      ))}
    </div>
  )
}
