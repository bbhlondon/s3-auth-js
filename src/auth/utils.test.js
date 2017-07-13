import test from 'tape';

import {
    ERROR_PARAM_REQUIRED,
    ERROR_PARAM_TYPE_IS_NOT_STRING,
} from '../consts';
import {
    pad,
    hex,
} from './utils';


test('pad needs an input', (t) => {
    t.plan(2);
    t.throws(() => pad(), Error(ERROR_PARAM_REQUIRED));
    t.doesNotThrow(() => pad(0), Error(ERROR_PARAM_REQUIRED));
});

test('pad does pad single digit input to string', (t) => {
    t.plan(2);
    t.equal(pad(1), '01');
    t.equal(pad(6), '06');
});

test('pad does not touch non-digit input', (t) => {
    t.plan(3);
    t.equal(pad('a'), 'a');
    t.looseEqual(pad({}), {});
    t.looseEqual(pad(['aaaaaa']), ['aaaaaa']);
});

test('pad does not pad double or longer digit input', (t) => {
    t.plan(3);
    t.equal(pad(111), 111);
    t.equal(pad(99), 99);
    t.equal(pad(97779), 97779);
});

test('hex needs a string input', (t) => {
    t.plan(6);
    t.throws(() => hex(), Error(ERROR_PARAM_REQUIRED));
    t.throws(() => hex(0), Error(ERROR_PARAM_TYPE_IS_NOT_STRING));
    t.throws(() => hex({}), Error(ERROR_PARAM_TYPE_IS_NOT_STRING));
    t.throws(() => hex(['foo']), Error(ERROR_PARAM_TYPE_IS_NOT_STRING));
    t.doesNotThrow(() => hex('foo'), Error(ERROR_PARAM_REQUIRED));
    t.doesNotThrow(() => hex('foo'), Error(ERROR_PARAM_TYPE_IS_NOT_STRING));
});

test('hex returns lowercase base16 format', (t) => {
    // test cases from https://tools.ietf.org/html/rfc4648#page-10
    t.plan(8);
    t.equal(hex(''), '');
    t.equal(hex('f'), '66');
    t.equal(hex('fo'), '666f');
    t.equal(hex('foo'), '666f6f');
    t.equal(hex('foob'), '666f6f62');
    t.equal(hex('fooba'), '666f6f6261');
    t.equal(hex('foobar'), '666f6f626172');
    t.equal(hex('Hello World!'), '48656c6c6f20576f726c6421');
});
