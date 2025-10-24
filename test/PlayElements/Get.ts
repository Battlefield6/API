/**
 * @author      Adrian Preuß
 * @version     1.0.0
 */

/* Unit Tests */
import assert from "node:assert";
import test from'node:test';

/* Core */
import { config } from 'dotenv';
import {Configuration, PlayElements, PlayElement } from '../../src';

config();

const sessionId = process.env.SESSION;

if(!sessionId) {
    throw new Error('SESSION not set in .env file');
}

Configuration.setSession(sessionId);

console.log('++++++++++++++++++++++++++++++++++++++++ PlayElements Get ++++++++++++++++++++++++++++++++++++++++');

/* Starting Tests */
test("Get a specific PlayElement", async (t) => {
    const playelements: PlayElement[] | null    = await PlayElements.list();
    const id: string                            = playelements?.[0]?.id ?? '';

    console.log('Try to (re-)load:', id);

    const element: PlayElement | null = await PlayElements.get(id);
    console.log('PlayElement:', element);
});