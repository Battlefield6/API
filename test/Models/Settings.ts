/**
 * @author      Adrian Preuß
 * @version     1.0.0
 */

/* Unit Tests */
import assert from "node:assert";
import test from'node:test';

/* Core */
import { Settings } from '../../src';

console.log('++++++++++++++++++++++++++++++++++++++++ Settings Model ++++++++++++++++++++++++++++++++++++++++');

/* Starting Tests */
test("Settings - fromJSON/toJSON", (t) => {
    const settings = new Settings();
    const mockData = {
        secret: { value: 'mySecret123' },
        messages: [
            { message: 'Welcome!' },
            { message: 'Have fun!' }
        ],
        allowCopies: true
    };

    settings.fromJSON(mockData);

    assert.strictEqual(settings.getSecret(), 'mySecret123', 'Secret should be extracted from value wrapper');
    assert.strictEqual(settings.getAllowCopies(), true, 'AllowCopies should be true');
    assert.strictEqual(settings.getMessages().length, 2, 'Should have 2 messages');

    const json = settings.toJSON();
    assert.strictEqual(json.secret.value, 'mySecret123', 'toJSON should wrap secret in value object');
    assert.strictEqual(json.allowCopies, true, 'allowCopies should be preserved');
    assert.strictEqual(json.messages.length, 2, 'messages should be preserved');
});

test("Settings - Getter/Setter", (t) => {
    const settings = new Settings();

    settings.setSecret('testSecret');
    settings.setAllowCopies(true);
    settings.setMessages([{ msg: 'Test' }]);

    assert.strictEqual(settings.getSecret(), 'testSecret', 'Secret should match');
    assert.strictEqual(settings.getAllowCopies(), true, 'AllowCopies should be true');
    assert.strictEqual(settings.getMessages().length, 1, 'Should have 1 message');
});

test("Settings - Default values", (t) => {
    const settings = new Settings();

    assert.strictEqual(settings.getSecret(), null, 'Secret should be null by default');
    assert.strictEqual(settings.getAllowCopies(), false, 'AllowCopies should be false by default');
    assert.strictEqual(settings.getMessages().length, 0, 'Messages should be empty array by default');
});

test("Settings - toJSON without secret", (t) => {
    const settings = new Settings();
    settings.setAllowCopies(true);

    const json = settings.toJSON();

    assert.strictEqual(json.secret, undefined, 'Secret should not be in JSON when null');
    assert.strictEqual(json.allowCopies, true, 'allowCopies should be true');
});
