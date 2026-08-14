/**
 * The global lattice every part sits on.
 *
 * PITCH is the on-screen stand-in for 0.1" on a real board. ORIGIN is the
 * padding from a node's top-left corner to its first lattice position, and is
 * deliberately shared by every component: because each part's ports are at
 * `ORIGIN + n * PITCH` and node positions snap to multiples of PITCH, any pin
 * dropped near a hole lands on it exactly. Give one component a different
 * origin and it can never seat.
 */
export const PITCH = 14
export const ORIGIN = 12

/** Offset of lattice index `i` from a node's top-left corner. */
export const lattice = (i: number) => ORIGIN + i * PITCH

/** Round a canvas coordinate onto the lattice. */
export const snap = (v: number) => Math.round(v / PITCH) * PITCH
