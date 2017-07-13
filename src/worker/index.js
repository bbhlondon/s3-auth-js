import { handleInstall, handleActivate, handleMessage, handleFetch } from './handlers';

// Install
self.addEventListener('install', event => handleInstall(event));

// Activate
self.addEventListener('activate', event => handleActivate(event));

// Message
self.addEventListener('message', event => handleMessage(event));

// Fetch
self.addEventListener('fetch', event => handleFetch(event));
