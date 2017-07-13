import test from 'tape';
import sinon from 'sinon';
import registerServiceWorker from './register';
import * as _ from './_register';
import { ERROR_SERVICE_WORKER_NOT_SUPPORTED, ERROR_SERVICE_WORKER_REGISTRATION_FAILED, ERROR_SERVICE_WORKER_ALREADY_EXISTS } from '../consts';


test('serviceworker functionality doesnt exist', (t) => {
    const stub = sinon.stub(_, 'supportsServiceWorker').returns(false);

    t.plan(1);
    registerServiceWorker('worker.js').then(() => { }, (e) => { t.equal(e, ERROR_SERVICE_WORKER_NOT_SUPPORTED); });

    stub.restore();
});

test('serviceworker already active', (t) => {
    const stubController = sinon.stub(navigator.serviceWorker, 'controller').get(() => ({}));
    const stub = sinon.stub(_, 'hasServiceWorker').returns(true);

    t.plan(1);
    registerServiceWorker('worker.js').then(res => t.ok(res));

    stubController.restore();
    stub.restore();
});

test('serviceworker already exist', (t) => {
    const stubController = sinon.stub(navigator.serviceWorker, 'controller').get(() => ({}));
    const stub = sinon.stub(_, 'hasServiceWorker').returns(false);

    t.plan(1);
    registerServiceWorker('worker.js').then(() => { }, (e) => { t.equal(e, ERROR_SERVICE_WORKER_ALREADY_EXISTS); });

    stubController.restore();
    stub.restore();
});

test('serviceworker tries but fails to register', (t) => {
    const spy = sinon.spy(navigator.serviceWorker, 'register');

    t.plan(2);
    registerServiceWorker('worker.js').then(() => { }, (e) => {
        t.equal(e, ERROR_SERVICE_WORKER_REGISTRATION_FAILED);
        t.ok(spy.calledOnce);
    });
    window.dispatchEvent(new Event('load'));

    spy.restore();
});
