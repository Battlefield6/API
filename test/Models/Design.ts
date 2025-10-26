/**
 * @author      Adrian Preuß
 * @version     1.0.0
 */

/* Unit Tests */
import assert from "node:assert";
import test from'node:test';

/* Core */
import { Design, MapRotation, Option, Tag, OptionType } from '../../src';

console.log('++++++++++++++++++++++++++++++++++++++++ Design Model ++++++++++++++++++++++++++++++++++++++++');

/* Starting Tests */
test("Design - fromJSON/toJSON with basic fields", (t) => {
    const design = new Design();
    const mockData = {
        designId: 'design-123',
        designName: 'Test Design',
        created: '2025-01-01T00:00:00Z',
        mutators: [],
        assetCategories: [],
        licenseRequirements: ['license1', 'license2'],
        tags: [],
        attachments: [],
        groupLicenses: [],
        attachmentCompileStatus: 3,
        serverHostLicenseRequirements: []
    };

    design.fromJSON(mockData);

    assert.strictEqual(design.getId(), 'design-123', 'DesignId should match');
    assert.strictEqual(design.getName(), 'Test Design', 'DesignName should match');
    assert.ok(design.getCreated() instanceof Date, 'Created should be a Date');
    assert.strictEqual(design.getLicenseRequirements().length, 2, 'Should have 2 license requirements');
    assert.strictEqual(design.getAttachmentCompileStatus(), 3, 'Compile status should be 3');

    const json = design.toJSON();
    assert.strictEqual(json.designId, 'design-123', 'toJSON should preserve designId');
    assert.strictEqual(json.designName, 'Test Design', 'toJSON should preserve designName');
    assert.strictEqual(json.licenseRequirements.length, 2, 'toJSON should preserve license requirements');
});

test("Design - fromJSON with MapRotation", (t) => {
    const design = new Design();
    const mockData = {
        designId: 'design-123',
        designName: 'Test Design',
        mapRotation: {
            maps: [
                {
                    levelName: 'TestMap',
                    levelLocation: 'TestLocation',
                    rounds: 3,
                    allowedSpectators: 4,
                    teamComposition: {
                        teams: [
                            { teamId: 0, capacity: 32 }
                        ]
                    }
                }
            ]
        },
        mutators: [],
        assetCategories: [],
        licenseRequirements: [],
        tags: [],
        attachments: [],
        groupLicenses: [],
        attachmentCompileStatus: 0,
        serverHostLicenseRequirements: []
    };

    design.fromJSON(mockData);

    const mapRotation = design.getMapRotation();
    assert.strictEqual(mapRotation.isEmpty(), false, 'MapRotation should not be empty');
    assert.strictEqual(mapRotation.getMaps().length, 1, 'Should have 1 map');
    assert.strictEqual(mapRotation.getMaps()[0].getName(), 'TestMap', 'Map name should match');
    assert.strictEqual(mapRotation.getMaps()[0].getRounds(), 3, 'Rounds should be 3');
});

test("Design - fromJSON with Mutators", (t) => {
    const design = new Design();
    const mockData = {
        designId: 'design-123',
        designName: 'Test Design',
        mutators: [
            {
                id: 'mutator1',
                name: 'Health',
                category: 'gameplay',
                kind: {
                    mutatorInt: {
                        value: 150
                    }
                }
            },
            {
                id: 'mutator2',
                name: 'Speed',
                category: 'gameplay',
                kind: {
                    mutatorBoolean: {
                        value: true
                    }
                }
            }
        ],
        assetCategories: [],
        licenseRequirements: [],
        tags: [],
        attachments: [],
        groupLicenses: [],
        attachmentCompileStatus: 0,
        serverHostLicenseRequirements: []
    };

    design.fromJSON(mockData);

    const mutators = design.getMutators();
    assert.strictEqual(mutators.length, 2, 'Should have 2 mutators');
    assert.strictEqual(mutators[0].getId(), 'mutator1', 'First mutator ID should match');
    assert.strictEqual(mutators[0].getName(), 'Health', 'First mutator name should match');
    assert.strictEqual(mutators[1].getType(), OptionType.BOOLEAN, 'Second mutator should be BOOLEAN type');
});

test("Design - fromJSON with Tags", (t) => {
    const design = new Design();
    const mockData = {
        designId: 'design-123',
        designName: 'Test Design',
        mutators: [],
        assetCategories: [],
        licenseRequirements: [],
        tags: [
            { id: 'tag1', name: 'Action', category: 'genre' },
            { id: 'tag2', name: 'Fast-Paced', category: 'gameplay' }
        ],
        attachments: [],
        groupLicenses: [],
        attachmentCompileStatus: 0,
        serverHostLicenseRequirements: []
    };

    design.fromJSON(mockData);

    const tags = design.getTags();
    assert.strictEqual(tags.length, 2, 'Should have 2 tags');
    assert.strictEqual(tags[0].getId(), 'tag1', 'First tag ID should match');
    assert.strictEqual(tags[0].getName(), 'Action', 'First tag name should match');
    assert.strictEqual(tags[1].getCategory(), 'gameplay', 'Second tag category should match');
});

test("Design - Getter/Setter", (t) => {
    const design = new Design();

    design.setId('test-id');
    design.setName('Test Name');
    design.setAttachmentCompileStatus(5);
    design.setLicenseRequirements(['lic1', 'lic2']);

    assert.strictEqual(design.getId(), 'test-id', 'DesignId should match');
    assert.strictEqual(design.getName(), 'Test Name', 'DesignName should match');
    assert.strictEqual(design.getAttachmentCompileStatus(), 5, 'Compile status should be 5');
    assert.strictEqual(design.getLicenseRequirements().length, 2, 'Should have 2 licenses');
});

test("Design - toJSON with complete data", (t) => {
    const design = new Design();

    design.setId('design-456');
    design.setName('Complete Design');
    design.setLicenseRequirements(['license1']);
    design.setAttachmentCompileStatus(1);

    const json = design.toJSON();

    assert.strictEqual(json.designId, 'design-456', 'designId should be in JSON');
    assert.strictEqual(json.designName, 'Complete Design', 'designName should be in JSON');
    assert.strictEqual(json.licenseRequirements.length, 1, 'licenses should be in JSON');
    assert.strictEqual(json.attachmentCompileStatus, 1, 'compile status should be in JSON');
    assert.ok(Array.isArray(json.mutators), 'mutators should be array');
    assert.ok(Array.isArray(json.tags), 'tags should be array');
});
