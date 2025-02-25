import React, { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  handleReset = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full border border-red-200 dark:border-red-900">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900 rounded-full">
              <AlertTriangle className="text-red-600 dark:text-red-300" />
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
              The application encountered an unexpected error. Try refreshing the page.
            </p>
            <details className="mb-6 bg-gray-50 dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700">
              <summary className="cursor-pointer text-gray-700 dark:text-gray-300 font-medium">
                Error details
              </summary>
              <pre className="mt-2 text-xs text-gray-600 dark:text-gray-400 overflow-auto max-h-48 p-2 bg-gray-100 dark:bg-gray-950 rounded">
                {this.state.error?.toString() || "Unknown error"}
              </pre>
            </details>
            <div className="flex justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Application
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}