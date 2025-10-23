
// '/santiago.web.authentication.WebAuthentication/viaAuthCode',

import { config } from 'dotenv';
import { Configuration, PlayElements } from '../src';

config();    

(async function main() {
    const sessionId = process.env.SESSION;

    if(!sessionId) {
        throw new Error('SESSION not set in .env file');
    }

    Configuration.setSession(sessionId);
    
    /* Experiences */
    try {
        let list = await PlayElements.list();
        console.log(list);
    } catch(error: any) {
        console.error(error);
    }
})();