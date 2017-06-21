import registerServiceWorker from './index';

// Mocks
global.navigator = {
}
global.window = {
    addEventListener: jest.fn()
}
jest.mock('../logger/logger');
import Logger from '../logger/logger';
const logger = new Logger();


test('serviceworker functionality doesnt exist', () => {
    expect(registerServiceWorker('worker.js')).toBe(false);
    expect(logger.log.mock.calls[0][0]).toBe('[Page] This browser doesn\'t support service workers');
    expect(logger.log.mock.calls.length).toBe(1);
});


// Update Mock
global.navigator = {
    serviceWorker: {
        foo: "bar"
    }    
}
logger.log.mockClear();


test('serviceworker.controller doesnt exist', () => {
    expect(registerServiceWorker('worker.js')).toBe(false);
    expect(logger.log.mock.calls[0][0]).toBe('[Client] The service worker needs to be installed');
    expect(logger.log.mock.calls.length).toBe(1);
});