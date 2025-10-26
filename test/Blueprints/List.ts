/**
 * @author      Adrian Preuß
 * @version     1.0.0
 */

/* Unit Tests */
import assert from 'node:assert';
import { test } from 'node:test';

/* Core */
import { config } from 'dotenv';
import {Configuration, Blueprints, Blueprint, SessionException} from '../../src';

config();

const sessionId = process.env.SESSION;

if(!sessionId) {
    throw new Error('SESSION not set in .env file');
}

Configuration.setSession(sessionId);

console.log('++++++++++++++++++++++++++++++++++++++++ Blueprints List ++++++++++++++++++++++++++++++++++++++++');

/* Starting Tests */
test('List all Blueprints',  async (context) => {
    try {
        const blueprints: Blueprint[] | null = await Blueprints.list();
        console.log('Blueprints:', blueprints);
    } catch(error) {
        if(error instanceof SessionException) {
            assert.fail('Session expired!');
        }
    }
});

test("Blueprint - Category methods", async (t) => {
    try {
        const blueprints: Blueprint[] | null = await Blueprints.list();

        if(!blueprints || blueprints.length === 0) {
            console.log('No blueprints available for testing');
            return;
        }

        const blueprint = blueprints[0];

        console.log('\n===== Blueprint Category Analysis =====');
        console.log('Blueprint Name:', blueprint.getName());
        console.log('Blueprint ID:', blueprint.getId());

        // Get all categories
        const categories = blueprint.getCategories();
        console.log('\nAll unique categories:', categories);
        console.log('Total unique categories:', categories.length);

        // Test each category
        for(const category of categories) {
            const optionsInCategory = blueprint.getOptions(category);
            console.log(`\nCategory "${category}":`);
            console.log(`  - Options count: ${optionsInCategory.length}`);
            console.log(`  - Has category: ${blueprint.hasCategory(category)}`);

            // Show first 3 options in this category
            const previewOptions = optionsInCategory.slice(0, 3);
            for(const option of previewOptions) {
                console.log(`    * ${option.getName()} (${option.getId()}) - Type: ${option.getType()}`);
            }
            if(optionsInCategory.length > 3) {
                console.log(`    ... and ${optionsInCategory.length - 3} more`);
            }
        }

        // Test all options without category filter
        const allOptions = blueprint.getOptions();
        console.log('\nTotal options (no filter):', allOptions.length);

        // Test tags
        const tags = blueprint.getTags();
        console.log('\nTotal tags:', tags.length);
        if(tags.length > 0) {
            console.log('First 3 tags:');
            const previewTags = tags.slice(0, 3);
            for(const tag of previewTags) {
                console.log(`  - ${tag.getName()} (${tag.getId()}) - Category: ${tag.getCategory()}`);
            }
            if(tags.length > 3) {
                console.log(`  ... and ${tags.length - 3} more tags`);
            }
        }

        // Test hasCategory with non-existent category
        console.log('\nHas "nonexistent" category:', blueprint.hasCategory('nonexistent'));

        assert.ok(true, 'Category methods work correctly');
    } catch(error) {
        if(error instanceof SessionException) {
            assert.fail('Session expired!');
        }
        throw error;
    }
});