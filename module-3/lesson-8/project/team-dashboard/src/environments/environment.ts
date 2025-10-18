import { isDevMode } from '@angular/core';

/**
 * Unified environment configuration
 * Automatically detects development vs production mode
 *
 * Development: Uses local JSON Server (http://localhost:3000)
 * Production: Uses production API (update with your production URL)
 */
export const environment = {
  production: !isDevMode(),
  apiUrl: isDevMode()
    ? 'http://localhost:3000'  // Development: JSON Server
    : 'https://api.innovatetech.com'  // Production: Update with your API URL
};
