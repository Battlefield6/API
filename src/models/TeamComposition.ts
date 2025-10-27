/**
 * @author      Adrian Preuß
 * @since       1.0.0
 */

import Team from './Team';

/**
 * Represents a team composition.
 */
export default class TeamComposition {
    private teams: Team[] = [];

    /**
     * Gets the teams.
     * 
     * @returns The teams.
     */
    public getTeams(): Team[] {
        return this.teams;
    }

    /**
     * Sets the teams.
     * 
     * @param teams The teams.
     */
    public setTeams(teams: Team[]): void {
        this.teams = teams;
    }

    /**
     * Checks if the team composition is empty.
     * 
     * @returns True if the team composition is empty, false otherwise.
     */
    public isEmpty(): boolean {
        return (this.teams.length === 0);
    }

    /**
     * Populates the team composition from a JSON object.
     * 
     * @param mapRotation The JSON object.
     */
    public fromJSON(mapRotation: any) {
        this.teams = [];

        // Fallback for empty team compositions
        if(!mapRotation) {
            this.teams = [
                new Team(0, 1)
            ];
            return;
        }

        if(mapRotation.teams && Array.isArray(mapRotation.teams)) {
            this.teams = mapRotation.teams.map((team: any) => {
                let newTeam = new Team();
                newTeam.fromJSON(team);
                return newTeam;
            });
        }   
    }

    /**
     * Converts the team composition to a JSON object.
     * 
     * @returns The JSON object.
     */
    public toJSON(): any {
        return {
            teams:              this.teams.map(team => team.toJSON()),
            internalTeams:      [],
            balancingMethod:    0
        };
    }
}