import { invoke } from '@tauri-apps/api/core';
import { isTauri } from '../config/tauriApiConfig';

type LogLevel = 'info' | 'error';

let loggerInitialized = false;

async function logToFile(level: LogLevel, message: string) {
  if (!isTauri) {
    return;
  }

  try {
    await invoke('log_message', { level, message });
  } catch (error) {
    // Last-resort logging to console if invoke fails
    console.warn('Failed to write log:', error, message);
  }
}

export function initTauriLogger() {
  if (!isTauri || loggerInitialized) {
    return;
  }

  loggerInitialized = true;
  logToFile('info', 'AstroDist UI bootstrapped');

  window.addEventListener('error', (event) => {
    const details =
      (event.error && event.error.stack) ||
      event.message ||
      'Unknown window error';
    logToFile('error', `Unhandled error: ${details}`);
  });

  window.addEventListener('unhandledrejection', (event) => {
    let details = 'Unknown rejection';
    if (event.reason instanceof Error) {
      details = event.reason.stack || event.reason.message;
    } else {
      try {
        details =
          typeof event.reason === 'string'
            ? event.reason
            : JSON.stringify(event.reason);
      } catch (_) {
        details = String(event.reason);
      }
    }
    logToFile('error', `Unhandled rejection: ${details}`);
  });
}

export { logToFile };

