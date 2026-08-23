import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ModuleErrorBoundary from './ModuleErrorBoundary'

function Boom(): never {
  throw new Error('synthetic module crash for test')
}

function Fine() {
  return <div>module rendered fine</div>
}

describe('ModuleErrorBoundary', () => {
  let container: HTMLDivElement
  let root: Root
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    // React logs the caught error to console too; keep test output clean.
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
    consoleErrorSpy.mockRestore()
  })

  it('renders children normally when nothing throws', () => {
    act(() => {
      root.render(
        <ModuleErrorBoundary resetKey="a">
          <Fine />
        </ModuleErrorBoundary>,
      )
    })
    expect(container.textContent).toContain('module rendered fine')
  })

  it('catches a render error and shows a readable fallback instead of crashing', () => {
    act(() => {
      root.render(
        <ModuleErrorBoundary resetKey="a">
          <Boom />
        </ModuleErrorBoundary>,
      )
    })
    expect(container.textContent).toContain('This module hit an error')
    expect(container.textContent).toContain('synthetic module crash for test')
  })

  it('recovers when resetKey changes (module switch or R press)', () => {
    act(() => {
      root.render(
        <ModuleErrorBoundary resetKey="a">
          <Boom />
        </ModuleErrorBoundary>,
      )
    })
    expect(container.textContent).toContain('This module hit an error')

    act(() => {
      root.render(
        <ModuleErrorBoundary resetKey="b">
          <Fine />
        </ModuleErrorBoundary>,
      )
    })
    expect(container.textContent).toContain('module rendered fine')
    expect(container.textContent).not.toContain('This module hit an error')
  })
})
