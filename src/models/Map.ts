/**
 * @author      Adrian Preuß
 * @since       1.0.0
 */

import TeamComposition from './TeamComposition';

export default class Map {
    private name: string                        = '';
    private location: string                    = '';
    private rounds: number                      = 0;
    private allowedSpectators: number           = 0;
    private teamComposition: TeamComposition    = new TeamComposition();
    private blazeGameSettings: any              = null;
    private mutators: any[]                     = [];
    private gameServerJoinabilitySettings: any  = null;

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getLocation(): string {
        return this.location;
    }

    public setLocation(location: string): void {
        this.location = location;
    }

    public getRounds(): number {
        return this.rounds;
    }

    public setRounds(rounds: number): void {
        this.rounds = rounds;
    }

    public getAllowedSpectators(): number {
        return this.allowedSpectators;
    }

    public setAllowedSpectators(allowedSpectators: number): void {
        this.allowedSpectators = allowedSpectators;
    }

    public getTeamComposition(): TeamComposition {
        return this.teamComposition;
    }

    public setTeamComposition(teamComposition: TeamComposition): void {
        this.teamComposition = teamComposition;
    }

    public getBlazeGameSettings(): any {
        return this.blazeGameSettings;
    }

    public setBlazeGameSettings(blazeGameSettings: any): void {
        this.blazeGameSettings = blazeGameSettings;
    }

    public getMutators(): any[] {
        return this.mutators;
    }

    public setMutators(mutators: any[]): void {
        this.mutators = mutators;
    }

    public getGameServerJoinabilitySettings(): any {
        return this.gameServerJoinabilitySettings;
    }

    public setGameServerJoinabilitySettings(settings: any): void {
        this.gameServerJoinabilitySettings = settings;
    }

    public fromJSON(map: any): Map {
        this.name = map.levelName || '';
        this.location = map.levelLocation || '';
        this.rounds = map.rounds || 0;
        this.allowedSpectators = map.allowedSpectators || 0;

        if(map.teamComposition) {
            this.teamComposition.fromJSON(map.teamComposition);
        }

        this.blazeGameSettings = map.blazeGameSettings || null;
        this.mutators = map.mutators || [];
        this.gameServerJoinabilitySettings = map.gameServerJoinabilitySettings || null;

        return this;
    }

    public toJSON(): any {
        return {
            levelName: this.name,
            levelLocation: this.location,
            rounds: this.rounds,
            allowedSpectators: this.allowedSpectators,
            teamComposition: this.teamComposition.toJSON(),
            blazeGameSettings: this.blazeGameSettings,
            mutators: this.mutators,
            gameServerJoinabilitySettings: this.gameServerJoinabilitySettings
        };
    }
}