import test from 'tape';
import sinon from 'sinon';
import {
    ERROR_PARAM_REQUIRED,
    ERROR_PARAM_TYPE_IS_NOT_STRING,
    ERROR_PARAM_TYPE_IS_NOT_BOOLEAN,
} from '../consts';
import * as utils from './utils';
import {
    AWSURIEncode,
    getAWSTimestamp,
} from './_aws';
import {
    createCanonicalRequest,
    createStringToSign,
} from './aws';


test('getAWSTimestamp returns right format', (t) => {
    const clock = sinon.useFakeTimers(new Date('2017-07-11T09:46:56Z'));

    t.plan(1);
    t.equal(getAWSTimestamp(), '20170711T094656Z');

    clock.restore();
});

test('AWSURIEncode requires string input and bool encodeSlash params', (t) => {
    const stubHex = sinon.stub(utils, 'hex');

    t.plan(11);
    t.throws(() => AWSURIEncode(), Error(ERROR_PARAM_REQUIRED));
    t.throws(() => AWSURIEncode('foo'), Error(ERROR_PARAM_REQUIRED));
    t.throws(() => AWSURIEncode(0, 'foo'), Error(ERROR_PARAM_TYPE_IS_NOT_STRING));
    t.throws(() => AWSURIEncode({}, true), Error(ERROR_PARAM_TYPE_IS_NOT_STRING));
    t.throws(() => AWSURIEncode(['foo'], true), Error(ERROR_PARAM_TYPE_IS_NOT_STRING));
    t.throws(() => AWSURIEncode('foo', 'foo'), Error(ERROR_PARAM_TYPE_IS_NOT_BOOLEAN));
    t.throws(() => AWSURIEncode('foo', {}), Error(ERROR_PARAM_TYPE_IS_NOT_BOOLEAN));
    t.throws(() => AWSURIEncode('foo', ['foo']), Error(ERROR_PARAM_TYPE_IS_NOT_BOOLEAN));
    t.doesNotThrow(() => AWSURIEncode('foo', true), Error(ERROR_PARAM_REQUIRED));
    t.doesNotThrow(() => AWSURIEncode('foo', false), Error(ERROR_PARAM_TYPE_IS_NOT_STRING));
    t.doesNotThrow(() => AWSURIEncode('foo', false), Error(ERROR_PARAM_TYPE_IS_NOT_BOOLEAN));

    stubHex.restore();
});

test('AWSURIEncode doesn\'t encode unreserved chars', (t) => {
    t.plan(9);
    t.equal(AWSURIEncode('a', false), 'a');
    t.equal(AWSURIEncode('i', false), 'i');
    t.equal(AWSURIEncode('M', false), 'M');
    t.equal(AWSURIEncode('6', false), '6');
    t.equal(AWSURIEncode('9', false), '9');
    t.equal(AWSURIEncode('_', false), '_');
    t.equal(AWSURIEncode('-', false), '-');
    t.equal(AWSURIEncode('~', false), '~');
    t.equal(AWSURIEncode('.', false), '.');
});

test('AWSURIEncode does hex encode, %-prepend and uppercase reserved chars', (t) => {
    const stubHex = sinon.stub(utils, 'hex', x => `fake${x}`);

    t.plan(4);
    t.equal(AWSURIEncode(',', false), '%FAKE,');
    t.equal(AWSURIEncode('Ṩ', false), '%FAKEṨ');
    t.equal(AWSURIEncode('\\', false), '%FAKE\\');
    t.equal(AWSURIEncode('>', false), '%FAKE>');

    stubHex.restore();
});

test('AWSURIEncode encodes forward slash chars correctly', (t) => {
    t.plan(2);
    t.equal(AWSURIEncode('/', false), '/');
    t.equal(AWSURIEncode('/', true), '%2F');
});

test('AWSURIEncode encodes space chars and sequences correctly', (t) => {
    const stubHex = sinon.stub(utils, 'hex', x => `|${x}|`);

    t.plan(3);
    t.equal(AWSURIEncode(' ', false), '%20');
    t.equal(AWSURIEncode('Hello World,/foo', false), 'Hello%20World%|,|/foo');
    t.equal(AWSURIEncode('Hello World,/foo', true), 'Hello%20World%|,|%2Ffoo');

    stubHex.restore();
});

test('createCanonicalRequest requires url as string and method const inputs', (t) => {
    t.fail('not implemented');
    t.end();
});

test('createStringToSign requires url as string and method const inputs', (t) => {
    t.fail('not implemented');
    t.end();
});
