import {Component, StrictMode} from 'react';
import type {ErrorInfo, ReactNode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

class ErrorBoundary extends Component<{children: ReactNode}, ErrorBoundaryState> {
  state: ErrorBoundaryState = {hasError: false, message: ''};

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {hasError: true, message: error.message};
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Uncaught render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', background: '#fff'}}>
          <div style={{textAlign: 'center', padding: '2rem'}}>
            <h1 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#111', marginBottom: '0.5rem'}}>Something went wrong</h1>
            <p style={{color: '#555'}}>Please refresh the page. If the problem persists, contact support.</p>
          </div>
        </div>
      );
    }
    return (this as unknown as {props: {children: ReactNode}}).props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
