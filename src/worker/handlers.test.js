import test from 'tape';
import sinon from 'sinon';
import { handleFetch } from './handlers';
import * as _ from './_handlers';
import * as state from './state';
import * as responses from './responses';


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
