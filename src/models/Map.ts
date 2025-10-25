/**
 * @author      Adrian Preuß
 * @since       1.0.0
 */

import TeamComposition from './TeamComposition';

export default class Map {
    public name: string = '';
    public location: string = '';
    public rounds: number = 0;
    public allowedSpectators: number = 0;
    public teamComposition: TeamComposition = new TeamComposition();
    public blazeGameSettings: any = null;
    public mutators: any[] = [];
    public gameServerJoinabilitySettings: any = null;

    public toJSON(): any {
        return {
            levelName: this.name,
            levelLocation: this.location,
            rounds: this.rounds,
            allowedSpectators: this.allowedSpectators,
            teamComposition: this.teamComposition,
            blazeGameSettings: this.blazeGameSettings,
            mutators: this.mutators,
            gameServerJoinabilitySettings: this.gameServerJoinabilitySettings
        };
    }

    public fromJSON(map: any) {
        this.name = map.levelName || '';
        this.location = map.levelLocation || '';
        this.rounds = map.rounds || 0;
        this.allowedSpectators = map.allowedSpectators || 0;
        this.teamComposition.fromJSON(map.teamComposition);
        this.blazeGameSettings = map.blazeGameSettings || null;
        this.mutators = map.mutators || [];
        this.gameServerJoinabilitySettings = map.gameServerJoinabilitySettings || null;
    }
}