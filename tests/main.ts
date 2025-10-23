/**
 * @author      Adrian Preuß
 * @version     1.0.0
 */

import { config } from 'dotenv';
import { Configuration, PlayElements, PublishState } from '../src';

config();    

(async function main() {
    const sessionId = process.env.SESSION;

    if(!sessionId) {
        throw new Error('SESSION not set in .env file');
    }

    Configuration.setSession(sessionId);
    
    /* List Experiences */
    try {
        let list = await PlayElements.list();
        console.log(list);
    } catch(error: any) {
        console.error(error);
    }

    /* Update an Experience */
    try {
        let element = await PlayElements.get('e1e4b710-ab88-11f0-8938-a7c004cf99be');

        if(!element) {
            throw new Error('Play Element not found');
        }

        element.setName('Updated Name' + Date.now());
        element.setDescription('Updated Description');
        element.setThumbnailUrl('[BB_PREFIX]/glacier/preApprovedThumbnails/Portal_Experience_Tile_Rvl_19-e3c0357e.jpg');

        var response = await PlayElements.update(element);
        console.warn("Updated Play Element:", response);
    } catch(error: any) {
        console.error(error);
    }
})();