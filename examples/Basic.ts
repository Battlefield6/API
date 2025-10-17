/**
 * Basic usage example for battlefield6-api
 * Shows how to set up the API and get blueprint information
 */
import { config } from 'dotenv';
import { Configuration, Blueprint } from '../src';

config();

async function basicExample() {
    const sessionId = process.env.SESSION;

    if(!sessionId) {
        throw new Error('SESSION not set in .env file');
    }

    Configuration.setSession(sessionId);

    try {
        // Get list of all blueprint IDs
        const blueprintList = await Blueprint.list();

        if(blueprintList && blueprintList.blueprintIds) {
            console.log(`Found ${blueprintList.blueprintIds.length} blueprints`);

            // Get detailed information for the first blueprint
            if(blueprintList.blueprintIds.length > 0) {
                const blueprintDetails = await Blueprint.get([blueprintList.blueprintIds[0]]);
                console.log('First blueprint:', blueprintDetails);
            }
        } else {
            console.log('No blueprints found');
        }
    } catch (error) {
        console.error('Error fetching blueprints:', error);
    }
}

// Run the example
basicExample();
