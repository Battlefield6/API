/**
 * @author      Adrian Preuß
 * @version     1.0.0
 */

/* Unit Tests */
import assert from "node:assert";
import test from'node:test';

/* Core */
import { config } from 'dotenv';
import {Blueprint, Blueprints, Configuration, Mods, SessionException} from '../../src';

config();

const sessionId = process.env.SESSION;

if(!sessionId) {
    throw new Error('SESSION not set in .env file');
}

Configuration.setSession(sessionId);

console.log('++++++++++++++++++++++++++++++++++++++++ Mods List ++++++++++++++++++++++++++++++++++++++++');

/* Starting Tests */
test("List all Mods", async (t) => {
    try {
        const mods = await Mods.list();
        console.log('Mods:', mods);
    } catch(error) {
        if(error instanceof SessionException) {
            assert.fail('Session expired!');
        }
    }
});