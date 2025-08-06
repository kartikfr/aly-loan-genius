import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { checkUATServerHealth, checkExternalServerHealth, getServerErrorMessage, logServerHealth } from '@/lib/serverHealth';

interface ServerStatusIndicatorProps {
  showDetails?: boolean;
  onStatusChange?: (isHealthy: boolean) => void;
}

export const ServerStatusIndicator: React.FC<ServerStatusIndicatorProps> = ({ 
  showDetails = false, 
  onStatusChange 
}) => {
  const [uatStatus, setUatStatus] = useState<{ isHealthy: boolean; message: string } | null>(null);
  const [externalStatus, setExternalStatus] = useState<{ isHealthy: boolean; message: string } | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkServers = async () => {
    setIsChecking(true);
    
    try {
      // Check UAT server
      const uatHealth = await checkUATServerHealth();
      logServerHealth(uatHealth, 'UAT Server');
      const uatMessage = getServerErrorMessage(uatHealth);
      setUatStatus({ isHealthy: uatHealth.isHealthy, message: uatMessage });
      
      // Check external server
      const externalHealth = await checkExternalServerHealth();
      logServerHealth(externalHealth, 'External Server');
      const externalMessage = getServerErrorMessage(externalHealth);
      setExternalStatus({ isHealthy: externalHealth.isHealthy, message: externalMessage });
      
      // Notify parent component
      if (onStatusChange) {
        onStatusChange(uatHealth.isHealthy && externalHealth.isHealthy);
      }
    } catch (error) {
      console.error('Error checking server health:', error);
      setUatStatus({ isHealthy: false, message: 'Failed to check server status' });
      setExternalStatus({ isHealthy: false, message: 'Failed to check server status' });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkServers();
  }, []);

  if (!showDetails) {
    const allHealthy = uatStatus?.isHealthy && externalStatus?.isHealthy;
    
    if (allHealthy === null) {
      return null; // Don't show anything while checking
    }
    
    return (
      <div className="flex items-center gap-2 text-xs">
        {allHealthy ? (
          <>
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span className="text-green-600">Servers Online</span>
          </>
        ) : (
          <>
            <AlertCircle className="h-3 w-3 text-red-500" />
            <span className="text-red-600">Server Issues</span>
            <button
              onClick={checkServers}
              disabled={isChecking}
              className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
            >
              <RefreshCw className={`h-3 w-3 ${isChecking ? 'animate-spin' : ''}`} />
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2 p-3 bg-muted rounded-lg">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Server Status</h4>
        <button
          onClick={checkServers}
          disabled={isChecking}
          className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50 flex items-center gap-1"
        >
          <RefreshCw className={`h-3 w-3 ${isChecking ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs">
          {uatStatus?.isHealthy ? (
            <CheckCircle className="h-3 w-3 text-green-500" />
          ) : (
            <AlertCircle className="h-3 w-3 text-red-500" />
          )}
          <span className="font-medium">UAT Server:</span>
          <span className={uatStatus?.isHealthy ? 'text-green-600' : 'text-red-600'}>
            {uatStatus?.message || 'Checking...'}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-xs">
          {externalStatus?.isHealthy ? (
            <CheckCircle className="h-3 w-3 text-green-500" />
          ) : (
            <AlertCircle className="h-3 w-3 text-red-500" />
          )}
          <span className="font-medium">External API:</span>
          <span className={externalStatus?.isHealthy ? 'text-green-600' : 'text-red-600'}>
            {externalStatus?.message || 'Checking...'}
          </span>
        </div>
      </div>
      
      {(!uatStatus?.isHealthy || !externalStatus?.isHealthy) && (
        <div className="text-xs text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
          <p className="font-medium mb-1">Troubleshooting Tips:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Check your internet connection</li>
            <li>Try refreshing the page</li>
            <li>Wait a few minutes and try again</li>
            <li>Contact support if the issue persists</li>
          </ul>
        </div>
      )}
    </div>
  );
}; 