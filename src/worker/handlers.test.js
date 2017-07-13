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


test('handleFetch redirects to gateway when not authorized', (t) => {
    const event = { type: 'fetch', request: { url: 'url' } };
    const stubIsAuthorized = sinon.stub(state, 'isAuthorized').returns(false);
    const stubRespond = sinon.stub(responses, 'respondWithRedirectToGateway');


    t.plan(1);
    handleFetch(event);
    t.ok(stubRespond.calledOnce);

    stubIsAuthorized.restore();
    stubRespond.restore();
});

test('handleFetch responds with item when bypassed', (t) => {
    const event = { type: 'fetch', request: { url: 'url' } };
    const stubIsAuthorized = sinon.stub(state, 'isAuthorized').returns(false);
    const stubIsBypassed = sinon.stub(_, 'isBypassed').returns(true);
    const stubRespond = sinon.stub(responses, 'respondWithRequestedItem');


    t.plan(1);
    handleFetch(event);
    t.ok(stubRespond.calledOnce);

    stubIsAuthorized.restore();
    stubIsBypassed.restore();
    stubRespond.restore();
});

test('handleFetch responds with item when authorized', (t) => {
    const event = { type: 'fetch', request: { url: 'url' } };
    const stubIsAuthorized = sinon.stub(state, 'isAuthorized').returns(true);
    const stubIsBypassed = sinon.stub(_, 'isBypassed').returns(false);
    const stubRespond = sinon.stub(responses, 'respondWithRequestedItem');


    t.plan(1);
    handleFetch(event);
    t.ok(stubRespond.calledOnce);

    stubIsAuthorized.restore();
    stubIsBypassed.restore();
    stubRespond.restore();
});

test('handleFetch responds with index page when authorized and requesting gateway', (t) => {
    const event = { type: 'fetch', request: { url: 'url' } };
    const stubIsAuthorized = sinon.stub(state, 'isAuthorized').returns(true);
    const stubIsGateway = sinon.stub(_, 'isGateway').returns(true);
    const stubRespond = sinon.stub(responses, 'repondWithRedirectToIndex');


    t.plan(1);
    handleFetch(event);
    t.ok(stubRespond.calledOnce);

    stubIsAuthorized.restore();
    stubIsGateway.restore();
    stubRespond.restore();
});
