import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardBody, Button } from '@nextui-org/react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('BarcodeScanner Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Card>
          <CardBody>
            <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
              <h4 className="text-lg font-semibold text-danger-700 mb-2">
                Scanner Error
              </h4>
              <p className="text-danger-600 mb-4">
                {this.state.error?.message || 'An error occurred with the barcode scanner.'}
              </p>
              <Button
                color="danger"
                size="sm"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                }}
              >
                Try Again
              </Button>
            </div>
          </CardBody>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

