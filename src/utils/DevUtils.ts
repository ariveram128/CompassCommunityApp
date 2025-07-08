/**
 * Development utilities - only available in development builds
 * Automatically disabled in production
 */

export class DevUtils {
  /**
   * Check if development features should be enabled
   */
  static get isDevMode(): boolean {
    return __DEV__;
  }

  /**
   * Check if developer menu should be available
   */
  static get showDeveloperMenu(): boolean {
    return this.isDevMode;
  }

  /**
   * Check if debug logging should be enabled
   */
  static get enableDebugLogs(): boolean {
    return this.isDevMode;
  }

  /**
   * Check if sample data generation should be available
   */
  static get enableSampleData(): boolean {
    return this.isDevMode;
  }

  /**
   * Check if error details should be shown to users
   */
  static get showDetailedErrors(): boolean {
    return this.isDevMode;
  }

  /**
   * Onboarding controls for development
   */
  static get enableOnboarding(): boolean {
    return true; // Show onboarding even in dev mode
  }

  static get skipOnboardingInDev(): boolean {
    return false; // Set to true to skip onboarding during development
  }

  /**
   * Conditional console logging - only logs in development
   */
  static log(...args: any[]): void {
    if (this.enableDebugLogs) {
      console.log('[DEV]', ...args);
    }
  }

  /**
   * Conditional console warning - only logs in development
   */
  static warn(...args: any[]): void {
    if (this.enableDebugLogs) {
      console.warn('[DEV]', ...args);
    }
  }

  /**
   * Conditional console error - always logs, but with dev prefix in development
   */
  static error(...args: any[]): void {
    if (this.enableDebugLogs) {
      console.error('[DEV]', ...args);
    } else {
      console.error(...args);
    }
  }

  /**
   * Execute code only in development
   */
  static runInDev(callback: () => void): void {
    if (this.isDevMode) {
      callback();
    }
  }

  /**
   * Execute async code only in development
   */
  static async runInDevAsync(callback: () => Promise<void>): Promise<void> {
    if (this.isDevMode) {
      await callback();
    }
  }

  /**
   * Get build information
   */
  static getBuildInfo(): {
    isDev: boolean;
    timestamp: string;
    version: string;
  } {
    return {
      isDev: this.isDevMode,
      timestamp: new Date().toISOString(),
      version: '1.0.0' // TODO: Get from package.json
    };
  }

  /**
   * Performance timer for development debugging
   */
  static time(label: string): void {
    if (this.enableDebugLogs) {
      console.time(`[DEV] ${label}`);
    }
  }

  /**
   * End performance timer for development debugging
   */
  static timeEnd(label: string): void {
    if (this.enableDebugLogs) {
      console.timeEnd(`[DEV] ${label}`);
    }
  }

  /**
   * Assert function that only works in development
   */
  static assert(condition: boolean, message?: string): void {
    if (this.isDevMode && !condition) {
      throw new Error(`Assertion failed: ${message || 'No message provided'}`);
    }
  }

  /**
   * Development-only feature flag check
   */
  static hasFeatureFlag(flag: string): boolean {
    if (!this.isDevMode) return false;
    
    // In development, you could check environment variables or local storage
    // For now, just return true for all flags in dev mode
    return true;
  }
} 