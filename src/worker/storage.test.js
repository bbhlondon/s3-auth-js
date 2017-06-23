import * as idb from './../idb';
import { getToken, setToken, deleteToken } from './storage';

const test = require('tape');
const sinon = require('sinon');

const TEST_TOKEN = '123456';

const stubSet = sinon.stub(idb, 'set').callsFake(value => new Promise((resolve, reject) => resolve(value)));
const stubGet = sinon.stub(idb, 'get').callsFake(value => new Promise((resolve, reject) => resolve(value)));
const stubDelete = sinon.stub(idb, 'delete').callsFake(value => new Promise((resolve, reject) => resolve(value)));


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
    t.plan(1);
    getToken().then(() => t.ok(stubGet.calledOnce));
});

test('deleteToken calls idb', (t) => {
    t.plan(1);
    deleteToken().then(() => t.ok(stubDelete.calledOnce));
});
