/**
 * @author      Adrian Preuß
 * @since       1.0.0
 */

export default class Team {
    private teamId: number   = 0;
    private capacity: number = 0;

    constructor(teamId: number = 0, capacity: number = 0) {
        this.teamId     = teamId;
        this.capacity   = capacity;
    }

    public getId(): number {
        return this.teamId;
    }

    public setId(teamId: number): void {
        this.teamId = teamId;
    }

    public getCapacity(): number {
        return this.capacity;
    }

    public setCapacity(capacity: number): void {
        this.capacity = capacity;
    }

    public fromJSON(team: any): Team {
        this.teamId     = team.teamId || 0;
        this.capacity   = team.capacity || 0;
        return this;
    }

    public toJSON(): any {
        return {
            teamId:     this.teamId,
            capacity:   this.capacity
        };
    }
}