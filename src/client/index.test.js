import registerServiceWorker from './index';

// Mocks
let window = {
    addEventListener: jest.fn()
}
jest.mock('../logger/logger');
// must be a better way to access the mock than this, but...
import Logger from '../logger/logger';
const logger = new Logger();


test('serviceworker functionality doesnt exist', () => {
    expect(registerServiceWorker('worker.js')).toBe(false);
    expect(logger.log.mock.calls[0][0]).toBe('[Page] This browser doesn\'t support service workers');
    expect(logger.log.mock.calls.length).toBe(1);
});


// Update settings
let navigator = {
    serviceWorker: {
        register: jest.fn()
    }
}


test('serviceworker.controller doesnt exist', () => {
    logger.log.mockClear();
    // console.log(navigator);
    // console.log(('serviceWorker' in navigator));
    expect(registerServiceWorker('worker.js')).toBe(false);
    expect(logger.log.mock.calls.length).toBe(1);
    expect(logger.log.mock.calls[0][0]).toBe('[Client] The service worker needs to be installed');
});