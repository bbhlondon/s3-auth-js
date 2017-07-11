import test from 'tape';
import sinon from 'sinon';
import { storeGet, storeSet, storeDelete } from './index';
import * as _ from './_index';
import { ERROR_INVALID_OPERATION } from './consts';


test('createDb returns instanceof IDBDatabase', (t) => {
    t.plan(1);
    _.createDb().then(value => t.ok(value instanceof IDBDatabase));
});

test('withStore throws exception when invalid operation passed', (t) => {
    t.plan(1);
    _.withStore('readwrite', () => { }).then(() => { }, e => t.equal(e.message, ERROR_INVALID_OPERATION));
});


test('storeGet returns desired key', (t) => {
    sinon.stub(_, 'withStore').returns(Promise.resolve('testval'));

    t.plan(1);
    storeGet('testkey').then(value => t.ok(value === 'testval'));

    _.withStore.restore();
});

test('storeSet returns key value', (t) => {
    t.plan(1);
    storeSet('testkey', 'testval').then(value => t.ok(value === 'testkey'));
});

test('storeDelete returns undefined', (t) => {
    t.plan(1);
    storeDelete('testkey').then(value => t.ok(value === undefined));
});
