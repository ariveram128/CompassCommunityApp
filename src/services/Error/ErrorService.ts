interface ErrorReport {
  timestamp: string;
  type: 'network' | 'async' | 'service' | 'unknown';
  message: string;
  stack?: string;
  context?: any;
  userAgent?: string;
  appVersion?: string;
}

interface ErrorHandlerOptions {
  silent?: boolean;
  showToUser?: boolean;
  logToConsole?: boolean;
  context?: any;
}

export class ErrorService {
  private static errorQueue: ErrorReport[] = [];
  private static maxQueueSize = 50;
  private static isInitialized = false;

  /**
   * Initialize error handling service
   */
  static initialize(): void {
    if (this.isInitialized) return;

    // Handle unhandled promise rejections (browser only)
    try {
      if (typeof window !== 'undefined' && window.addEventListener && typeof window.addEventListener === 'function') {
        window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
      }
    } catch (error) {
      // Silently fail if not supported (React Native)
      if (__DEV__) {
        console.warn('Unhandled rejection listener not supported in this environment');
      }
    }

    // Handle global errors (browser only)
    try {
      if (typeof window !== 'undefined' && window.addEventListener && typeof window.addEventListener === 'function') {
        window.addEventListener('error', this.handleGlobalError);
      }
    } catch (error) {
      // Silently fail if not supported (React Native)
      if (__DEV__) {
        console.warn('Global error listener not supported in this environment');
      }
    }

    // For React Native, we can use alternative error handling
    try {
      const globalErrorUtils = (global as any)?.ErrorUtils;
      if (globalErrorUtils && typeof globalErrorUtils.setGlobalHandler === 'function') {
        // React Native error handling
        const originalHandler = globalErrorUtils.getGlobalHandler();
        globalErrorUtils.setGlobalHandler((error: any, isFatal: boolean) => {
          this.logError({
            type: 'unknown',
            message: error?.message || 'React Native global error',
            stack: error?.stack,
            context: { isFatal, platform: 'react-native' }
          }, {
            logToConsole: true,
            showToUser: false
          });
          
          // Call original handler
          if (originalHandler) {
            originalHandler(error, isFatal);
          }
        });
      }
    } catch (error) {
      // Silently fail if ErrorUtils is not available
      if (__DEV__) {
        console.warn('React Native ErrorUtils not available');
      }
    }

    this.isInitialized = true;
    console.log('✅ Error service initialized');
  }

  /**
   * Handle unhandled promise rejections
   */
  private static handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    const error = event.reason;
    this.logError({
      type: 'async',
      message: error?.message || 'Unhandled promise rejection',
      stack: error?.stack,
      context: { 
        promise: event.promise,
        reason: event.reason 
      }
    }, {
      logToConsole: true,
      showToUser: false
    });

    // Prevent the default browser behavior
    event.preventDefault();
  };

  /**
   * Handle global errors
   */
  private static handleGlobalError = (event: ErrorEvent) => {
    this.logError({
      type: 'unknown',
      message: event.message || 'Global error',
      stack: event.error?.stack,
      context: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }
    }, {
      logToConsole: true,
      showToUser: false
    });
  };

  /**
   * Log an error with optional handling options
   */
  static logError(
    error: Partial<ErrorReport> | Error | string,
    options: ErrorHandlerOptions = {}
  ): void {
    const {
      silent = false,
      showToUser = false,
      logToConsole = true,
      context
    } = options;

    let errorReport: ErrorReport;

    if (typeof error === 'string') {
      errorReport = {
        timestamp: new Date().toISOString(),
        type: 'unknown',
        message: error,
        context,
        userAgent: this.getUserAgent(),
        appVersion: this.getAppVersion()
      };
    } else if (error instanceof Error) {
      errorReport = {
        timestamp: new Date().toISOString(),
        type: 'unknown',
        message: error.message,
        stack: error.stack,
        context,
        userAgent: this.getUserAgent(),
        appVersion: this.getAppVersion()
      };
    } else {
      errorReport = {
        timestamp: new Date().toISOString(),
        type: error.type || 'unknown',
        message: error.message || 'Unknown error',
        stack: error.stack,
        context: { ...error.context, ...context },
        userAgent: this.getUserAgent(),
        appVersion: this.getAppVersion()
      };
    }

    // Add to error queue
    this.addToQueue(errorReport);

    // Log to console if enabled
    if (logToConsole && (__DEV__ || !silent)) {
      console.error('Error Service:', errorReport);
    }

    // Show to user if requested (you could integrate with your custom alert system)
    if (showToUser) {
      this.showErrorToUser(errorReport);
    }
  }

  /**
   * Log network errors specifically
   */
  static logNetworkError(
    error: any,
    request?: { url?: string; method?: string },
    options: ErrorHandlerOptions = {}
  ): void {
    this.logError({
      type: 'network',
      message: error?.message || 'Network request failed',
      stack: error?.stack,
      context: {
        request,
        status: error?.status,
        statusText: error?.statusText,
        ...options.context
      }
    }, options);
  }

  /**
   * Log service errors (from our custom services)
   */
  static logServiceError(
    service: string,
    method: string,
    error: any,
    options: ErrorHandlerOptions = {}
  ): void {
    this.logError({
      type: 'service',
      message: `${service}.${method}: ${error?.message || 'Service error'}`,
      stack: error?.stack,
      context: {
        service,
        method,
        ...options.context
      }
    }, options);
  }

  /**
   * Wrap async functions with error handling
   */
  static async withErrorHandling<T>(
    operation: () => Promise<T>,
    context?: any,
    options: ErrorHandlerOptions = {}
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      this.logError(error as Error, {
        ...options,
        context: { 
          operation: operation.name || 'anonymous',
          ...context 
        }
      });
      
      if (options.showToUser) {
        this.showErrorToUser({
          timestamp: new Date().toISOString(),
          type: 'async',
          message: (error as Error)?.message || 'Operation failed',
          context
        });
      }
      
      return null;
    }
  }

  /**
   * Get error reports for debugging
   */
  static getErrorReports(): ErrorReport[] {
    return [...this.errorQueue];
  }

  /**
   * Clear error reports
   */
  static clearErrorReports(): void {
    this.errorQueue = [];
  }

  /**
   * Add error to queue with size limit
   */
  private static addToQueue(error: ErrorReport): void {
    this.errorQueue.push(error);
    
    // Keep queue size manageable
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }
  }

  /**
   * Show error to user (integrate with your alert system)
   */
  private static showErrorToUser(error: ErrorReport): void {
    // TODO: Integrate with your custom alert system
    // For now, just log a user-friendly message
    if (__DEV__) {
      console.warn('User Error:', error.message);
    }
  }

  /**
   * Get user agent for error reporting
   */
  private static getUserAgent(): string {
    try {
      if (typeof navigator !== 'undefined' && navigator.userAgent) {
        return navigator.userAgent;
      }
    } catch (error) {
      // Fail silently
    }
    return 'React Native App';
  }

  /**
   * Get app version for error reporting
   */
  private static getAppVersion(): string {
    // TODO: Get from app.json or package.json
    return '1.0.0';
  }

  /**
   * Check if error service is healthy
   */
  static isHealthy(): boolean {
    return this.isInitialized && this.errorQueue.length < this.maxQueueSize * 0.8;
  }

  /**
   * Get error statistics
   */
  static getErrorStats(): {
    total: number;
    byType: Record<string, number>;
    recentCount: number;
  } {
    const total = this.errorQueue.length;
    const byType: Record<string, number> = {};
    
    // Count by type
    this.errorQueue.forEach(error => {
      byType[error.type] = (byType[error.type] || 0) + 1;
    });

    // Count recent errors (last hour)
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    const recentCount = this.errorQueue.filter(error => 
      new Date(error.timestamp).getTime() > oneHourAgo
    ).length;

    return { total, byType, recentCount };
  }

  /**
   * Get platform information
   */
  private static getPlatform(): string {
    try {
      // Check if we're in React Native
      if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
        return 'react-native';
      }
      // Check if we're in a web browser
      if (typeof window !== 'undefined') {
        return 'web';
      }
    } catch (error) {
      // Fail silently
    }
    return 'unknown';
  }

  /**
   * Get current location/URL for error reporting
   */
  private static getCurrentLocation(): string {
    try {
      if (typeof window !== 'undefined' && window.location) {
        return window.location.href;
      }
    } catch (error) {
      // Fail silently
    }
    return 'mobile-app';
  }
} 