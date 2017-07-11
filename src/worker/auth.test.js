import test from 'tape';
import sinon from 'sinon';
import {
    hex,
    sha256Hash,
    hmacSha256,
    pad,
    getTimestamp,
} from './auth';


test('getTimestamp returns right format', (t) => {
    const clock = sinon.useFakeTimers(new Date('2017-07-11T09:46:56Z'));

    t.plan(1);
    t.equal(getTimestamp(), '20170711T094656Z');

    clock.restore();
});

test('pad does pad single digit input', (t) => {
    t.plan(2);
    t.equal(pad(1), '01');
    t.equal(pad(6), '06');
});

test('pad does not touch non-digit input', (t) => {
    t.plan(3);
    t.equal(pad('a'), 'a');
    t.looseEqual(pad({}), {});
    t.looseEqual(pad(['aaaaaa']), ['aaaaaa']);
});

test('pad does not pad double or longer digit input', (t) => {
    t.plan(3);
    t.equal(pad(111), 111);
    t.equal(pad(99), 99);
    t.equal(pad(97779), 97779);
});

test('hex returns lowercase base16 format', (t) => {
    t.plan(4);
    t.equal(hex('hello world'), '68656c6c6f20776f726c64');
    t.equal(hex(1), '0031');
    t.equal(hex('ceçi n\'est pas une pipe'), '6365c3a769206e276573742070617320756e652070697065');
    t.equal(hex(100), '0000');
});
