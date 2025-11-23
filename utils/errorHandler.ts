
// Centralized error handling utility

import { Alert } from 'react-native';

export interface AppError {
  message: string;
  code?: string;
  details?: any;
  timestamp: string;
}

class ErrorHandler {
  private errorLog: AppError[] = [];
  private maxLogSize = 50;

  logError(error: Error | string, code?: string, details?: any): void {
    const appError: AppError = {
      message: typeof error === 'string' ? error : error.message,
      code,
      details,
      timestamp: new Date().toISOString(),
    };

    console.error('🚨 App Error:', appError);

    this.errorLog.push(appError);
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift();
    }
  }

  showError(message: string, title: string = 'Error'): void {
    Alert.alert(title, message, [{ text: 'OK' }]);
  }

  showNetworkError(): void {
    this.showError(
      'Please check your internet connection and try again.',
      'Connection Error'
    );
  }

  showValidationError(message: string): void {
    this.showError(message, 'Validation Error');
  }

  showGenericError(): void {
    this.showError(
      'Something went wrong. Please try again.',
      'Error'
    );
  }

  getErrorLog(): AppError[] {
    return [...this.errorLog];
  }

  clearErrorLog(): void {
    this.errorLog = [];
  }

  handleAsyncError<T>(
    promise: Promise<T>,
    errorMessage?: string
  ): Promise<T | null> {
    return promise.catch((error) => {
      this.logError(error, 'ASYNC_ERROR');
      if (errorMessage) {
        this.showError(errorMessage);
      }
      return null;
    });
  }
}

export const errorHandler = new ErrorHandler();

export const withErrorHandling = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  errorMessage?: string
): T => {
  return (async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      errorHandler.logError(error as Error, 'FUNCTION_ERROR');
      if (errorMessage) {
        errorHandler.showError(errorMessage);
      } else {
        errorHandler.showGenericError();
      }
      throw error;
    }
  }) as T;
};
