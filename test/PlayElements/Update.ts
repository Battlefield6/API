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

console.log('++++++++++++++++++++++++++++++++++++++++ PlayElements Update ++++++++++++++++++++++++++++++++++++++++');

/* Starting Tests */
test("Update a PlayElement", async (t) => {
    const playelements: PlayElement[] | null    = await PlayElements.list();
    const id: string                            = playelements?.[0]?.id ?? '';
    const element: PlayElement | null           = await PlayElements.get(id);
    console.log('PlayElement:', element);

    if(!element) {
        return;
    }

    element.setName('Updated Name (' + Date.now() + ')');
    element.setDescription('Updated Description on ' + new Date().toISOString() + '!');
    element.setThumbnailUrl('[BB_PREFIX]/glacier/preApprovedThumbnails/Portal_Experience_Tile_Rvl_19-e3c0357e.jpg');

    const response = await PlayElements.update(element);
    console.warn("Updated Play Element:", response);
});