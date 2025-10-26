/**
 * @author      Adrian Preuß
 * @version     1.0.0
 */

/* Unit Tests */
import assert from "node:assert";
import test from'node:test';

/* Core */
import { config } from 'dotenv';
import {Configuration, PlayElements, PlayElement, SessionException} from '../../src';

config();

const sessionId = process.env.SESSION;

if(!sessionId) {
  throw new Error('SESSION not set in .env file');
}

Configuration.setSession(sessionId);

console.log('++++++++++++++++++++++++++++++++++++++++ PlayElements Update ++++++++++++++++++++++++++++++++++++++++');

/* Starting Tests */
test("Update a PlayElement - Basic fields", async (t) => {
    try {
        const playelements: PlayElement[] | null    = await PlayElements.list();
        const id: string                            = playelements?.[0]?.getId() ?? '';
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
    } catch(error) {
        if(error instanceof SessionException) {
            assert.fail('Session expired!');
        }
    }
});

test("Update a PlayElement - Design fields", async (t) => {
    try {
        const playelements: PlayElement[] | null    = await PlayElements.list();
        const id: string                            = playelements?.[0]?.getId() ?? '';
        const element: PlayElement | null           = await PlayElements.get(id);

        if(!element) {
            return;
        }

        // Update design name
        element.getDesign().setDesignName('Updated Design (' + Date.now() + ')');

        // Check if maps exist and update rounds
        const maps = element.getMaps();
        if(!maps.isEmpty() && maps.getMaps().length > 0) {
            console.log('Current rounds:', maps.getMaps()[0].getRounds());
            maps.getMaps()[0].setRounds(5);
            console.log('Updated rounds to:', maps.getMaps()[0].getRounds());
        }

        // Check mutators
        const mutators = element.getDesign().getMutators();
        if(mutators.length > 0) {
            console.log('Found', mutators.length, 'mutators');
            console.log('First mutator:', mutators[0].getName(), '=', mutators[0].getValue());
        }

        const response = await PlayElements.update(element);
        console.warn("Updated Play Element with Design changes:", response);
    } catch(error) {
        if(error instanceof SessionException) {
            assert.fail('Session expired!');
        }
    }
});

test("Update a PlayElement - Settings fields", async (t) => {
    try {
        const playelements: PlayElement[] | null    = await PlayElements.list();
        const id: string                            = playelements?.[0]?.getId() ?? '';
        const element: PlayElement | null           = await PlayElements.get(id);

        if(!element) {
            return;
        }

        // Update settings
        const settings = element.getSettings();
        console.log('Current allowCopies:', settings.getAllowCopies());
        settings.setAllowCopies(true);
        console.log('Updated allowCopies to:', settings.getAllowCopies());

        const response = await PlayElements.update(element);
        console.warn("Updated Play Element with Settings changes:", response);
    } catch(error) {
        if(error instanceof SessionException) {
            assert.fail('Session expired!');
        }
    }
});

test("PlayElement - Verify all new fields are accessible", async (t) => {
    try {
        const playelements: PlayElement[] | null    = await PlayElements.list();
        const id: string                            = playelements?.[0]?.getId() ?? '';
        const element: PlayElement | null           = await PlayElements.get(id);

        if(!element) {
            return;
        }

        // Test all new getters
        console.log('ID:', element.getId());
        console.log('Name:', element.getName());
        console.log('Description:', element.getDescription());
        console.log('Created:', element.getCreated());
        console.log('Updated:', element.getUpdated());
        console.log('PublishState:', element.getPublishState());
        console.log('ThumbnailUrl:', element.getThumbnailUrl());
        console.log('Likes:', element.getLikes());
        console.log('ModerationState:', element.getModerationState());
        console.log('ShortCode:', element.getShortCode());

        // Test Creator
        const creator = element.getCreator();
        console.log('Creator Type:', creator.getType());
        console.log('Is Player:', creator.isPlayer());

        // Test Settings
        const settings = element.getSettings();
        console.log('AllowCopies:', settings.getAllowCopies());
        console.log('Secret:', settings.getSecret());
        console.log('Messages:', settings.getMessages());

        // Test Design
        const design = element.getDesign();
        console.log('DesignId:', design.getId());
        console.log('DesignName:', design.getName());
        console.log('Mutators count:', design.getMutators().length);
        console.log('Tags count:', design.getTags().length);
        console.log('Maps count:', design.getMapRotation().getMaps().length);

        assert.ok(true, 'All fields are accessible');
    } catch(error) {
        if(error instanceof SessionException) {
            assert.fail('Session expired!');
        }
        throw error;
    }
});