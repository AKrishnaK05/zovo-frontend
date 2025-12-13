// frontend/src/components/AppErrorBoundary.jsx
import React from 'react';

export default class AppErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { console.error('App error', error, info); }
  render() {
    if (this.state.hasError) {
      return <div className="min-h-screen flex items-center justify-center">Something went wrong. Reload the app.</div>;
    }
    return this.props.children;
  }
}
