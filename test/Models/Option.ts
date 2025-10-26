/**
 * @author      Adrian Preuß
 * @version     1.0.0
 */

/* Unit Tests */
import assert from "node:assert";
import test from'node:test';

/* Core */
import { Option, OptionType } from '../../src';

console.log('++++++++++++++++++++++++++++++++++++++++ Option Model ++++++++++++++++++++++++++++++++++++++++');

/* Starting Tests */
test("Option - Getter/Setter", (t) => {
    const option = new Option();

    option.setId('opt-123');
    option.setName('Health');
    option.setType(OptionType.INT);
    option.setValue(150);
    option.setDefault(100);

    assert.strictEqual(option.getId(), 'opt-123', 'ID should match');
    assert.strictEqual(option.getName(), 'Health', 'Name should match');
    assert.strictEqual(option.getType(), OptionType.INT, 'Type should be INT');
    assert.strictEqual(option.getValue(), 150, 'Value should be 150');
    assert.strictEqual(option.getDefault(), 100, 'Default should be 100');
});

test("Option - Type checks", (t) => {
    const option = new Option();

    option.setType(OptionType.BOOLEAN);
    assert.strictEqual(option.isBoolean(), true, 'isBoolean() should return true');
    assert.strictEqual(option.isString(), false, 'isString() should return false');
    assert.strictEqual(option.isFloat(), false, 'isFloat() should return false');
    assert.strictEqual(option.isInt(), false, 'isInt() should return false');

    option.setType(OptionType.STRING);
    assert.strictEqual(option.isString(), true, 'isString() should return true');
    assert.strictEqual(option.isBoolean(), false, 'isBoolean() should return false');

    option.setType(OptionType.FLOAT);
    assert.strictEqual(option.isFloat(), true, 'isFloat() should return true');

    option.setType(OptionType.INT);
    assert.strictEqual(option.isInt(), true, 'isInt() should return true');
});

test("Option - fromJSON with Boolean type", (t) => {
    const option = new Option();
    const mockData = {
        id: 'opt-bool',
        name: 'Enable Feature',
        category: 'gameplay',
        kind: {
            mutatorBoolean: {
                value: true
            }
        }
    };

    option.fromJSON(mockData);

    assert.strictEqual(option.getId(), 'opt-bool', 'ID should match');
    assert.strictEqual(option.getName(), 'Enable Feature', 'Name should match');
    assert.strictEqual(option.getType(), OptionType.BOOLEAN, 'Type should be BOOLEAN');
    assert.strictEqual(option.getValue(), true, 'Value should be true');
    assert.strictEqual(option.getCategories().length, 1, 'Should have 1 category');
    assert.strictEqual(option.getCategories()[0], 'gameplay', 'Category should be gameplay');
});

test("Option - fromJSON with Int type", (t) => {
    const option = new Option();
    const mockData = {
        id: 'opt-int',
        name: 'Max Players',
        category: 'server,gameplay',
        kind: {
            mutatorIntValues: {
                value: 64
            }
        }
    };

    option.fromJSON(mockData);

    assert.strictEqual(option.getType(), OptionType.INT, 'Type should be INT');
    assert.strictEqual(option.getValue(), 64, 'Value should be 64');
    assert.strictEqual(option.getCategories().length, 2, 'Should have 2 categories');
});

test("Option - fromJSON with Sparse Boolean", (t) => {
    const option = new Option();
    const mockData = {
        id: 'opt-sparse',
        name: 'Sparse Option',
        category: 'test',
        kind: {
            mutatorBoolean: {
                value: true
            },
            mutatorSparseBoolean: {
                defaultValue: false
            }
        }
    };

    option.fromJSON(mockData);

    assert.strictEqual(option.getValue(), true, 'Value should be true');
    assert.strictEqual(option.getDefault(), false, 'Default should be false');
});

test("Option - toJSON with normal Int", (t) => {
    const option = new Option();

    option.setId('opt-1');
    option.setName('Test');
    option.setType(OptionType.INT);
    option.setValue(100);

    const json = option.toJSON();

    assert.strictEqual(json.id, 'opt-1', 'ID should be in JSON');
    assert.strictEqual(json.name, 'Test', 'Name should be in JSON');
    assert.ok(json.kind.mutatorIntValues, 'Should have mutatorIntValues');
    assert.strictEqual(json.kind.mutatorIntValues.value, 100, 'Value should be 100');
    assert.strictEqual(json.kind.mutatorSparseIntValues, undefined, 'Should not have sparse variant');
});

test("Option - toJSON with Sparse Float", (t) => {
    const option = new Option();

    option.setId('opt-2');
    option.setName('Speed');
    option.setType(OptionType.FLOAT);
    option.setValue(1.5);
    option.setDefault(1.0);

    const json = option.toJSON();

    assert.strictEqual(json.kind.mutatorFloatValues.value, 1.5, 'Normal value should be 1.5');
    assert.strictEqual(json.kind.mutatorSparseFloatValues.defaultValue, 1.0, 'Sparse default should be 1.0');
});

test("Option - toJSON with String", (t) => {
    const option = new Option();

    option.setId('opt-3');
    option.setName('Server Name');
    option.setType(OptionType.STRING);
    option.setValue('My Server');

    const json = option.toJSON();

    assert.ok(json.kind.mutatorString, 'Should have mutatorString');
    assert.strictEqual(json.kind.mutatorString.value, 'My Server', 'Value should match');
});

test("Option - Categories handling", (t) => {
    const option = new Option();
    const mockData = {
        id: 'opt-cat',
        name: 'Test',
        category: 'cat1,cat2,cat3',
        kind: {
            mutatorBoolean: { value: true }
        }
    };

    option.fromJSON(mockData);

    assert.strictEqual(option.getCategories().length, 3, 'Should have 3 categories');
    assert.deepStrictEqual(option.getCategories(), ['cat1', 'cat2', 'cat3'], 'Categories should match');

    const json = option.toJSON();
    assert.strictEqual(json.category, 'cat1,cat2,cat3', 'Category string should be rejoined');
});
