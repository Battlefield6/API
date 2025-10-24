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

const sessionId = process.env.SESSION;

if(!sessionId) {
    throw new Error('SESSION not set in .env file');
}

Configuration.setSession(sessionId);

test("Check Session", (t) => {
    const uuidRegex                     = /^web-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const sessionValue: string | null   = Configuration.getSession();

    console.info(`Session: ${sessionValue}`);

    assert.notStrictEqual(sessionValue, null, "Session can't be null!");
    assert.match(sessionValue ?? '', uuidRegex,`Session mismatch: "${sessionValue}"`);
});