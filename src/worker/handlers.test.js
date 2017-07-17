import test from 'tape';
import sinon from 'sinon';
import { handleFetch } from './handlers';
import * as _ from './_handlers';
import * as state from './state';
import * as responses from './responses';


test('isBypassed filters urls correctly', (t) => {
    const bypassedUrls = ['http://bypassedurl'];
    const requestBypasssed = new Request('http://bypassedurl');
    const requestNotbypassed = new Request('http://notbypassedurl');

    t.plan(2);
    t.ok(_.isBypassed(bypassedUrls, requestBypasssed));
    t.notOk(_.isBypassed(bypassedUrls, requestNotbypassed));
});


test('isGateway detects gateway url', (t) => {
    const gatewayUrl = 'http://gateway';
    const requestGateway = new Request('http://gateway');
    const requestNotGateway = new Request('http://notgateway');

    t.plan(2);
    t.ok(_.isGateway(gatewayUrl, requestGateway));
    t.notOk(_.isGateway(gatewayUrl, requestNotGateway));
});

test('shouldInterceptRequest filters urls correctly', (t) => {
    const stub = sinon.stub(_, 'getCurrentHostname').returns(window.location.hostname);

    t.plan(2);
    t.ok(_.shouldInterceptRequest(new Request(window.location.href)));
    t.notOk(_.shouldInterceptRequest(new Request('http://www.example.com')));

    stub.restore();
});

test('handleFetch bypasses request to different domains', (t) => {
    const event = { type: 'fetch', request: new Request('http://www.example.com') };
    const spyShouldInterceptRequest = sinon.spy(_, 'shouldInterceptRequest');
    const spyRespond = sinon.stub(_, 'respond');

    t.plan(2);
    handleFetch(event);
    t.ok(spyShouldInterceptRequest.calledOnce);
    t.ok(spyRespond.notCalled);

    spyShouldInterceptRequest.restore();
    spyRespond.restore();
});

test('handleFetch bypasses when bypassed item requested', (t) => {
    const event = { type: 'fetch', request: new Request(window.location.href) };
    const stubIsBypassed = sinon.stub(_, 'isBypassed').returns(true);
    const spyShouldInterceptRequest = sinon.spy(_, 'shouldInterceptRequest');
    const spyRespond = sinon.stub(_, 'respond');


    t.plan(3);
    handleFetch(event);
    t.ok(stubIsBypassed.calledOnce);
    t.ok(spyShouldInterceptRequest.called);
    t.ok(spyRespond.notCalled);

    stubIsBypassed.restore();
    spyShouldInterceptRequest.restore();
    spyRespond.restore();
});

test('handleFetch redirects to gateway when not authorized', (t) => {
    const event = { type: 'fetch', request: new Request(window.location.href) };
    const stubIsAuthorized = sinon.stub(state, 'isAuthorized').returns(false);
    const stubRepondWith = sinon.stub(responses, 'respondWithRedirectToGateway');
    const spyRespond = sinon.stub(_, 'respond');
    const spyShouldInterceptRequest = sinon.spy(_, 'shouldInterceptRequest');

    t.plan(4);
    handleFetch(event);
    t.ok(spyShouldInterceptRequest.calledOnce);
    t.ok(stubIsAuthorized.called);
    t.ok(stubRepondWith.calledOnce);
    t.ok(spyRespond.calledOnce);

    stubIsAuthorized.restore();
    stubRepondWith.restore();
    spyRespond.restore();
    spyShouldInterceptRequest.restore();
});

test('handleFetch responds with item when authorized', (t) => {
    const event = { type: 'fetch', request: new Request(window.location.href) };
    const stubIsAuthorized = sinon.stub(state, 'isAuthorized').returns(true);
    const stubIsBypassed = sinon.stub(_, 'isBypassed').returns(false);
    const stubRepondWith = sinon.stub(responses, 'respondWithRequestedItem');
    const spyRespond = sinon.stub(_, 'respond');
    const spyShouldInterceptRequest = sinon.spy(_, 'shouldInterceptRequest');


    t.plan(5);
    handleFetch(event);
    t.ok(spyShouldInterceptRequest.calledOnce);
    t.ok(stubIsAuthorized.called);
    t.ok(stubIsBypassed.called);
    t.ok(spyRespond.calledOnce);
    t.ok(stubRepondWith.calledOnce);

    stubIsAuthorized.restore();
    stubIsBypassed.restore();
    stubRepondWith.restore();
    spyRespond.restore();
    spyShouldInterceptRequest.restore();
});

test('handleFetch responds with index page when authorized and requesting gateway', (t) => {
    const event = { type: 'fetch', request: new Request(window.location.href) };
    const stubIsAuthorized = sinon.stub(state, 'isAuthorized').returns(true);
    const stubIsGateway = sinon.stub(_, 'isGateway').returns(true);
    const stubRepondWith = sinon.stub(responses, 'repondWithRedirectToIndex');
    const spyRespond = sinon.stub(_, 'respond');
    const spyShouldInterceptRequest = sinon.spy(_, 'shouldInterceptRequest');


    t.plan(5);
    handleFetch(event);
    t.ok(spyShouldInterceptRequest.calledOnce);
    t.ok(stubIsAuthorized.called);
    t.ok(stubIsGateway.called);
    t.ok(stubRepondWith.calledOnce);
    t.ok(spyRespond.calledOnce);

    stubIsAuthorized.restore();
    stubIsGateway.restore();
    stubRepondWith.restore();
    spyRespond.restore();
    spyShouldInterceptRequest.restore();
});
