/**
 * @author      Adrian Preuß
 * @since       1.0.0
 */

export default class Team {
    public teamId: number   = 0;
    public capacity: number = 0;

    constructor(teamId: number = 0, capacity: number = 0) {
        this.teamId     = teamId;
        this.capacity   = capacity;
    }

    public fromJSON(team: any) {
        this.teamId     = team.teamId || 0;
        this.capacity   = team.capacity || 0;
    }

    public toJSON(): any {
        return {
            teamId:     this.teamId,
            capacity:   this.capacity
        };
    }
}