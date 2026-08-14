import { COMPONENT_LIBRARY, type ComponentSpec } from '../lib/componentLibrary'

type SidebarProps = {
  /** Called with the picked spec; the editor decides where to drop it. */
  onAdd: (spec: ComponentSpec) => void
}

export function Sidebar({ onAdd }: SidebarProps) {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Components</h2>
      <ul className="sidebar-list">
        {COMPONENT_LIBRARY.map((spec) => (
          <li key={spec.id}>
            <button type="button" className="sidebar-item" onClick={() => onAdd(spec)}>
              <span className="sidebar-swatch" style={{ background: spec.swatch }} />
              {spec.label}
            </button>
          </li>
        ))}
      </ul>
      <p className="sidebar-hint">Click to place at the center of the view.</p>
    </aside>
  )
}
