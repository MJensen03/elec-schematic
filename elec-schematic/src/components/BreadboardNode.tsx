import { Handle, Position } from '@xyflow/react'
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  CHANNEL_HEIGHT,
  CHANNEL_TOP,
  HOLES,
  RAIL_LINES,
} from '../lib/breadboard'

/**
 * A small solderless breadboard: two power rails top and bottom, and two
 * terminal strips (rows a-e and f-j) split by the center channel.
 *
 * Layout and net topology live in ../lib/breadboard -- this file only draws
 * them. Every hole is a React Flow handle whose id is `<net>:<hole>`, so
 * connectivity resolves from edge endpoints alone. See `holeNet` in ../lib/nets.
 */
export function BreadboardNode() {
  return (
    <div className="breadboard-node" style={{ width: BOARD_WIDTH, height: BOARD_HEIGHT }}>
      {RAIL_LINES.map((line) => (
        <div key={line.key} className={`bb-rail-line bb-${line.polarity}`} style={{ top: line.y }} />
      ))}

      <div className="bb-channel" style={{ top: CHANNEL_TOP, height: CHANNEL_HEIGHT }} />

      {HOLES.map((hole) => (
        <Handle
          key={hole.id}
          id={hole.id}
          type="source"
          position={hole.y < CHANNEL_TOP ? Position.Top : Position.Bottom}
          className="port bb-hole"
          style={{ left: hole.x, top: hole.y }}
        />
      ))}
    </div>
  )
}
