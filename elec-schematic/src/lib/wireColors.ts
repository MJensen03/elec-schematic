/**
 * The wire colors offered in the palette. Add, remove, or re-hex entries here
 * and the palette UI, the default selection, and new wires all follow.
 */

export type WireColor = {
  id: string
  label: string
  hex: string
}

export const WIRE_COLORS: WireColor[] = [
  { id: 'red', label: 'Red', hex: '#ef1000' },
  { id: 'black', label: 'Black', hex: '#1c1c1e' },
  { id: 'brown', label: 'Brown', hex: '#8b5a2b' },
  { id: 'yellow', label: 'Yellow', hex: '#e8b923' },
  { id: 'blue', label: 'blue', hex: '#0f0bd3'}
]

export const DEFAULT_WIRE_COLOR = WIRE_COLORS[0].hex
