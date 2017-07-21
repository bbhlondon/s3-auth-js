import test from 'tape';
import sinon from 'sinon';
import { getToken, setToken, deleteToken } from './storage';
import * as idb from './../idb';
import * as consts from '../consts';


test('setToken returns passed value', (t) => {
    const expectedCredentials = {
        type: consts.AUTH_AWS4_SIGNED_HEADERS, payload: { key: 'key', secret: 'secret' },
    };

    t.plan(1);
    setToken(expectedCredentials).then(value => t.looseEqual(value, expectedCredentials));
});

test('setToken throws exception when incorret value passed', (t) => {
    t.plan(3);
    setToken().then(() => { }, e => t.equal(e.message, consts.ERROR_PARAM_REQUIRED));
    // @ts-ignore
    setToken({ type: 'TYPE' }).then(() => { }, e => t.equal(e.message, consts.ERROR_PARAM_REQUIRED));
    // @ts-ignore
    setToken({ payload: {} }).then(() => { }, e => t.equal(e.message, consts.ERROR_PARAM_REQUIRED));
});


test('setToken calls idb', (t) => {
    const stub = sinon.stub(idb, 'storeSet').returns(Promise.resolve());
    const expectedCredentials = {
        type: consts.AUTH_AWS4_SIGNED_HEADERS, payload: { key: 'key', secret: 'secret' },
    };

    t.plan(1);
    setToken(expectedCredentials).then(() => t.ok(stub.calledOnce));

    stub.restore();
});

test('getToken calls idb', (t) => {
    const stub = sinon.stub(idb, 'storeGet').returns(Promise.resolve());

    t.plan(1);
    getToken().then(() => t.ok(stub.calledOnce));

    stub.restore();
});

test('deleteToken calls idb', (t) => {
    const stub = sinon.stub(idb, 'storeDelete').returns(Promise.resolve());

    t.plan(1);
    deleteToken().then(() => t.ok(stub.calledOnce));

    stub.restore();
});
