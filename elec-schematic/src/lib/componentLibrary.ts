/**
 * Everything the sidebar offers. To add a component: build its node component,
 * register the node type in App.tsx's `nodeTypes`, then add an entry here.
 * Nothing else needs to change.
 */

export type ComponentSpec = {
  /** Unique within this list; used as the sidebar key. */
  id: string
  /** Must match a key in `nodeTypes`. */
  type: string
  label: string
  /** Dot color in the sidebar list. */
  swatch: string
  /** Initial node data. Copied per placement, never shared. */
  data: Record<string, unknown>
}

export const COMPONENT_LIBRARY: ComponentSpec[] = [
  {
    id: 'breadboard',
    type: 'breadboard',
    label: 'Breadboard',
    swatch: '#efede6',
    data: {},
  },
  {
    id: 'limit-switch',
    type: 'limitSwitch',
    label: 'Limit Switch',
    swatch: '#3a3a3f',
    data: {},
  },
  {
    id: 'led-red',
    type: 'led',
    label: 'LED — Red',
    swatch: '#ef1000',
    data: { color: '#ef1000' },
  },
  {
    id: 'led-green',
    type: 'led',
    label: 'LED — Green',
    swatch: '#22c55e',
    data: { color: '#22c55e' },
  },
  {
    id: 'led-yellow',
    type: 'led',
    label: 'LED — Yellow',
    swatch: '#e8b923',
    data: { color: '#e8b923' },
  },
  {
    id: 'led-blue',
    type: 'led',
    label: 'LED — Blue',
    swatch: '#3b82f6',
    data: { color: '#3b82f6' },
  },
]
