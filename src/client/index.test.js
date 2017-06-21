import registerServiceWorker from './index';

// Mocks
global.navigator = {
}
jest.mock('../logger/logger');


test('serviceworker functionality doesnt exist', () => {
    expect(registerServiceWorker('worker.js')).toBe(false);
});