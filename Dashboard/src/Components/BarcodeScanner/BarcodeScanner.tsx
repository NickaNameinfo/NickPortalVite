import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, CardBody } from '@nextui-org/react';

// Declare Html5Qrcode type
declare global {
  interface Window {
    Html5Qrcode: any;
  }
}

interface BarcodeScannerProps {
  onScanSuccess: (barcode: string) => void;
  onError?: (error: string) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScanSuccess, onError }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLibraryLoaded, setIsLibraryLoaded] = useState(false);
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrCodeRef = useRef<any>(null);
  const lastScannedRef = useRef<string | { barcode: string; timestamp: number }>('');
  const scannerIdRef = useRef<string>(`barcode-scanner-${Math.random().toString(36).substring(2, 9)}`);

  // Load html5-qrcode library
  useEffect(() => {
    // Check if library is already loaded
    if (window.Html5Qrcode) {
      setIsLibraryLoaded(true);
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="html5-qrcode"]');
    if (existingScript) {
      const checkLibrary = () => {
        if (window.Html5Qrcode) {
          setIsLibraryLoaded(true);
        } else {
          setTimeout(checkLibrary, 100);
        }
      };
      existingScript.addEventListener('load', checkLibrary);
      checkLibrary();
      return;
    }

    // Load the library
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js';
    script.async = true;
    script.onload = () => {
      console.log('Html5Qrcode library loaded');
      // Small delay to ensure library is fully initialized
      setTimeout(() => {
        setIsLibraryLoaded(true);
      }, 100);
    };
    script.onerror = () => {
      console.error('Failed to load Html5Qrcode library');
      setError('Failed to load scanner library. Please refresh the page.');
      onError?.('Failed to load scanner library');
    };
    document.body.appendChild(script);

    return () => {
      // Don't remove script on cleanup - keep it for reuse
    };
  }, [onError]);

  const checkCameraPermission = async (): Promise<boolean | null> => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return null; // API not supported
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        return false; // Permission denied
      }
      return null; // Other error (device not found, etc.)
    }
  };

  const startScanning = async () => {
    if (isScanning) {
      return;
    }

    try {
      // Check if library is loaded
      if (!isLibraryLoaded || !window.Html5Qrcode) {
        setError('Scanner library is loading. Please wait a moment and try again.');
        onError?.('Scanner library not loaded');
        return;
      }

      // Check browser support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Your browser does not support camera access. Please use a modern browser like Chrome, Firefox, or Safari.');
        onError?.('Browser does not support camera');
        return;
      }

      // Wait a bit to ensure DOM is ready
      await new Promise(resolve => setTimeout(resolve, 200));

      if (!scannerRef.current) {
        setError('Scanner container not found');
        return;
      }

      // Ensure the element has the ID and is in DOM
      const elementId = scannerIdRef.current;
      if (!scannerRef.current.id) {
        scannerRef.current.id = elementId;
      }
      
      // Verify element exists in DOM
      const elementInDom = document.getElementById(elementId);
      if (!elementInDom) {
        setError('Scanner container not found in DOM');
        console.error('Element not found:', elementId, scannerRef.current);
        return;
      }

      // Clear any existing scanner instance
      if (html5QrCodeRef.current) {
        try {
          await html5QrCodeRef.current.stop();
          await html5QrCodeRef.current.clear();
        } catch (e) {
          console.warn('Error clearing previous scanner:', e);
        }
        html5QrCodeRef.current = null;
      }

      // Clear the container content (scanner will render into it)
      elementInDom.innerHTML = '';

      setError(null);

      console.log('Creating scanner with element ID:', elementId);
      const Html5Qrcode = window.Html5Qrcode;
      
      // Create new scanner instance (like the working HTML version)
      html5QrCodeRef.current = new Html5Qrcode(elementId);
      console.log('Scanner instance created:', html5QrCodeRef.current);

      // Start scanner using .then()/.catch() pattern like the working HTML version
      console.log('Starting scanner...');
      html5QrCodeRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText: string) => {
          try {
            // Avoid duplicate scans within 2 seconds (allows re-scanning after delay)
            const now = Date.now();
            const lastScanTime = (lastScannedRef.current as any).timestamp || 0;
            const timeSinceLastScan = now - lastScanTime;
            
            if (decodedText === (lastScannedRef.current as any).barcode && timeSinceLastScan < 2000) {
              return; // Ignore duplicate scan within 2 seconds
            }
            
            // Store barcode with timestamp
            (lastScannedRef.current as any) = {
              barcode: decodedText,
              timestamp: now
            };
            
            console.log('Barcode scanned:', decodedText);
            onScanSuccess(decodedText);
            
            // Clear after 2 seconds to allow re-scanning
            setTimeout(() => {
              if ((lastScannedRef.current as any).barcode === decodedText) {
                (lastScannedRef.current as any) = '';
              }
            }, 2000);
          } catch (callbackError) {
            console.error('Error in scan success callback:', callbackError);
          }
        },
        (errorMessage: string) => {
          // Ignore scan failures (camera might be adjusting)
          // Only log if it's a significant error
          if (errorMessage && !errorMessage.includes('No QR code') && !errorMessage.includes('NotFoundException')) {
            console.debug('Scan error:', errorMessage);
          }
        }
      ).then(() => {
        // Success - scanner started
        console.log('Scanner started successfully');
        setIsScanning(true);
        setHasPermission(true);
        setError(null);
      }).catch((err: any) => {
        console.error('Error starting scanner:', err);
        console.error('Error details:', {
          name: err.name,
          message: err.message,
          stack: err.stack
        });
        setIsScanning(false);
        let errorMessage = 'Failed to start camera';

        if (err.name === 'NotAllowedError' || err.message?.includes('permission')) {
          errorMessage = 'Camera permission denied. Please allow camera access.';
          setHasPermission(false);
        } else if (err.message?.includes('not found') || err.message?.includes('No camera')) {
          errorMessage = 'No camera found. Please connect a camera device.';
          setHasPermission(null);
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          errorMessage = 'Camera is already in use by another application.';
          setHasPermission(null);
        } else {
          errorMessage = `Camera error: ${err.message || err.name || 'Unknown error'}`;
        }

        setError(errorMessage);
        onError?.(errorMessage);
        
        // Clean up failed instance
        html5QrCodeRef.current = null;
      });
    } catch (err: any) {
      console.error('Error starting scanner:', err);
      setIsScanning(false);
      let errorMessage = 'Failed to start camera';

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = 'Camera permission denied. Please allow camera access in your browser settings and try again.';
        setHasPermission(false);
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage = 'No camera found. Please connect a camera device.';
        setHasPermission(null);
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage = 'Camera is already in use by another application. Please close other apps using the camera.';
        setHasPermission(null);
      } else if (err.name === 'OverconstrainedError') {
        // Try without facingMode constraint
        try {
          // Clear previous instance
          if (html5QrCodeRef.current) {
            try {
              await html5QrCodeRef.current.stop();
              await html5QrCodeRef.current.clear();
            } catch (e) {
              // Ignore cleanup errors
            }
            html5QrCodeRef.current = null;
          }

          if (scannerRef.current) {
            const Html5Qrcode = window.Html5Qrcode;
            const elementId = scannerRef.current.id || scannerIdRef.current;
            scannerRef.current.id = elementId;
            
            html5QrCodeRef.current = new Html5Qrcode(elementId);
            
            await html5QrCodeRef.current.start(
              { facingMode: 'user' },
              {
                fps: 10,
                qrbox: { width: 250, height: 250 },
              },
              (decodedText: string) => {
                const now = Date.now();
                const lastScanTime = (lastScannedRef.current as any).timestamp || 0;
                const timeSinceLastScan = now - lastScanTime;
                
                if (decodedText === (lastScannedRef.current as any).barcode && timeSinceLastScan < 2000) {
                  return;
                }
                
                (lastScannedRef.current as any) = {
                  barcode: decodedText,
                  timestamp: now
                };
                
                console.log('Barcode scanned:', decodedText);
                onScanSuccess(decodedText);
                
                setTimeout(() => {
                  if ((lastScannedRef.current as any).barcode === decodedText) {
                    (lastScannedRef.current as any) = '';
                  }
                }, 2000);
              },
              () => {}
            );
            setIsScanning(true);
            setHasPermission(true);
            setError(null);
            return;
          }
        } catch (retryErr: any) {
          console.error('Retry error:', retryErr);
          errorMessage = `Camera error: ${retryErr.message || retryErr.name || 'Unknown error'}`;
        }
      } else {
        errorMessage = `Camera error: ${err.message || err.name || 'Unknown error'}`;
      }

      setError(errorMessage);
      onError?.(errorMessage);
    }
  };

  const stopScanning = async () => {
    if (!isScanning || !html5QrCodeRef.current) {
      return;
    }

    try {
      await html5QrCodeRef.current.stop();
      await html5QrCodeRef.current.clear();
      html5QrCodeRef.current = null;
      setIsScanning(false);
      lastScannedRef.current = ''; // Clear to allow re-scanning
      setError(null);
    } catch (err) {
      console.error('Error stopping scanner:', err);
      // Force cleanup even if stop fails
      setIsScanning(false);
      html5QrCodeRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
        html5QrCodeRef.current.clear().catch(() => {});
      }
    };
  }, []);

  return (
    <Card>
      <CardBody>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            {/* <h4 className="text-lg font-semibold">Barcode Scanner</h4> */}
            <div className="flex gap-2">
              <Button
                color="primary"
                size="sm"
                onClick={() => {
                  try {
                    startScanning();
                  } catch (err) {
                    console.error('Error in startScanning:', err);
                    setError('Failed to start scanner. Please try again.');
                    setIsScanning(false);
                  }
                }}
                isDisabled={isScanning || !isLibraryLoaded}
                isLoading={!isLibraryLoaded && !error}
              >
                {!isLibraryLoaded ? 'Loading...' : isScanning ? 'Scanning...' : 'Start Scanner'}
              </Button>
              <Button
                color="default"
                size="sm"
                variant="flat"
                onClick={() => {
                  try {
                    stopScanning();
                  } catch (err) {
                    console.error('Error in stopScanning:', err);
                    setIsScanning(false);
                  }
                }}
                isDisabled={!isScanning}
              >
                Stop
              </Button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 text-sm">
              {error}
              <Button
                size="sm"
                variant="light"
                color="danger"
                className="mt-2"
                onClick={() => {
                  setError(null);
                  setIsScanning(false);
                  if (html5QrCodeRef.current) {
                    html5QrCodeRef.current.stop().catch(() => {});
                    html5QrCodeRef.current.clear().catch(() => {});
                    html5QrCodeRef.current = null;
                  }
                }}
              >
                Clear Error
              </Button>
            </div>
          )}

          {hasPermission === false && !error && (
            <div className="p-3 bg-warning-50 border border-warning-200 rounded-lg text-warning-700 text-sm">
              Camera permission required. Click "Start Scanner" and allow camera access when prompted.
            </div>
          )}

          <div
            className={`w-full rounded-lg overflow-hidden border-2 ${
              isScanning ? 'border-primary' : 'border-default-200'
            }`}
            style={{ 
              minHeight: '150px', 
              maxHeight: '150px', 
              position: 'relative',
              backgroundColor: isScanning ? 'transparent' : '#f4f4f5',
            }}
          >
            {/* Scanner container - must be empty for scanner to render */}
            <div
              id={scannerIdRef.current}
              ref={scannerRef}
              style={{ 
                width: '100%',
                height: '150px',  
                minHeight: '150px',
                position: 'relative'
              }}
            />
            
            {/* Placeholder overlay - only shown when not scanning */}
            {!isScanning && (
              <div 
                className="flex items-center justify-center text-default-500"
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  bottom: 0, 
                  zIndex: 10,
                  backgroundColor: '#f4f4f5',
                  pointerEvents: 'none'
                }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">📷</div>
                  <p>Click "Start Scanner" to begin</p>
                </div>
              </div>
            )}
          </div>

          {isScanning && (
            <div className="text-sm text-default-500 text-center">
              Point camera at product barcode
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default BarcodeScanner;

