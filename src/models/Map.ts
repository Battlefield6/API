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

    /**
     * Gets the name of the map.
     * 
     * @returns The name of the map.
     */
    public getName(): string {
        return this.name;
    }

    /**
     * Sets the name of the map.
     * 
     * @param name The name of the map.
     */
    public setName(name: string): void {
        this.name = name;
    }

    /**
     * Gets the location of the map.
     * 
     * @returns The location of the map.
     */
    public getLocation(): string {
        return this.location;
    }

    /**
     * Sets the location of the map.
     * 
     * @param location The location of the map.
     */
    public setLocation(location: string): void {
        this.location = location;
    }

    /**
     * Gets the number of rounds.
     * 
     * @returns The number of rounds.
     */
    public getRounds(): number {
        return this.rounds;
    }

    /**
     * Sets the number of rounds.
     * 
     * @param rounds The number of rounds.
     */
    public setRounds(rounds: number): void {
        this.rounds = rounds;
    }

    /**
     * Gets the allowed spectators.
     * 
     * @returns The allowed spectators.
     */
    public getAllowedSpectators(): number {
        return this.allowedSpectators;
    }

    /**
     * Sets the allowed spectators.
     * 
     * @param allowedSpectators The allowed spectators.
     */
    public setAllowedSpectators(allowedSpectators: number): void {
        this.allowedSpectators = allowedSpectators;
    }

    /**
     * Gets the team composition.
     * 
     * @returns The team composition.
     */
    public getTeamComposition(): TeamComposition {
        return this.teamComposition;
    }

    /**
     * Sets the team composition.
     * 
     * @param teamComposition The team composition.
     */
    public setTeamComposition(teamComposition: TeamComposition): void {
        this.teamComposition = teamComposition;
    }

    /**
     * Gets the blaze game settings.
     * 
     * @returns The blaze game settings.
     */
    public getBlazeGameSettings(): any {
        return this.blazeGameSettings;
    }

    /**
     * Sets the blaze game settings.
     * 
     * @param blazeGameSettings The blaze game settings.
     */
    public setBlazeGameSettings(blazeGameSettings: any): void {
        this.blazeGameSettings = blazeGameSettings;
    }

    /**
     * Gets the mutators.
     * 
     * @returns The mutators.
     */
    public getMutators(): any[] {
        return this.mutators;
    }

    /**
     * Sets the mutators.
     * 
     * @param mutators The mutators.
     */
    public setMutators(mutators: any[]): void {
        this.mutators = mutators;
    }

    /**
     * Gets the game server joinability settings.
     * 
     * @returns The game server joinability settings.
     */
    public getGameServerJoinabilitySettings(): any {
        return this.gameServerJoinabilitySettings;
    }

    /**
     * Sets the game server joinability settings.
     * 
     * @param settings The game server joinability settings.
     */
    public setGameServerJoinabilitySettings(settings: any): void {
        this.gameServerJoinabilitySettings = settings;
    }

    /**
     * Populates the map from a JSON object.
     * 
     * @param map The JSON object.
     * @returns The populated map.
     */
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

    /**
     * Converts the map to a JSON object.
     * 
     * @returns The JSON object.
     */
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