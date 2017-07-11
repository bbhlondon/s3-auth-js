import test from 'tape';
import sinon from 'sinon';
import { getToken, setToken, deleteToken } from './storage';
import * as idb from './../idb';


const TEST_TOKEN = '123456';

test('setToken return passed value', (t) => {
    t.plan(1);
    setToken(TEST_TOKEN).then(value => t.equal(value, TEST_TOKEN));
});

test('setToken throws exception when no value passed', (t) => {
    t.plan(1);
    setToken().then(() => { }, e => t.equal(e.message, 'Value undefined'));
});

test('setToken throws exception when Array passed', (t) => {
    t.plan(1);
    setToken([]).then(() => { }, e => t.equal(e.message, 'Token must be a string'));
});

test('setToken throws exception when Object passed', (t) => {
    t.plan(1);
    setToken({}).then(() => { }, e => t.equal(e.message, 'Token must be a string'));
});

test('setToken throws exception when undefined passed', (t) => {
    t.plan(1);
    setToken(undefined).then(() => { }, e => t.equal(e.message, 'Value undefined'));
});

test('getToken calls idb', (t) => {
    const stub = sinon.stub(idb, 'storeGet').returns(Promise.resolve());

    t.plan(1);
    getToken().then(() => t.ok(stub.calledOnce));

    idb.storeGet.restore();
});

test('deleteToken calls idb', (t) => {
    const stub = sinon.stub(idb, 'storeDelete').returns(Promise.resolve());

    t.plan(1);
    deleteToken().then(() => t.ok(stub.calledOnce));

    idb.storeDelete.restore();
});
