import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { failed: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State { return { failed: true } }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Frontend rendering error', error, info.componentStack)
  }

  render() {
    if (this.state.failed) return <main className="not-found"><span>!</span><h1>Une erreur est survenue</h1><p>Rechargez la page pour réessayer.</p><button className="primary-action" onClick={() => window.location.reload()}>Recharger</button></main>
    return this.props.children
  }
}
