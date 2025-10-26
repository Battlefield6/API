/**
 * @author      Adrian Preuß
 * @version     1.0.0
 */

/* Unit Tests */
import assert from "node:assert";
import test from'node:test';

/* Core */
import { Tag } from '../../src';

console.log('++++++++++++++++++++++++++++++++++++++++ Tag Model ++++++++++++++++++++++++++++++++++++++++');

/* Starting Tests */
test("Tag - Getter/Setter", (t) => {
    const tag = new Tag();

    tag.setId('tag-123');
    tag.setName('Action');
    tag.setCategory('genre');

    assert.strictEqual(tag.getId(), 'tag-123', 'Tag ID should match');
    assert.strictEqual(tag.getName(), 'Action', 'Tag name should match');
    assert.strictEqual(tag.getCategory(), 'genre', 'Tag category should match');
});

test("Tag - fromJSON/toJSON", (t) => {
    const tag = new Tag();
    const mockData = {
        id: 'tag-456',
        name: 'Fast-Paced',
        category: 'gameplay'
    };

    tag.fromJSON(mockData);

    assert.strictEqual(tag.getId(), 'tag-456', 'Tag ID should match');
    assert.strictEqual(tag.getName(), 'Fast-Paced', 'Tag name should match');
    assert.strictEqual(tag.getCategory(), 'gameplay', 'Tag category should match');

    const json = tag.toJSON();
    assert.strictEqual(json.id, 'tag-456', 'toJSON should preserve id');
    assert.strictEqual(json.name, 'Fast-Paced', 'toJSON should preserve name');
    assert.strictEqual(json.category, 'gameplay', 'toJSON should preserve category');
});

test("Tag - fromJSON with metadata (commented)", (t) => {
    const tag = new Tag();
    const mockData = {
        id: 'tag-789',
        name: 'Competitive',
        category: 'mode',
        metadata: {
            translations: [{ locale: 'en', text: 'Competitive' }],
            resources: [{ type: 'icon', url: 'http://example.com/icon.png' }]
        }
    };

    tag.fromJSON(mockData);

    // Metadata is commented out in implementation, so we just verify basic fields work
    assert.strictEqual(tag.getId(), 'tag-789', 'Tag ID should match');
    assert.strictEqual(tag.getName(), 'Competitive', 'Tag name should match');
});

test("Tag - Default values", (t) => {
    const tag = new Tag();

    assert.strictEqual(tag.getId(), '', 'ID should be empty string by default');
    assert.strictEqual(tag.getName(), '', 'Name should be empty string by default');
    assert.strictEqual(tag.getCategory(), '', 'Category should be empty string by default');
});
