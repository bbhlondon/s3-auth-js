import test from 'tape';
import sinon from 'sinon';

import Logger from '../logger/logger';
import registerServiceWorker from './index';


// Mocks / stubs / spies
// global.navigator = {};
// global.window = {
//     addEventListener: () => { }
// };
const logger = new Logger();
sinon.stub(logger, "log");
// const windowEventListener = sinon.stub(global.window, "addEventListener");


test('serviceworker functionality doesnt exist', { skip: true }, t => {
    t.plan(3);

    t.equal(registerServiceWorker('worker.js'), false, 'registerServiceWorker should fail when browser doesn\'t support it');
    t.equal(logger.log.calledOnce, true);
    t.equal(logger.log.getCall(0).args[0], '[Page] This browser doesn\'t support service workers');
});

test('serviceworker.controller doesnt exist', { skip: true }, t => {
    logger.log.reset();
    global.navigator = {
        serviceWorker: {}
    };

    t.plan(3);

    t.equal(registerServiceWorker('worker.js'), true, 'SW is already installed');
    t.equal(logger.log.calledOnce, true);
    t.equal(logger.log.getCall(0).args[0], '[Client] The service worker needs to be installed');
});