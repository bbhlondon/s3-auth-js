import sha256 from 'crypto-js/sha256';
import test from 'tape';
import sinon from 'sinon';
import * as utils from './utils';
import * as consts from '../consts';
import * as _ from './_aws';
import {
    createCanonicalRequest,
    // createStringToSign,
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
    t.throws(() => _.AWSURIEncode(), Error(consts.ERROR_PARAM_REQUIRED));
    t.throws(() => _.AWSURIEncode('foo'), Error(consts.ERROR_PARAM_REQUIRED));
    t.throws(() => _.AWSURIEncode(0, 'foo'), Error(consts.ERROR_PARAM_TYPE_IS_NOT_STRING));
    t.throws(() => _.AWSURIEncode({}, true), Error(consts.ERROR_PARAM_TYPE_IS_NOT_STRING));
    t.throws(() => _.AWSURIEncode(['foo'], true), Error(consts.ERROR_PARAM_TYPE_IS_NOT_STRING));
    t.throws(() => _.AWSURIEncode('foo', 'foo'), Error(consts.ERROR_PARAM_TYPE_IS_NOT_BOOLEAN));
    t.throws(() => _.AWSURIEncode('foo', {}), Error(consts.ERROR_PARAM_TYPE_IS_NOT_BOOLEAN));
    t.throws(() => _.AWSURIEncode('foo', ['foo']), Error(consts.ERROR_PARAM_TYPE_IS_NOT_BOOLEAN));
    t.doesNotThrow(() => _.AWSURIEncode('foo', true), Error(consts.ERROR_PARAM_REQUIRED));
    t.doesNotThrow(() => _.AWSURIEncode('foo', false), Error(consts.ERROR_PARAM_TYPE_IS_NOT_STRING));
    t.doesNotThrow(() => _.AWSURIEncode('foo', false), Error(consts.ERROR_PARAM_TYPE_IS_NOT_BOOLEAN));

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
    const stubEncode = sinon.stub(_, 'AWSURIEncode');

    t.throws(() => _.encodeQueryStringParameters(), Error(consts.ERROR_PARAM_REQUIRED));
    t.throws(() => _.encodeQueryStringParameters('foo'), Error(consts.ERROR_PARAM_TYPE_IS_NOT_OBJECT));
    t.throws(() => _.encodeQueryStringParameters(34), Error(consts.ERROR_PARAM_TYPE_IS_NOT_OBJECT));
    t.throws(() => _.encodeQueryStringParameters([]), Error(consts.ERROR_PARAM_TYPE_IS_NOT_OBJECT));
    let params = {};
    t.throws(() => _.encodeQueryStringParameters(params), Error(consts.ERROR_PROPERTY_NOT_FOUND));
    params.foo = 'bar';
    t.throws(() => _.encodeQueryStringParameters(params), Error(consts.ERROR_PROPERTY_NOT_FOUND));
    params.set = () => {};
    t.throws(() => _.encodeQueryStringParameters(params), Error(consts.ERROR_PROPERTY_NOT_FOUND));
    params = new URLSearchParams('');
    t.doesNotThrow(() => _.encodeQueryStringParameters(params), Error(consts.ERROR_PARAM_REQUIRED));
    t.doesNotThrow(
        () => _.encodeQueryStringParameters(params), Error(consts.ERROR_PARAM_TYPE_IS_NOT_OBJECT));
    t.doesNotThrow(
        () => _.encodeQueryStringParameters(params), Error(consts.ERROR_PROPERTY_NOT_FOUND));

    t.end();
    stubEncode.restore();
});

test('encodeQueryStringParameters encodes and alphabetises all keys and values and returns a string', (t) => {
    const fakeEncode = x => `|${x}|`;
    const stubEncode = sinon.stub(_, 'AWSURIEncode').callsFake(fakeEncode);

    t.equal(_.encodeQueryStringParameters(new URLSearchParams('')), '');
    t.equal(_.encodeQueryStringParameters(new URLSearchParams('foo=bar')), '|foo|=|bar|');
    t.equal(_.encodeQueryStringParameters(new URLSearchParams('foo=bar&baz=bag')), '|baz|=|bag|&|foo|=|bar|');
    t.equal(_.encodeQueryStringParameters(new URLSearchParams('z=foo&y=bar&a=baz')), '|a|=|baz|&|y|=|bar|&|z|=|foo|');

    t.end();
    stubEncode.restore();
});

test('getRequestBody requires a Request object to be passed in', (t) => {
    t.throws(() => _.getRequestBody(), Error(consts.ERROR_PARAM_REQUIRED));
    t.throws(() => _.getRequestBody('foo'), Error(consts.ERROR_PARAM_TYPE_IS_NOT_OBJECT));
    t.throws(() => _.getRequestBody(34), Error(consts.ERROR_PARAM_TYPE_IS_NOT_OBJECT));
    t.throws(() => _.getRequestBody([]), Error(consts.ERROR_PARAM_TYPE_IS_NOT_OBJECT));
    const request = {};
    t.throws(() => _.getRequestBody(request), Error(consts.ERROR_PROPERTY_NOT_FOUND));
    request.foo = 'bar';
    t.throws(() => _.getRequestBody(request), Error(consts.ERROR_PROPERTY_NOT_FOUND));
    request.bodyUsed = false;
    t.throws(() => _.getRequestBody(request), Error(consts.ERROR_PROPERTY_NOT_FOUND));
    request.text = () => {};
    t.doesNotThrow(() => _.getRequestBody(request), Error(consts.ERROR_PARAM_REQUIRED));
    t.doesNotThrow(() => _.getRequestBody(request), Error(consts.ERROR_PARAM_TYPE_IS_NOT_OBJECT));
    t.doesNotThrow(() => _.getRequestBody(request), Error(consts.ERROR_PROPERTY_NOT_FOUND));
    t.end();
});

test('getRequestBody handles throws error if body exists', (t) => {
    const request = {
        bodyUsed: true,
        text: 'foo',
    };
    t.throws(() => _.getRequestBody(request), Error(consts.ERROR_UNSUPPORTED_HTTP_VERB));
    t.end();
});

test('getRequestBody returns empty string for no body', (t) => {
    const request = {
        bodyUsed: false,
        text: 'foo',
    };
    t.equal(_.getRequestBody(request), '');
    t.end();
});

test('verifyHeaderRequirements requires array input', (t) => {
    t.throws(() => _.verifyHeaderRequirements(), Error(consts.ERROR_PARAM_REQUIRED));
    t.throws(() => _.verifyHeaderRequirements(''), Error(consts.ERROR_PARAM_TYPE_IS_NOT_ARRAY));
    t.throws(() => _.verifyHeaderRequirements('foo'), Error(consts.ERROR_PARAM_TYPE_IS_NOT_ARRAY));
    t.throws(() => _.verifyHeaderRequirements(345), Error(consts.ERROR_PARAM_TYPE_IS_NOT_ARRAY));
    t.throws(() => _.verifyHeaderRequirements({}), Error(consts.ERROR_PARAM_TYPE_IS_NOT_ARRAY));
    t.doesNotThrow(() => _.verifyHeaderRequirements([]), Error(consts.ERROR_PARAM_REQUIRED));
    t.doesNotThrow(
        () => _.verifyHeaderRequirements([]), Error(consts.ERROR_PARAM_TYPE_IS_NOT_ARRAY));
    t.end();
});

test('verifyHeaderRequirements requires at least one HOST header', (t) => {
    t.notOk(_.verifyHeaderRequirements([]));
    t.notOk(_.verifyHeaderRequirements(['foo']));
    t.notOk(_.verifyHeaderRequirements(['foo', 'bar']));
    t.notOk(_.verifyHeaderRequirements([{
        foo: 'bar',
    }]));
    t.notOk(_.verifyHeaderRequirements([{
        name: 'foo',
        value: 'bar',
    }]));
    t.notOk(_.verifyHeaderRequirements([{
        name: 'foo',
        value: 'bar',
    }, {
        name: 'baz',
        value: 'bag',
    }]));
    t.ok(_.verifyHeaderRequirements([{
        name: 'host',
    }]));
    t.ok(_.verifyHeaderRequirements([{
        name: 'host',
        value: 'bar',
    }, {
        name: 'baz',
        value: 'bag',
    }]));
    t.ok(_.verifyHeaderRequirements([{
        name: 'baz',
        value: 'bag',
    }, {
        name: 'HOST',
        value: 'bar',
    }]));
    t.end();
});

test('processHeaders requires a Request object and a body string to be passed in', (t) => {
    t.throws(() => _.processHeaders(), Error(consts.ERROR_PARAM_REQUIRED));
    t.throws(() => _.processHeaders('foo'), Error(consts.ERROR_PARAM_REQUIRED));
    t.throws(() => _.processHeaders('foo', 'bar'), Error(consts.ERROR_PARAM_TYPE_IS_NOT_OBJECT));
    t.throws(() => _.processHeaders([], 'bar'), Error(consts.ERROR_PARAM_TYPE_IS_NOT_OBJECT));
    t.throws(() => _.processHeaders(99, 'bar'), Error(consts.ERROR_PARAM_TYPE_IS_NOT_OBJECT));
    t.throws(() => _.processHeaders('foo', 'bar'), Error(consts.ERROR_PARAM_TYPE_IS_NOT_OBJECT));
    t.throws(() => _.processHeaders({}, {}), Error(consts.ERROR_PARAM_TYPE_IS_NOT_STRING));
    t.throws(() => _.processHeaders({}, 546), Error(consts.ERROR_PARAM_TYPE_IS_NOT_STRING));
    t.throws(() => _.processHeaders({}, ['bar']), Error(consts.ERROR_PARAM_TYPE_IS_NOT_STRING));
    t.throws(() => _.processHeaders({}, 'bar'), Error(consts.ERROR_PROPERTY_NOT_FOUND));
    t.throws(() => _.processHeaders({ foo: '' }, 'bar'), Error(consts.ERROR_PROPERTY_NOT_FOUND));
    const req = {
        headers: {
            entries: () => ['foo', 'bar'],
        },
    };
    const stubVerify = sinon.stub(_, 'verifyHeaderRequirements').returns(true);
    t.doesNotThrow(() => _.processHeaders(req, 'bar'), Error(consts.ERROR_PARAM_REQUIRED));
    t.doesNotThrow(() => _.processHeaders(req, 'bar'), Error(consts.ERROR_PARAM_TYPE_IS_NOT_OBJECT));
    t.doesNotThrow(() => _.processHeaders(req, 'bar'), Error(consts.ERROR_PARAM_TYPE_IS_NOT_STRING));
    t.doesNotThrow(() => _.processHeaders(req, 'bar'), Error(consts.ERROR_PROPERTY_NOT_FOUND));
    t.end();
    stubVerify.restore();
});

test('processHeaders verifies headers', (t) => {
    const h = new Headers();
    h.append('foo', 'bar');
    const req = { headers: h };
    const stubVerify = sinon.stub(_, 'verifyHeaderRequirements').returns(false);

    t.throws(() => _.processHeaders(req, 'bar'), Error(consts.ERROR_REQUIRED_HEADER_NOT_FOUND));
    t.ok(stubVerify.calledOnce);

    stubVerify.reset();
    stubVerify.returns(true);

    t.doesNotThrow(() => _.processHeaders(req, 'bar'), Error(consts.ERROR_REQUIRED_HEADER_NOT_FOUND));
    t.ok(stubVerify.calledOnce);

    t.end();
    stubVerify.restore();
});

test('processHeaders returns array of objects with name & value keys, sorted by name', (t) => {
    const h = new Headers();
    h.append('zed', 'content');
    h.append('why', 'not');
    h.append('foo', 'bar');
    const req = { headers: h };
    const stubVerify = sinon.stub(_, 'verifyHeaderRequirements').returns(true);
 
    const headers = _.processHeaders(req, 'foo', 'random');
    t.ok(Array.isArray(headers));
    t.equal(headers.length, 3);
    t.deepLooseEqual(headers[0], {
        name: 'foo',
        value: 'bar',
    });
    t.deepLooseEqual(headers[1], {
        name: 'why',
        value: 'not',
    });
    t.deepLooseEqual(headers[2], {
        name: 'zed',
        value: 'content',
    });

    t.end();
    stubVerify.restore();
});

test('processHeaders adds content header for AWS4/SHA256', (t) => {
    const h = new Headers();
    h.append('foo', 'bar');
    const req = { headers: h };
    const stubVerify = sinon.stub(_, 'verifyHeaderRequirements').returns(true);
    
    let headers = _.processHeaders(req, 'foo', 'random');
    t.notOk(headers.some(el => el.name && el.name.toLowerCase() === 'x-amz-content-sha256'));

    headers = _.processHeaders(req, 'foo', 'AWS4_SIGNED_HEADERS');
    t.ok(headers.some(el => el.name && el.name.toLowerCase() === 'x-amz-content-sha256'));

    t.end();
    stubVerify.restore();
});

test('processHeaders content header is correctly hashed', (t) => {
    const h = new Headers();
    h.append('foo', 'bar');
    const req = { headers: h };
    const stubVerify = sinon.stub(_, 'verifyHeaderRequirements').returns(true);

    const headers = _.processHeaders(req, 'body-content');
    const contentHeader = headers.find(el => el.name === 'x-amz-content-sha256');
    t.equal(contentHeader.value, sha256('body-content').toString());

    t.end();
    stubVerify.restore();
});

test('formatCanonicalHeaders requires array of objects', (t) => {
    t.throws(() => _.formatCanonicalHeaders(), Error(consts.ERROR_PARAM_REQUIRED));
    t.throws(() => _.formatCanonicalHeaders(''), Error(consts.ERROR_PARAM_TYPE_IS_NOT_ARRAY));
    t.throws(() => _.formatCanonicalHeaders(87), Error(consts.ERROR_PARAM_TYPE_IS_NOT_ARRAY));
    t.throws(() => _.formatCanonicalHeaders('oo'), Error(consts.ERROR_PARAM_TYPE_IS_NOT_ARRAY));
    t.throws(() => _.formatCanonicalHeaders({}), Error(consts.ERROR_PARAM_TYPE_IS_NOT_ARRAY));
    t.throws(() => _.formatCanonicalHeaders(['foo', 'bar']), Error(consts.ERROR_PARAM_TYPE_IS_NOT_OBJECT));
    t.throws(() => _.formatCanonicalHeaders([{}]), Error(consts.ERROR_PROPERTY_NOT_FOUND));
    t.throws(() => _.formatCanonicalHeaders([{ name: 'foo' }]), Error(consts.ERROR_PROPERTY_NOT_FOUND));
    t.doesNotThrow(() => _.formatCanonicalHeaders([{ name: 'foo', value: 'bar' }]), Error(consts.ERROR_PROPERTY_NOT_FOUND));
    t.end();
});

test('formatCanonicalHeaders returns correctly formatted string', (t) => {
    let headers = [];
    t.equal(_.formatCanonicalHeaders(headers), '');
    headers = [{
        name: 'foo',
        value: 'bar',
    }];
    t.equal(_.formatCanonicalHeaders(headers), 'foo:bar\n');
    headers = [{
        name: 'foo',
        value: 'bar',
    }, {
        name: 'baz',
        value: 'bag',
    }];
    t.equal(_.formatCanonicalHeaders(headers), 'foo:bar\nbaz:bag\n');
    t.end();
});

test('formatSignedHeaders requires array of objects', (t) => {
    t.throws(() => _.formatSignedHeaders(), Error(consts.ERROR_PARAM_REQUIRED));
    t.throws(() => _.formatSignedHeaders(''), Error(consts.ERROR_PARAM_TYPE_IS_NOT_ARRAY));
    t.throws(() => _.formatSignedHeaders(87), Error(consts.ERROR_PARAM_TYPE_IS_NOT_ARRAY));
    t.throws(() => _.formatSignedHeaders('oo'), Error(consts.ERROR_PARAM_TYPE_IS_NOT_ARRAY));
    t.throws(() => _.formatSignedHeaders({}), Error(consts.ERROR_PARAM_TYPE_IS_NOT_ARRAY));
    t.throws(() => _.formatSignedHeaders(['foo', 'bar']), Error(consts.ERROR_PARAM_TYPE_IS_NOT_OBJECT));
    t.throws(() => _.formatSignedHeaders([{}]), Error(consts.ERROR_PROPERTY_NOT_FOUND));
    t.doesNotThrow(() => _.formatSignedHeaders([{ name: 'foo' }]), Error(consts.ERROR_PARAM_REQUIRED));
    t.doesNotThrow(() => _.formatSignedHeaders([{ name: 'foo' }]), Error(consts.ERROR_PARAM_TYPE_IS_NOT_ARRAY));
    t.doesNotThrow(() => _.formatSignedHeaders([{ name: 'foo' }]), Error(consts.ERROR_PARAM_TYPE_IS_NOT_OBJECT));
    t.doesNotThrow(() => _.formatSignedHeaders([{ name: 'foo' }]), Error(consts.ERROR_PROPERTY_NOT_FOUND));
    t.end();
});

test('formatSignedHeaders returns correctly formatted string', (t) => {
    let headers = [];
    t.equal(_.formatSignedHeaders(headers), '');
    headers = [{
        name: 'foo',
        value: 'bar',
    }];
    t.equal(_.formatSignedHeaders(headers), 'foo');
    headers = [{
        name: 'foo',
        value: 'bar',
    }, {
        name: 'baz',
        value: 'bag',
    }];
    t.equal(_.formatSignedHeaders(headers), 'foo;baz');
    t.end();
});

/**
 * PUBLIC / API methods
 */

test('createCanonicalRequest requires url as string and method const inputs', (t) => {
    const stubReqBody = sinon.stub(_, 'getRequestBody').returns('');
    const stubProcHead = sinon.stub(_, 'processHeaders').returns([]);
    const stubEncQSP = sinon.stub(_, 'encodeQueryStringParameters').returns('');
    const stubFormatCH = sinon.stub(_, 'formatCanonicalHeaders').returns('');
    const stubformatSH = sinon.stub(_, 'formatSignedHeaders').returns('');
    const stubHex = sinon.stub(utils, 'hex');

    t.throws(() => createCanonicalRequest(), Error(consts.ERROR_PARAM_REQUIRED));
    t.throws(() => createCanonicalRequest('foo'), Error(consts.ERROR_PARAM_TYPE_IS_NOT_OBJECT));
    t.throws(() => createCanonicalRequest(['foo']), Error(consts.ERROR_PARAM_TYPE_IS_NOT_OBJECT));
    t.throws(() => createCanonicalRequest(987), Error(consts.ERROR_PARAM_TYPE_IS_NOT_OBJECT));
    t.throws(() => createCanonicalRequest({}), Error(consts.ERROR_PROPERTY_NOT_FOUND));
    t.throws(() => createCanonicalRequest({ method: 'foo' }), Error(consts.ERROR_PARAM_IS_NOT_ALLOWED));
    t.throws(() => createCanonicalRequest({ method: 'POST' }), Error(consts.ERROR_PARAM_IS_NOT_ALLOWED));
    t.doesNotThrow(() => createCanonicalRequest({ method: 'GET', url: 'http://bbh.co.uk' }), Error(consts.ERROR_PARAM_REQUIRED));
    t.doesNotThrow(() => createCanonicalRequest({ method: 'GET', url: 'http://bbh.co.uk' }), Error(consts.ERROR_PARAM_TYPE_IS_NOT_OBJECT));
    t.doesNotThrow(() => createCanonicalRequest({ method: 'GET', url: 'http://bbh.co.uk' }), Error(consts.ERROR_PROPERTY_NOT_FOUND));
    t.doesNotThrow(() => createCanonicalRequest({ method: 'GET', url: 'http://bbh.co.uk' }), Error(consts.ERROR_PARAM_IS_NOT_ALLOWED));

    t.end();
    stubHex.restore();
    stubFormatCH.restore();
    stubformatSH.restore();
    stubEncQSP.restore();
    stubProcHead.restore();
    stubReqBody.restore();
});

test('createCanonicalRequest calls all sub functions and returns formatted string', (t) => {
    const stubReqBody = sinon.stub(_, 'getRequestBody').returns('body-content');
    const intHeaders = [{
        name: 'test-header',
        value: 'test-val',
    }];
    const stubProcHead = sinon.stub(_, 'processHeaders').returns(intHeaders);
    const stubEncQSP = sinon.stub(_, 'encodeQueryStringParameters').returns('query=string');
    const stubFormatCH = sinon.stub(_, 'formatCanonicalHeaders').returns('canon-head');
    const stubFormatSH = sinon.stub(_, 'formatSignedHeaders').returns('sign-head');
    // const stubHash = sinon.stub(crypto, 'sha256').returns('hashed-body');
    const stubHex = sinon.stub(utils, 'hex').returns('hex-body');
    // const stubURL = sinon.createStubInstance(URL);
    // stubURL.pathname = 'url-path';
    // stubURL.searchParams = 'querystring=testqa';

    const reqParam = { method: 'GET', url: 'http://bbh.co.uk/url-path' };
    const result = createCanonicalRequest(reqParam);
    t.ok(stubReqBody.calledOnce);
    t.ok(stubReqBody.calledWith(reqParam));
    t.ok(stubProcHead.calledOnce);
    t.ok(stubProcHead.calledWith(reqParam, 'body-content'));
    t.ok(stubEncQSP.calledOnce);
    t.ok(stubEncQSP.calledWith(new URLSearchParams()));
    t.ok(stubFormatCH.calledOnce);
    t.ok(stubFormatCH.calledWith(intHeaders));
    t.ok(stubFormatSH.calledOnce);
    t.ok(stubFormatSH.calledWith(intHeaders));
    // t.ok(stubHash.calledOnce);
    // t.ok(stubHash.calledWith('body-content'));
    t.ok(stubHex.calledOnce);
    t.ok(stubHex.calledWith(sha256('body-content')));
    t.equal(result, 'GET\n/url-path\nquery=string\ncanon-head\nsign-head\nhex-body\n');
    t.end();

    stubHex.restore();
    stubFormatCH.restore();
    stubFormatSH.restore();
    stubEncQSP.restore();
    stubProcHead.restore();
    stubReqBody.restore();
});

test.skip('createStringToSign requires url as string and method const inputs', (t) => {
    t.fail('not implemented');
    t.end();
});
