/**
 * @author      Adrian Preuß
 * @version     1.0.0
 */

import Team from './Team';

export default class TeamComposition {
    public teams: Team[] = [];

    public getTeams(): Team[] {
        return this.teams;
    }

    public setTeams(teams: Team[]): void {
        this.teams = teams;
    }

    public isEmpty(): boolean {
        return (this.teams.length === 0);
    }

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

    public toJSON(): any {
        return {
            teams:              this.teams.map(team => team.toJSON()),
            internalTeams:      [],
            balancingMethod:    0
        };
    }
}