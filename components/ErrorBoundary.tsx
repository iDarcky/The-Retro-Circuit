import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('System Crash:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-[#0000AA] text-white font-mono p-8 flex flex-col items-center justify-center text-center z-[100]">
          <div className="max-w-2xl w-full">
            <h1 className="text-2xl md:text-4xl mb-8 font-bold bg-gray-300 text-[#0000AA] inline-block px-4">
              WINDOWS PROTECTION ERROR
            </h1>
            <p className="mb-4 text-lg">A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) + 00010E36.</p>
            <p className="mb-8 text-lg">The current application will be terminated.</p>
            
            <ul className="text-left list-disc pl-8 mb-8 space-y-2">
              <li>Press any key to terminate the current application.</li>
              <li>Press CTRL+ALT+DEL again to restart your computer. You will lose any unsaved information in all applications.</li>
            </ul>

            <button
              onClick={() => window.location.reload()}
              className="mt-8 px-8 py-3 border-2 border-white hover:bg-white hover:text-[#0000AA] font-bold transition-colors uppercase tracking-widest"
            >
              Press any key to continue
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;