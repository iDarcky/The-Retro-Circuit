'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorInfo?: string;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Explicitly declare props to satisfy TypeScript if inference from Component fails
  declare props: Readonly<ErrorBoundaryProps>;

  public state: ErrorBoundaryState = {
    hasError: false
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorInfo: error.toString() };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('System Crash:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-[#0000AA] text-white font-mono p-8 flex flex-col items-center justify-center text-center z-[100] overflow-y-auto">
          <h1 className="text-4xl mb-4 bg-gray-300 text-[#0000AA] px-4 font-bold">FATAL ERROR</h1>
          <p className="text-xl mb-8">A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) + 00010E36.</p>
          
          <div className="text-left border-2 border-white p-4 mb-8 max-w-2xl bg-[#000088] w-full">
             <p className="mb-2 text-yellow-300">Technical Information:</p>
             <pre className="whitespace-pre-wrap break-words font-mono text-sm">{this.state.errorInfo}</pre>
          </div>
          
          <p className="animate-pulse mb-8 text-retro-neon">* Press RESTART to terminate the current application.</p>
          <p className="text-sm opacity-75 mb-8">Press any key to continue _</p>
          
          <button 
            onClick={() => window.location.reload()}
            className="border-2 border-white px-6 py-2 hover:bg-white hover:text-[#0000AA] font-bold uppercase transition-colors"
          >
            Restart System
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;