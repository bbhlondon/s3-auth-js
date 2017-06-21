import Logger from '../logger/logger';

self.addEventListener('activate', function (event) {
    Logger.log('[Service worker] Activated');
});