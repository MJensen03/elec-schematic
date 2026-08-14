import { Panel } from '@xyflow/react'
import { WIRE_COLORS } from '../lib/wireColors'

type WirePaletteProps = {
  /** Hex of the currently armed color. */
  value: string
  /** Called with the picked hex. */
  onChange: (hex: string) => void
}

export function WirePalette({ value, onChange }: WirePaletteProps) {
  return (
    <Panel position="top-left" className="wire-palette">
      <span className="wire-palette-label">Wire</span>
      {WIRE_COLORS.map((color) => (
        <button
          key={color.id}
          type="button"
          title={color.label}
          aria-label={color.label}
          aria-pressed={value === color.hex}
          className={value === color.hex ? 'wire-swatch is-active' : 'wire-swatch'}
          style={{ background: color.hex }}
          onClick={() => onChange(color.hex)}
        />
      ))}
    </Panel>
  )
}
