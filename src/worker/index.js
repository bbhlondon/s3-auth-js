import { handleActivate, handleMessage, handleFetch } from './handlers';

// Activate
self.addEventListener('activate', event => handleActivate(event));

// Message
self.addEventListener('message', event => handleMessage(event));

// Fetch
self.addEventListener('fetch', event => handleFetch(event));
