import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
            style={{ backgroundColor: '#fef2f2' }}
          >
            ⚠️
          </div>
          <h1 className="text-2xl font-black text-ink">Something went wrong</h1>
          <p className="text-sm text-muted max-w-md">
            An unexpected error occurred. Please refresh the page or return to the store.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-6 py-3 rounded-xl text-sm font-bold border"
              style={{ borderColor: '#e0e0e0', color: '#555' }}
            >
              Try again
            </button>
            <button
              onClick={() => { window.location.href = '/' }}
              className="px-6 py-3 rounded-xl text-sm font-bold text-white"
              style={{ backgroundColor: '#0056b3' }}
            >
              Back to Store
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
