import test from 'tape';
import sinon from 'sinon';
import {
    ERROR_PARAM_REQUIRED,
    ERROR_PARAM_TYPE_IS_NOT_STRING,
    ERROR_PARAM_TYPE_IS_NOT_BOOLEAN,
} from '../consts';
import * as utils from './utils';
import * as _ from './_aws';
import {
    createCanonicalRequest,
    createStringToSign,
} from './aws';

/**
 * 'PRIVATE' methods
 */

test('getAWSTimestamp returns right format', (t) => {
    const clock = sinon.useFakeTimers(new Date('2017-07-11T09:46:56Z'));

    t.plan(1);
    t.equal(_.getAWSTimestamp(), '20170711T094656Z');

    clock.restore();
});

test('AWSURIEncode requires string input and bool encodeSlash params', (t) => {
    const stubHex = sinon.stub(utils, 'hex');

    t.plan(11);
    t.throws(() => _.AWSURIEncode(), Error(ERROR_PARAM_REQUIRED));
    t.throws(() => _.AWSURIEncode('foo'), Error(ERROR_PARAM_REQUIRED));
    t.throws(() => _.AWSURIEncode(0, 'foo'), Error(ERROR_PARAM_TYPE_IS_NOT_STRING));
    t.throws(() => _.AWSURIEncode({}, true), Error(ERROR_PARAM_TYPE_IS_NOT_STRING));
    t.throws(() => _.AWSURIEncode(['foo'], true), Error(ERROR_PARAM_TYPE_IS_NOT_STRING));
    t.throws(() => _.AWSURIEncode('foo', 'foo'), Error(ERROR_PARAM_TYPE_IS_NOT_BOOLEAN));
    t.throws(() => _.AWSURIEncode('foo', {}), Error(ERROR_PARAM_TYPE_IS_NOT_BOOLEAN));
    t.throws(() => _.AWSURIEncode('foo', ['foo']), Error(ERROR_PARAM_TYPE_IS_NOT_BOOLEAN));
    t.doesNotThrow(() => _.AWSURIEncode('foo', true), Error(ERROR_PARAM_REQUIRED));
    t.doesNotThrow(() => _.AWSURIEncode('foo', false), Error(ERROR_PARAM_TYPE_IS_NOT_STRING));
    t.doesNotThrow(() => _.AWSURIEncode('foo', false), Error(ERROR_PARAM_TYPE_IS_NOT_BOOLEAN));

    stubHex.restore();
});

test('AWSURIEncode doesn\'t encode unreserved chars', (t) => {
    t.plan(9);
    t.equal(_.AWSURIEncode('a', false), 'a');
    t.equal(_.AWSURIEncode('i', false), 'i');
    t.equal(_.AWSURIEncode('M', false), 'M');
    t.equal(_.AWSURIEncode('6', false), '6');
    t.equal(_.AWSURIEncode('9', false), '9');
    t.equal(_.AWSURIEncode('_', false), '_');
    t.equal(_.AWSURIEncode('-', false), '-');
    t.equal(_.AWSURIEncode('~', false), '~');
    t.equal(_.AWSURIEncode('.', false), '.');
});

test('AWSURIEncode does hex encode, %-prepend and uppercase reserved chars', (t) => {
    const stubHex = sinon.stub(utils, 'hex', x => `fake${x}`);

    t.plan(4);
    t.equal(_.AWSURIEncode(',', false), '%FAKE,');
    t.equal(_.AWSURIEncode('Ṩ', false), '%FAKEṨ');
    t.equal(_.AWSURIEncode('\\', false), '%FAKE\\');
    t.equal(_.AWSURIEncode('>', false), '%FAKE>');

    stubHex.restore();
});

test('AWSURIEncode encodes forward slash chars correctly', (t) => {
    t.plan(2);
    t.equal(_.AWSURIEncode('/', false), '/');
    t.equal(_.AWSURIEncode('/', true), '%2F');
});

test('_.AWSURIEncode encodes space chars and sequences correctly', (t) => {
    const stubHex = sinon.stub(utils, 'hex', x => `|${x}|`);

    t.plan(3);
    t.equal(_.AWSURIEncode(' ', false), '%20');
    t.equal(_.AWSURIEncode('Hello World,/foo', false), 'Hello%20World%|,|/foo');
    t.equal(_.AWSURIEncode('Hello World,/foo', true), 'Hello%20World%|,|%2Ffoo');

    stubHex.restore();
});

test('encodeQueryStringParameters requires a URL.searchParams object', (t) => {
    t.fail('not implemented');
    t.end();
});

test('encodeQueryStringParameters encodes all keys and values', (t) => {
    t.fail('not implemented');
    t.end();
});

test('encodeQueryStringParameters returns the same obj as passed in', (t) => {
    t.fail('not implemented');
    t.end();
});

test('getRequestBody requires a Request object to be passed in', (t) => {
    t.fail('not implemented');
    t.end();
});

test('getRequestBody handles promise resolution if body exists', (t) => {
    t.fail('not implemented');
    t.end();
});

test('getRequestBody returns empty string for no body', (t) => {
    t.fail('not implemented');
    t.end();
});

test('verifyHeaderRequirements requires array of objects', (t) => {
    t.fail('not implemented');
    t.end();
});

test('verifyHeaderRequirements requires at least one HOST header', (t) => {
    t.fail('not implemented');
    t.end();
});

test('processHeaders requires a Request object and a body string to be passed in', (t) => {
    t.fail('not implemented');
    t.end();
});

test('processHeaders verifies headers', (t) => {
    t.fail('not implemented');
    t.end();
});

test('processHeaders adds content header for AWS4/SHA256', (t) => {
    t.fail('not implemented');
    t.end();
});

test('processHeaders returns array of objects with name & value keys, sorted by name', (t) => {
    t.fail('not implemented');
    t.end();
});

test('formatCanonicalHeaders requires array of objects', (t) => {
    t.fail('not implemented');
    t.end();
});

test('formatCanonicalHeaders returns correctly formatted string', (t) => {
    t.fail('not implemented');
    t.end();
});

test('formatSignedHeaders requires array of objects', (t) => {
    t.fail('not implemented');
    t.end();
});

test('formatSignedHeaders returns correctly formatted string', (t) => {
    t.fail('not implemented');
    t.end();
});

/**
 * PUBLIC / API methods
 */

test('createCanonicalRequest requires url as string and method const inputs', (t) => {
    t.fail('not implemented');
    t.end();
});

test('createStringToSign requires url as string and method const inputs', (t) => {
    t.fail('not implemented');
    t.end();
});
