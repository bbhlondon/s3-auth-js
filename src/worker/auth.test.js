import test from 'tape';
import sinon from 'sinon';
import * as _ from './_auth';
import {
    ERROR_INPUT_PARAM_REQUIRED,
    ERROR_INPUT_PARAM_STRING,
} from './consts';


test('getAWSTimestamp returns right format', (t) => {
    const clock = sinon.useFakeTimers(new Date('2017-07-11T09:46:56Z'));

    t.plan(1);
    t.equal(_.getAWSTimestamp(), '20170711T094656Z');

    clock.restore();
});

test('pad needs an input', (t) => {
    t.plan(2);
    t.throws(() => _.pad(), Error(ERROR_INPUT_PARAM_REQUIRED));
    t.doesNotThrow(() => _.pad(0), Error(ERROR_INPUT_PARAM_REQUIRED));
});

test('pad does pad single digit input to string', (t) => {
    t.plan(2);
    t.equal(_.pad(1), '01');
    t.equal(_.pad(6), '06');
});

test('pad does not touch non-digit input', (t) => {
    t.plan(3);
    t.equal(_.pad('a'), 'a');
    t.looseEqual(_.pad({}), {});
    t.looseEqual(_.pad(['aaaaaa']), ['aaaaaa']);
});

test('pad does not pad double or longer digit input', (t) => {
    t.plan(3);
    t.equal(_.pad(111), 111);
    t.equal(_.pad(99), 99);
    t.equal(_.pad(97779), 97779);
});

test('hex needs a string input', (t) => {
    t.plan(6);
    t.throws(() => _.hex(), Error(ERROR_INPUT_PARAM_REQUIRED));
    t.throws(() => _.hex(0), Error(ERROR_INPUT_PARAM_STRING));
    t.throws(() => _.hex({}), Error(ERROR_INPUT_PARAM_STRING));
    t.throws(() => _.hex(['foo']), Error(ERROR_INPUT_PARAM_STRING));
    t.doesNotThrow(() => _.hex('foo'), Error(ERROR_INPUT_PARAM_REQUIRED));
    t.doesNotThrow(() => _.hex('foo'), Error(ERROR_INPUT_PARAM_STRING));
});

test('hex returns lowercase base16 format', (t) => {
    // test cases from https://tools.ietf.org/html/rfc4648#page-10
    t.plan(8);
    t.equal(_.hex(''), '');
    t.equal(_.hex('f'), '66');
    t.equal(_.hex('fo'), '666f');
    t.equal(_.hex('foo'), '666f6f');
    t.equal(_.hex('foob'), '666f6f62');
    t.equal(_.hex('fooba'), '666f6f6261');
    t.equal(_.hex('foobar'), '666f6f626172');
    t.equal(_.hex('Hello World!'), '48656c6c6f20576f726c6421');
});
