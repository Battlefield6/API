/**
 * PlayElement management example
 * Shows how to list, create, update, and delete PlayElements
 */

import { config } from 'dotenv';
import { Configuration, PlayElement, PublishState } from '../src';

config();

async function playElementExample() {
    const sessionId = process.env.SESSION;

    if(!sessionId) {
        throw new Error('SESSION not set in .env file');
    }

    Configuration.setSession(sessionId);

    try {
        // List all owned PlayElements (draft, published, and archived)
        console.log('Fetching owned PlayElements...');
        const ownedElements = await PlayElement.list([
            PublishState.DRAFT,
            PublishState.PUBLISHED,
            PublishState.ARCHIVED
        ], true);

        if (ownedElements && ownedElements.playElements) {
            console.log(`Found ${ownedElements.playElements.length} PlayElements`);

            // Display some information about each element
            ownedElements.playElements.forEach((element, index) => {
                console.log(`${index + 1}. ${element.name} (State: ${element?.publishState})`);
            });
        }

        // Example: Create a new PlayElement
        console.log('\nCreating new PlayElement...');
        const newElement = await PlayElement.create({
            name: 'My Custom Game Mode',
            publishState: PublishState.DRAFT,
            description: { value: 'A custom game mode created via API' },
            designMetadata: null,
            mapRotation: [],
            mutators: [],
            assetCategories: [],
            originalModRules: [],
            playElementSettings: null,
            modLevelDataId: null,
            thumbnailUrl: { value: '[BB_PREFIX]/glacier/preApprovedThumbnails/fallback-abea2685.jpg' },
            attachments: []
        });

        if (newElement) {
            console.log('Created PlayElement:', newElement);
        }

        // Example: Update an existing PlayElement
        // Replace with an actual ID from your account
        const elementIdToUpdate = 'your-playelement-id-here';

        console.log('\nUpdating PlayElement...');
        const updatedElement = await PlayElement.update(elementIdToUpdate, {
            name: `Updated at ${new Date().toISOString()}`,
            publishState: PublishState.DRAFT,
            description: { value: 'Updated via API example' },
            designMetadata: null,
            mapRotation: [],
            mutators: [],
            assetCategories: [],
            originalModRules: [],
            playElementSettings: null,
            modLevelDataId: null,
            thumbnailUrl: { value: '[BB_PREFIX]/glacier/preApprovedThumbnails/fallback-abea2685.jpg' },
            attachments: []
        });

        if (updatedElement) {
            console.log('Updated PlayElement successfully');
        }

        // Example: Delete (archive) a PlayElement
        // Note: This doesn't actually delete, it archives the element
        // const elementIdToDelete = 'your-playelement-id-here';
        // await PlayElement.delete(elementIdToDelete);
        // console.log('Archived PlayElement successfully');

    } catch (error) {
        console.error('Error in PlayElement operations:', error);
    }
}

// Run the example
playElementExample();
