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

console.log('++++++++++++++++++++++++++++++++++++++++ PlayElements List ++++++++++++++++++++++++++++++++++++++++');

/* Starting Tests */
test("List all PlayElements", async (t) => {
    const playelements: PlayElement[] | null = await PlayElements.list();
    console.log('PlayElements:', playelements);
});