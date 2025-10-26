/**
 * @author      Adrian Preuß
 * @version     1.0.0
 */

/* Unit Tests */
import assert from "node:assert";
import test from'node:test';

/* Core */
import { Team } from '../../src';

console.log('++++++++++++++++++++++++++++++++++++++++ Team Model ++++++++++++++++++++++++++++++++++++++++');

/* Starting Tests */
test("Team - Constructor with parameters", (t) => {
    const team = new Team(1, 32);

    assert.strictEqual(team.getId(), 1, 'Team ID should be 1');
    assert.strictEqual(team.getCapacity(), 32, 'Team capacity should be 32');
});

test("Team - Constructor without parameters", (t) => {
    const team = new Team();

    assert.strictEqual(team.getId(), 0, 'Team ID should default to 0');
    assert.strictEqual(team.getCapacity(), 0, 'Team capacity should default to 0');
});

test("Team - Getter/Setter", (t) => {
    const team = new Team();

    team.setId(2);
    team.setCapacity(64);

    assert.strictEqual(team.getId(), 2, 'Team ID should be 2');
    assert.strictEqual(team.getCapacity(), 64, 'Team capacity should be 64');
});

test("Team - fromJSON/toJSON", (t) => {
    const team = new Team();
    const mockData = {
        teamId: 3,
        capacity: 16
    };

    team.fromJSON(mockData);

    assert.strictEqual(team.getId(), 3, 'Team ID should be 3');
    assert.strictEqual(team.getCapacity(), 16, 'Team capacity should be 16');

    const json = team.toJSON();
    assert.strictEqual(json.teamId, 3, 'toJSON should preserve teamId');
    assert.strictEqual(json.capacity, 16, 'toJSON should preserve capacity');
});

test("Team - fromJSON with missing values", (t) => {
    const team = new Team();
    const mockData = {};

    team.fromJSON(mockData);

    assert.strictEqual(team.getId(), 0, 'Team ID should default to 0');
    assert.strictEqual(team.getCapacity(), 0, 'Team capacity should default to 0');
});
