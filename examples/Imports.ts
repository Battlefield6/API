/**
 * Different import styles example
 * Shows various ways to import and use the package
 */

import { config } from 'dotenv';

// Style 1: Import everything
import * as BF6API from '../src';

// Style 2: Import specific items
import { Configuration, Blueprint, PlayElement, PublishState } from '../src';

// Style 3: Import using default exports
import { Connector, Instance } from '../src';

config();

async function importStylesExample() {
    const sessionId = process.env.SESSION;
    
    if (!sessionId) {
        throw new Error('SESSION not set in .env file');
    }

    // Using Style 1 (namespace import)
    BF6API.Configuration.setSession(sessionId);
    const blueprints1 = await BF6API.Blueprint.list();
    console.log('Style 1 - Blueprints:', blueprints1?.blueprintIds?.length);

    // Using Style 2 (named imports)
    Configuration.setSession(sessionId);
    const blueprints2 = await Blueprint.list();
    console.log('Style 2 - Blueprints:', blueprints2?.blueprintIds?.length);

    // Using Style 3 (Instance approach)
    Instance.getConfig().setSession(sessionId);
    const blueprints3 = await Instance.getBlueprint().list();
    console.log('Style 3 - Blueprints:', blueprints3?.blueprintIds?.length);

    // List published PlayElements
    const published = await PlayElement.list([PublishState.PUBLISHED], false);
    console.log('Published elements:', published?.playElements?.length);
}

// Only import types for TypeScript type checking
import type {
    GetScheduledBlueprintsResponse,
    GetOwnedPlayElementsResponse
} from '../src';

function typeExample() {
    // Use imported types for type safety
    let blueprintResponse: GetScheduledBlueprintsResponse | null = null;
    let playElementResponse: GetOwnedPlayElementsResponse | null = null;

    console.log('Type imports work for type checking');
}

// Run examples
importStylesExample();
typeExample();
