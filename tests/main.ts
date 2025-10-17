
// '/santiago.web.authentication.WebAuthentication/viaAuthCode',

import { config } from 'dotenv';
import { Configuration, Authentication } from '../src';

config();    

(async function main() {
    const sessionId = process.env.SESSION;

    if(!sessionId) {
        throw new Error('SESSION not set in .env file');
    }

    Configuration.setSession(sessionId);
    
    /* Auth Test */
    try {
        Authentication.start();
    } catch(error: any) {
        console.error(error);
    }
})();