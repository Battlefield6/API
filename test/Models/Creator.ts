/**
 * @author      Adrian Preuß
 * @version     1.0.0
 */

/* Unit Tests */
import assert from "node:assert";
import test from'node:test';

/* Core */
import { Creator, CreatorType } from '../../src';

console.log('++++++++++++++++++++++++++++++++++++++++ Creator Model ++++++++++++++++++++++++++++++++++++++++');

/* Starting Tests */
test("Creator - fromJSON/toJSON with PlayerCreator", (t) => {
    const creator = new Creator();
    const mockData = {
        playerCreator: {
            player: {
                personaId: '123456',
                displayName: 'TestPlayer'
            }
        }
    };

    creator.fromJSON(mockData);

    assert.strictEqual(creator.getType(), CreatorType.PLAYER, 'Creator type should be PLAYER');
    assert.strictEqual(creator.isPlayer(), true, 'isPlayer() should return true');
    assert.strictEqual(creator.isInternal(), false, 'isInternal() should return false');
    assert.deepStrictEqual(creator.getData(), mockData.playerCreator, 'Creator data should match');

    const json = creator.toJSON();
    assert.deepStrictEqual(json.playerCreator, mockData.playerCreator, 'toJSON should restore original structure');
});

test("Creator - fromJSON/toJSON with InternalCreator", (t) => {
    const creator = new Creator();
    const mockData = {
        internalCreator: {
            internalId: 'internal-123'
        }
    };

    creator.fromJSON(mockData);

    assert.strictEqual(creator.getType(), CreatorType.INTERNAL, 'Creator type should be INTERNAL');
    assert.strictEqual(creator.isInternal(), true, 'isInternal() should return true');
    assert.strictEqual(creator.isPlayer(), false, 'isPlayer() should return false');

    const json = creator.toJSON();
    assert.deepStrictEqual(json.internalCreator, mockData.internalCreator, 'toJSON should restore original structure');
});

test("Creator - Getter/Setter", (t) => {
    const creator = new Creator();
    const testData = { test: 'data' };

    creator.setType(CreatorType.EXTERNAL);
    creator.setData(testData);

    assert.strictEqual(creator.getType(), CreatorType.EXTERNAL, 'Type should be EXTERNAL');
    assert.strictEqual(creator.isExternal(), true, 'isExternal() should return true');
    assert.deepStrictEqual(creator.getData(), testData, 'Data should match');
});

test("Creator - Empty toJSON", (t) => {
    const creator = new Creator();
    const json = creator.toJSON();

    assert.deepStrictEqual(json, {}, 'Empty creator should return empty object');
});
