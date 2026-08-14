import { ORIGIN, lattice } from './geometry'
import type { PortLayout } from './ports'

/**
 * LED geometry. Legs sit one pitch apart on lattice columns 0 and 1, so the
 * part straddles two adjacent breadboard columns -- two separate nets, which
 * is how you'd actually seat an LED.
 */

const PIN_ROW = 2

export const ANODE_X = lattice(0)
export const CATHODE_X = lattice(1)
export const PIN_Y = lattice(PIN_ROW)

export const BODY_SIZE = 24
export const LEG_TOP = BODY_SIZE - 2

export const LED_WIDTH = ORIGIN * 2 + (CATHODE_X - ANODE_X)
export const LED_HEIGHT = PIN_Y + 6

export const DEFAULT_LED_COLOR = '#ef1000'

export const ledPorts: PortLayout = () => [
  { id: 'A:1', x: ANODE_X, y: PIN_Y, kind: 'pin' },
  { id: 'K:1', x: CATHODE_X, y: PIN_Y, kind: 'pin' },
]
