import test from 'tape';
import sinon from 'sinon';
import Logger from './index';
import * as _ from './_index';

test('Logger.log prints message', (t) => {
    const spy = sinon.spy(console, 'info');
    const message = 'message';

    t.plan(2);
    Logger.log(message);
    t.ok(spy.calledOnce);
    t.ok(spy.calledWith(message));

    spy.restore();
});

test('Logger.log does not print message if canLog returns false', (t) => {
    const spy = sinon.spy(console, 'info');
    const stub = sinon.stub(_, 'default').returns(false);
    const message = 'message';

    t.plan(1);

    Logger.log(message);
    t.ok(spy.notCalled);

    spy.restore();
    stub.restore();
});

test('Logger.error prints message', (t) => {
    const spy = sinon.spy(console, 'error');
    const message = 'message';

    t.plan(2);
    Logger.error(message);
    t.ok(spy.calledOnce);
    t.ok(spy.calledWith(message));

    spy.restore();
});

test('Logger.error does not print message if canLog returns false', (t) => {
    const spy = sinon.spy(console, 'error');
    const stub = sinon.stub(_, 'default').returns(false);
    const message = 'message';

    t.plan(1);

    Logger.error(message);
    t.ok(spy.notCalled);

    spy.restore();
    stub.restore();
});

