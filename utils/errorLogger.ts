
import { errorHandler } from './errorHandler';

export function setupErrorLogging() {
  // Global error handler for unhandled promise rejections
  if (typeof global !== 'undefined') {
    const originalHandler = global.ErrorUtils?.getGlobalHandler();
    
    global.ErrorUtils?.setGlobalHandler((error: Error, isFatal?: boolean) => {
      console.error('Global error caught:', error, 'isFatal:', isFatal);
      errorHandler.logError(error, isFatal ? 'FATAL_ERROR' : 'GLOBAL_ERROR');
      
      // Call original handler if it exists
      if (originalHandler) {
        originalHandler(error, isFatal);
      }
    });
  }

  // Handle unhandled promise rejections
  if (typeof Promise !== 'undefined') {
    const originalRejectionHandler = Promise.prototype.catch;
    
    // Log unhandled rejections
    if (typeof global !== 'undefined' && 'onunhandledrejection' in global) {
      (global as any).onunhandledrejection = (event: any) => {
        console.error('Unhandled promise rejection:', event.reason);
        errorHandler.logError(
          event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
          'UNHANDLED_REJECTION'
        );
      };
    }
  }

  console.log('Error logging initialized');
}
