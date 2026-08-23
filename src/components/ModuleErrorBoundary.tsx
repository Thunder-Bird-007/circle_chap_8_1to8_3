import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  /** Remounts the boundary (clearing the error) whenever this changes --
   * pass the same key used to remount the module itself, so switching
   * away from a broken module and back, or pressing R, gives it a clean
   * second chance rather than staying permanently blacked out. */
  resetKey: string
}

interface State {
  error: Error | null
}

/**
 * Wraps a single module so that a bug in ITS render can never take down
 * the whole app mid-class. The module switcher strip lives outside this
 * boundary (in App.tsx), so even a fully broken module still leaves every
 * other key reachable -- the teacher can just press a different number.
 */
export default class ModuleErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    // eslint-disable-next-line no-console
    console.error('Module crashed:', error, info.componentStack)
  }

  componentDidUpdate(prevProps: Props) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null })
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-3 px-12 text-center">
          <span className="font-display font-black text-3xl text-warn tracking-wide">
            This module hit an error
          </span>
          <span className="font-display text-lg text-chalk/80 max-w-xl">
            {this.state.error.message || 'Unknown error'}
          </span>
          <span className="font-display text-base text-chalk/60">
            Press another number key, or R to try this module again.
          </span>
        </div>
      )
    }
    return this.props.children
  }
}
