import test from 'tape';

if (process.env.BABEL_ENV === 'test') {
    test.onFinish(function () {
        window.close();
    });
}
