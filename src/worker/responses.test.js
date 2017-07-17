import test from 'tape';
import { respondWithRedirectToGateway, respondWithRequestedItem, repondWithRedirectToIndex } from './responses';
import { GATEWAY_URL, INDEX_URL } from '../consts';

test('respondWithRedirectToGateway redirects to gateway page', (t) => {
    const event = { type: 'fetch', request: new Request(window.location.href) };
    const expected = window.location.href.replace(/\/$/, '') + GATEWAY_URL;

    t.plan(1);
    const request = respondWithRedirectToGateway(event);
    t.equal(request.url, expected);
});

test('repondWithRedirectToIndex redirects to index page', (t) => {
    const event = { type: 'fetch', request: new Request(window.location.href) };
    const expected = window.location.href.replace(/\/$/, '') + INDEX_URL;

    t.plan(1);
    const request = repondWithRedirectToIndex(event);
    t.equal(request.url, expected);
});

test('respondWithRequestedItem responds with requested item', (t) => {
    const event = { type: 'fetch', request: new Request(window.location.href) };
    const expected = event.request.url;

    t.plan(1);
    const request = respondWithRequestedItem(event);
    t.equal(request.url, expected);
});

