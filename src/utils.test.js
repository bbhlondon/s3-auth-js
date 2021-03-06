import test from 'tape';

import * as utils from './utils';
import { ERROR_PARAM_REQUIRED } from './consts';


test('makeMessgae throws error when type undefined', (t) => {
    t.plan(1);
    // @ts-ignore
    t.throws(() => utils.default(), ERROR_PARAM_REQUIRED);
});

test('makeMessgae returns correct message object', (t) => {
    t.plan(1);
    const expected = { type: 'test', payload: { test: 'test' } };
    const msg = utils.default('test', { test: 'test' });

    t.deepLooseEqual(expected, msg);
});

