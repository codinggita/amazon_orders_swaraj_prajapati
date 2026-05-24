import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-6">
        <div className="max-w-lg w-full themed-card rounded-2xl p-8 text-center">
          
          {/* Error icon */}
          <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-800/40
                          flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⚠️</span>
          </div>

          <h1 className="font-hero text-[28px] text-[var(--text-primary)] mb-2">
            Something went wrong
          </h1>
          <p className="font-body text-[13px] text-[var(--text-muted)] mb-6">
            An unexpected error occurred. Please try refreshing the page.
          </p>

          {/* Error details (dev only) */}
          {import.meta.env.DEV && this.state.error && (
            <details className="text-left mb-6">
              <summary className="font-badge text-[11px] text-red-400 cursor-pointer mb-2">
                Error Details (Development)
              </summary>
              <pre className="font-mono text-[10px] text-red-300/60 bg-red-950/30
                              border border-red-900/40 rounded-xl p-3 overflow-auto
                              max-h-32 text-left whitespace-pre-wrap">
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}

          <div className="flex gap-3 justify-center">
            <button
              onClick={this.handleReset}
              className="font-btn text-[14px] bg-red-600 hover:bg-red-700
                         text-white px-6 h-10 rounded-xl transition-colors">
              Try Again
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="font-btn text-[14px] bg-[var(--bg-surface2)] themed-border
                         border text-[var(--text-muted)] px-6 h-10 rounded-xl
                         hover:text-[var(--text-primary)] transition-colors">
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
