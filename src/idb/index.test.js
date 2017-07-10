import test from 'tape';
import { storeGet, storeSet, storeDelete, __RewireAPI__ as idbRewireAPI } from './index';


test('createDb returns instanceof IDBDatabase', (t) => {
    const createDb = idbRewireAPI.__get__('createDb');

    t.plan(1);
    createDb().then(value => t.ok(value instanceof IDBDatabase));
});

test('withStore throws exception when invalid operation passed', (t) => {
    const withStore = idbRewireAPI.__get__('withStore');
    const ERROR_INVALID_OPERATION = idbRewireAPI.__get__('ERROR_INVALID_OPERATION');

    t.plan(1);
    withStore('readwrite', () => { }).then(() => { }, e => t.equal(e.message, ERROR_INVALID_OPERATION));
});


test('storeGet returns desired key', (t) => {
    idbRewireAPI.__Rewire__('withStore', () => Promise.resolve('testval'));

    t.plan(1);
    storeGet('testkey').then(value => t.ok(value === 'testval'));

    idbRewireAPI.__ResetDependency__('withStore');
});

test('storeSet returns key value', (t) => {
    t.plan(1);
    storeSet('testkey', 'testval').then(value => t.ok(value === 'testkey'));
});

test('storeDelete returns undefined', (t) => {
    t.plan(1);
    storeDelete('testkey').then(value => t.ok(value === undefined));
});
