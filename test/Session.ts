/**
 * @author      Adrian Preuß
 * @version     1.0.0
 */

/* Unit Tests */
import assert from "node:assert";
import test from'node:test';

/* Core */
import { config } from 'dotenv';
import { Configuration } from '../src';

config();

test('Check Environment', (t) => {
   assert.notStrictEqual(process.env.SESSION, '', 'Session not set in .env file!');

    Configuration.setSession(process.env.SESSION ?? '');
});

test('Check Session', (t) => {
    const sessionValue: string | null   = Configuration.getSession();

    assert.notStrictEqual(sessionValue, null, "Session can't be null!");
    assert.match(sessionValue ?? '', /^web-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,`Session mismatch: "${sessionValue}"`);
});