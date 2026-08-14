import { ORIGIN, PITCH, lattice } from './geometry'
import type { Port, PortLayout } from './ports'

/**
 * Breadboard geometry and electrical topology, in one place. The node
 * component renders from these values and plug detection measures against
 * them, so the picture and the netlist can never drift apart.
 */

export const COLS = 10

// Lattice row indices, top to bottom.
const ROW_TOP_POS = 0
const ROW_TOP_NEG = 1
const ROWS_UPPER = [3, 4, 5, 6, 7]
const ROW_CHANNEL = 8
const ROWS_LOWER = [9, 10, 11, 12, 13]
const ROW_BOT_POS = 15
const ROW_BOT_NEG = 16
const LAST_ROW = ROW_BOT_NEG

const UPPER_LABELS = ['a', 'b', 'c', 'd', 'e']
const LOWER_LABELS = ['f', 'g', 'h', 'i', 'j']

export const BOARD_WIDTH = ORIGIN * 2 + (COLS - 1) * PITCH
export const BOARD_HEIGHT = ORIGIN * 2 + LAST_ROW * PITCH

export const CHANNEL_HEIGHT = 16
export const CHANNEL_TOP = lattice(ROW_CHANNEL) - CHANNEL_HEIGHT / 2

/** Silkscreen marker lines beside each rail. */
export const RAIL_LINES = [
  { key: 'tp', y: lattice(ROW_TOP_POS) - 9, polarity: 'pos' },
  { key: 'tn', y: lattice(ROW_TOP_NEG) + 9, polarity: 'neg' },
  { key: 'bp', y: lattice(ROW_BOT_POS) - 9, polarity: 'pos' },
  { key: 'bn', y: lattice(ROW_BOT_NEG) + 9, polarity: 'neg' },
]

/**
 * Every hole, with its net baked into the id.
 *
 * A rail's ten holes share one net. A terminal-strip column's five holes share
 * one net, and the upper and lower strips are separate because the channel
 * breaks them -- exactly the topology of the real part.
 */
export const HOLES: Port[] = buildHoles()

function buildHoles(): Port[] {
  const holes: Port[] = []

  const rail = (net: string, row: number) => {
    for (let col = 0; col < COLS; col++) {
      holes.push({ id: `${net}:${col}`, x: lattice(col), y: lattice(row), kind: 'socket' })
    }
  }

  const strip = (prefix: string, labels: string[], rows: number[]) => {
    for (let col = 0; col < COLS; col++) {
      rows.forEach((row, i) => {
        holes.push({
          id: `${prefix}${col + 1}:${labels[i]}`,
          x: lattice(col),
          y: lattice(row),
          kind: 'socket',
        })
      })
    }
  }

  rail('TOP+', ROW_TOP_POS)
  rail('TOP-', ROW_TOP_NEG)
  strip('U', UPPER_LABELS, ROWS_UPPER)
  strip('L', LOWER_LABELS, ROWS_LOWER)
  rail('BOT+', ROW_BOT_POS)
  rail('BOT-', ROW_BOT_NEG)

  return holes
}

export const boardPorts: PortLayout = () => HOLES
