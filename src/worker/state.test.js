import test from 'tape';
import { setCredentials, getCredentials, deleteCredentials, isAuthorized } from './state';


test('state saves and retrives credentials', (t) => {
    const expectedCredentials = 'credentials';

    t.plan(1);
    setCredentials(expectedCredentials).then(() => {
        getCredentials().then(actualCredentials => t.equal(actualCredentials, expectedCredentials));
    });
});

test('isAuthorized returns correct state', (t) => {
    const expectedCredentials = 'credentials';

    t.plan(2);
    setCredentials(expectedCredentials).then(() => {
        t.ok(isAuthorized());
        deleteCredentials().then(() => {
            t.notOk(isAuthorized());
        });
    });
});

test('state deletes credentials', (t) => {
    const expectedCredentials = 'credentials';

    t.plan(1);
    setCredentials(expectedCredentials).then(() => {
        deleteCredentials().then(() => {
            getCredentials().then(actualCredentials => t.equal(actualCredentials, undefined));
        });
    });
});
