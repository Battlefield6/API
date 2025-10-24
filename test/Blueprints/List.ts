/**
 * @author      Adrian Preuß
 * @version     1.0.0
 */

/* Unit Tests */
import assert from "node:assert";
import test from'node:test';

/* Core */
import { config } from 'dotenv';
import {Configuration, Blueprints, Blueprint} from '../../src';

config();

const sessionId = process.env.SESSION;

if(!sessionId) {
    throw new Error('SESSION not set in .env file');
}

Configuration.setSession(sessionId);

console.log('++++++++++++++++++++++++++++++++++++++++ Blueprints List ++++++++++++++++++++++++++++++++++++++++');

/* Starting Tests */
test("List all Blueprints", async (t) => {
    const blueprints: Blueprint[] | null = await Blueprints.list();
    console.log('Blueprints:', blueprints);
});