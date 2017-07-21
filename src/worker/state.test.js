import test from 'tape';
import sinon from 'sinon';
import { setCredentials, getCredentials, deleteCredentials, isAuthorized, initializeState } from './state';
import * as _ from './_state';
import * as consts from '../consts';


test('initializeState retrives stored credentials', (t) => {
    const stub = sinon.stub(_, 'retriveCredentials').returns(Promise.resolve());

    t.plan(1);
    initializeState().then(() => { t.ok(stub.calledOnce); });

    stub.restore();
});

test('state recognizes incorrernt auth type', (t) => {
    t.plan(3);
    // @ts-ignore
    setCredentials({ payload: {} })
        .then(() => { }, e => t.equal(e.message, consts.ERROR_PARAM_REQUIRED));
    // @ts-ignore
    setCredentials({ type: 'UNSUPPORTED_TYPE' })
        .then(() => { }, e => t.equal(e.message, consts.ERROR_PARAM_REQUIRED));
    setCredentials({ type: 'UNSUPPORTED_TYPE', payload: {} })
        .then(() => { }, e => t.equal(e.message, consts.ERROR_UNSUPPORTED_AUTH_TYPE));
});

test('state saves and retrives credentials', (t) => {
    const expectedCredentials = {
        type: consts.AUTH_AWS4_SIGNED_HEADERS, payload: { key: 'key', secret: 'secret' },
    };

    t.plan(1);
    setCredentials(expectedCredentials).then(() => {
        const actualCredentials = getCredentials();

        t.looseEqual(actualCredentials, expectedCredentials);
    });
});

test('isAuthorized returns correct state', (t) => {
    const expectedCredentials = {
        type: consts.AUTH_AWS4_SIGNED_HEADERS, payload: { key: 'key', secret: 'secret' },
    };

    t.plan(2);
    setCredentials(expectedCredentials).then(() => {
        t.ok(isAuthorized());
        deleteCredentials().then(() => {
            t.notOk(isAuthorized());
        });
    });
});

test('state deletes credentials', (t) => {
    const expectedCredentials = {
        type: consts.AUTH_AWS4_SIGNED_HEADERS, payload: { key: 'key', secret: 'secret' },
    };

    t.plan(1);
    setCredentials(expectedCredentials).then(() => {
        deleteCredentials().then(() => {
            const actualCredentials = getCredentials();
            t.equal(actualCredentials, undefined);
        });
    });
});
