/**
 * Server health check utilities
 */

export interface ServerHealthStatus {
  isHealthy: boolean;
  responseTime: number;
  status: string;
  error?: string;
}

/**
 * Check if the UAT server is responding
 */
export async function checkUATServerHealth(): Promise<ServerHealthStatus> {
  const startTime = Date.now();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch('/api/uat/health', {
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;
    
    if (response.ok) {
      return {
        isHealthy: true,
        responseTime,
        status: 'OK'
      };
    } else {
      return {
        isHealthy: false,
        responseTime,
        status: `HTTP ${response.status}`,
        error: `Server returned ${response.status} ${response.statusText}`
      };
    }
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        isHealthy: false,
        responseTime,
        status: 'TIMEOUT',
        error: 'Request timed out after 10 seconds'
      };
    }
    
    return {
      isHealthy: false,
      responseTime,
      status: 'ERROR',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Check if the external API server is responding
 */
export async function checkExternalServerHealth(): Promise<ServerHealthStatus> {
  const startTime = Date.now();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch('/api/external/health', {
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;
    
    if (response.ok) {
      return {
        isHealthy: true,
        responseTime,
        status: 'OK'
      };
    } else {
      return {
        isHealthy: false,
        responseTime,
        status: `HTTP ${response.status}`,
        error: `Server returned ${response.status} ${response.statusText}`
      };
    }
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        isHealthy: false,
        responseTime,
        status: 'TIMEOUT',
        error: 'Request timed out after 10 seconds'
      };
    }
    
    return {
      isHealthy: false,
      responseTime,
      status: 'ERROR',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Get user-friendly error message based on server status
 */
export function getServerErrorMessage(status: ServerHealthStatus): string {
  if (status.isHealthy) {
    return 'Server is responding normally.';
  }
  
  switch (status.status) {
    case 'TIMEOUT':
      return 'Server is not responding. Please try again in a few moments.';
    case 'HTTP 502':
      return 'Server is temporarily unavailable. Please try again later.';
    case 'HTTP 503':
      return 'Service is under maintenance. Please try again later.';
    case 'HTTP 504':
      return 'Server is taking too long to respond. Please try again.';
    case 'ERROR':
      return `Connection error: ${status.error || 'Unknown error'}`;
    default:
      return `Server error (${status.status}): ${status.error || 'Unknown error'}`;
  }
}

/**
 * Log server health status for debugging
 */
export function logServerHealth(status: ServerHealthStatus, serverName: string): void {
  const emoji = status.isHealthy ? '✅' : '❌';
  console.log(`${emoji} ${serverName} Health Check:`);
  console.log(`  Status: ${status.status}`);
  console.log(`  Response Time: ${status.responseTime}ms`);
  if (status.error) {
    console.log(`  Error: ${status.error}`);
  }
} 