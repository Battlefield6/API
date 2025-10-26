/**
 * @author      Adrian Preuß
 * @version     1.0.0
 */

/* Unit Tests */
import assert from "node:assert";
import test from'node:test';

/* Core */
import { Map, TeamComposition, Team } from '../../src';

console.log('++++++++++++++++++++++++++++++++++++++++ Map Model ++++++++++++++++++++++++++++++++++++++++');

/* Starting Tests */
test("Map - Getter/Setter", (t) => {
    const map = new Map();

    map.setName('TestMap');
    map.setLocation('TestLocation');
    map.setRounds(5);
    map.setAllowedSpectators(8);

    assert.strictEqual(map.getName(), 'TestMap', 'Map name should match');
    assert.strictEqual(map.getLocation(), 'TestLocation', 'Map location should match');
    assert.strictEqual(map.getRounds(), 5, 'Rounds should be 5');
    assert.strictEqual(map.getAllowedSpectators(), 8, 'Allowed spectators should be 8');
});

test("Map - fromJSON/toJSON", (t) => {
    const map = new Map();
    const mockData = {
        levelName: 'Conquest',
        levelLocation: 'MP_001',
        rounds: 3,
        allowedSpectators: 4,
        teamComposition: {
            teams: [
                { teamId: 0, capacity: 32 },
                { teamId: 1, capacity: 32 }
            ]
        },
        blazeGameSettings: { setting1: 'value1' },
        mutators: [{ id: 'mut1' }],
        gameServerJoinabilitySettings: { maxPlayers: 64 }
    };

    map.fromJSON(mockData);

    assert.strictEqual(map.getName(), 'Conquest', 'Map name should match');
    assert.strictEqual(map.getLocation(), 'MP_001', 'Map location should match');
    assert.strictEqual(map.getRounds(), 3, 'Rounds should be 3');
    assert.strictEqual(map.getAllowedSpectators(), 4, 'Allowed spectators should be 4');
    assert.strictEqual(map.getTeamComposition().getTeams().length, 2, 'Should have 2 teams');

    const json = map.toJSON();
    assert.strictEqual(json.levelName, 'Conquest', 'toJSON should preserve levelName');
    assert.strictEqual(json.levelLocation, 'MP_001', 'toJSON should preserve levelLocation');
    assert.strictEqual(json.rounds, 3, 'toJSON should preserve rounds');
    assert.strictEqual(json.allowedSpectators, 4, 'toJSON should preserve allowedSpectators');
});

test("Map - TeamComposition integration", (t) => {
    const map = new Map();
    const teamComp = new TeamComposition();
    const team1 = new Team(0, 32);
    const team2 = new Team(1, 32);

    teamComp.setTeams([team1, team2]);
    map.setTeamComposition(teamComp);

    assert.strictEqual(map.getTeamComposition().getTeams().length, 2, 'Should have 2 teams');
    assert.strictEqual(map.getTeamComposition().getTeams()[0].getId(), 0, 'First team ID should be 0');
    assert.strictEqual(map.getTeamComposition().getTeams()[1].getCapacity(), 32, 'Second team capacity should be 32');
});

test("Map - BlazeGameSettings and Mutators", (t) => {
    const map = new Map();

    map.setBlazeGameSettings({ mode: 'conquest' });
    map.setMutators([{ id: 'mut1' }, { id: 'mut2' }]);
    map.setGameServerJoinabilitySettings({ public: true });

    assert.deepStrictEqual(map.getBlazeGameSettings(), { mode: 'conquest' }, 'BlazeGameSettings should match');
    assert.strictEqual(map.getMutators().length, 2, 'Should have 2 mutators');
    assert.deepStrictEqual(map.getGameServerJoinabilitySettings(), { public: true }, 'JoinabilitySettings should match');
});

test("Map - Default values", (t) => {
    const map = new Map();

    assert.strictEqual(map.getName(), '', 'Name should be empty string by default');
    assert.strictEqual(map.getLocation(), '', 'Location should be empty string by default');
    assert.strictEqual(map.getRounds(), 0, 'Rounds should be 0 by default');
    assert.strictEqual(map.getAllowedSpectators(), 0, 'Allowed spectators should be 0 by default');
    assert.strictEqual(map.getBlazeGameSettings(), null, 'BlazeGameSettings should be null by default');
    assert.strictEqual(map.getMutators().length, 0, 'Mutators should be empty array by default');
});
