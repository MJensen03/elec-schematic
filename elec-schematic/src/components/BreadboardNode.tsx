import { Handle, Position } from '@xyflow/react'

/**
 * A small solderless breadboard: two power rails top and bottom, and two
 * terminal strips (rows a-e and f-j) split by the center channel.
 *
 * Every hole is a React Flow handle. Handle ids are `<net>:<hole>` so that
 * connectivity can be resolved without knowing the board's geometry --
 * two wires dropped into holes with the same net prefix are electrically
 * common, exactly like the real thing. See `holeNet` in ../lib/nets.
 */

const COLS = 10
const PITCH = 14
const MARGIN_X = 16

const WIDTH = MARGIN_X * 2 + (COLS - 1) * PITCH
const HEIGHT = 260

// y-centers for each row of holes
const RAIL_TOP_POS = 18
const RAIL_TOP_NEG = 32
const UPPER_Y = [58, 72, 86, 100, 114]
const LOWER_Y = [146, 160, 174, 188, 202]
const RAIL_BOT_POS = 228
const RAIL_BOT_NEG = 242

const CHANNEL_TOP = 122
const CHANNEL_HEIGHT = 16

const UPPER_ROWS = ['a', 'b', 'c', 'd', 'e']
const LOWER_ROWS = ['f', 'g', 'h', 'i', 'j']

const colX = (col: number) => MARGIN_X + col * PITCH

function Hole({ id, x, y }: { id: string; x: number; y: number }) {
  return (
    <Handle
      id={id}
      type="source"
      position={y < CHANNEL_TOP ? Position.Top : Position.Bottom}
      className="bb-hole"
      style={{ left: x, top: y }}
    />
  )
}

/** One horizontal rail: all holes share a single net. */
function Rail({ net, y }: { net: string; y: number }) {
  return (
    <>
      {Array.from({ length: COLS }, (_, col) => (
        <Hole key={col} id={`${net}:${col}`} x={colX(col)} y={y} />
      ))}
    </>
  )
}

/** One terminal strip: each column is its own net, shared by its 5 holes. */
function Strip({ prefix, rows, ys }: { prefix: string; rows: string[]; ys: number[] }) {
  return (
    <>
      {Array.from({ length: COLS }, (_, col) =>
        rows.map((row, i) => (
          <Hole
            key={`${col}-${row}`}
            id={`${prefix}${col + 1}:${row}`}
            x={colX(col)}
            y={ys[i]}
          />
        )),
      )}
    </>
  )
}

export function BreadboardNode() {
  return (
    <div className="breadboard-node" style={{ width: WIDTH, height: HEIGHT }}>
      {/* silkscreen: rail marker lines */}
      <div className="bb-rail-line bb-pos" style={{ top: RAIL_TOP_POS - 10 }} />
      <div className="bb-rail-line bb-neg" style={{ top: RAIL_TOP_NEG + 10 }} />
      <div className="bb-rail-line bb-pos" style={{ top: RAIL_BOT_POS - 10 }} />
      <div className="bb-rail-line bb-neg" style={{ top: RAIL_BOT_NEG + 10 }} />

      {/* the DIP channel down the middle */}
      <div className="bb-channel" style={{ top: CHANNEL_TOP, height: CHANNEL_HEIGHT }} />

      <Rail net="TOP+" y={RAIL_TOP_POS} />
      <Rail net="TOP-" y={RAIL_TOP_NEG} />
      <Strip prefix="U" rows={UPPER_ROWS} ys={UPPER_Y} />
      <Strip prefix="L" rows={LOWER_ROWS} ys={LOWER_Y} />
      <Rail net="BOT+" y={RAIL_BOT_POS} />
      <Rail net="BOT-" y={RAIL_BOT_NEG} />
    </div>
  )
}
