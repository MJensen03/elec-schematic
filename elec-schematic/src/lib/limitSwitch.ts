import { ORIGIN, PITCH, lattice } from './geometry'
import type { PortLayout } from './ports'

/**
 * A 3-pin SPDT limit switch: common, normally-open, normally-closed.
 *
 * Pins sit on lattice columns 0, 1 and 2, so the part straddles three adjacent
 * breadboard columns -- three separate nets, one per terminal.
 */

/**
 * The only number that changes the part's overall height, because PIN_Y must
 * land on the lattice to seat. Everything below is measured off the top of the
 * part or off PIN_Y, so the node's box hugs the drawing with no dead space.
 */
const PIN_ROW = 2

export const PIN_XS = [lattice(0), lattice(1), lattice(2)]
export const PIN_Y = lattice(PIN_ROW)

export const LEVER_TOP = 0
export const LEVER_HEIGHT = 3

export const BODY_TOP = LEVER_TOP + 6
export const BODY_HEIGHT = 25
/** Legs run from the bottom of the body down to the pins. */
export const LEG_TOP = BODY_TOP + BODY_HEIGHT

export const LABEL_TOP = PIN_Y + 5

export const SWITCH_WIDTH = ORIGIN * 2 + 2 * PITCH
export const SWITCH_HEIGHT = LABEL_TOP + 9

/** Terminal order matches PIN_XS, left to right. */
export const PINS = [
  { id: 'COM:1', label: 'C' },
  { id: 'NO:1', label: 'NO' },
  { id: 'NC:1', label: 'NC' },
]

export const limitSwitchPorts: PortLayout = () =>
  PINS.map((pin, i) => ({ id: pin.id, x: PIN_XS[i], y: PIN_Y, kind: 'pin' as const }))
