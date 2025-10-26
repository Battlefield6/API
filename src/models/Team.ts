/**
 * @author      Adrian Preuß
 * @since       1.0.0
 */

export default class Team {
    private teamId: number   = 0;
    private capacity: number = 0;

    /**
     * Creates a new Team instance.
     * 
     * @param teamId The team ID.
     * @param capacity The team capacity.
     */
    constructor(teamId: number = 0, capacity: number = 0) {
        this.teamId     = teamId;
        this.capacity   = capacity;
    }

    /**
     * Gets the team ID.
     * 
     * @returns The team ID.
     */
    public getId(): number {
        return this.teamId;
    }

    /**
     * Sets the team ID.
     * 
     * @param teamId The team ID.
     */
    public setId(teamId: number): void {
        this.teamId = teamId;
    }

    /**
     * Gets the team capacity.
     * 
     * @returns The team capacity.
     */
    public getCapacity(): number {
        return this.capacity;
    }

    /**
     * Sets the team capacity.
     * 
     * @param capacity The team capacity.
     */
    public setCapacity(capacity: number): void {
        this.capacity = capacity;
    }

    /**
     * Populates the team from a JSON object.
     * 
     * @param team The JSON object.
     * @returns The populated team.
     */
    public fromJSON(team: any): Team {
        this.teamId     = team.teamId || 0;
        this.capacity   = team.capacity || 0;
        return this;
    }

    /**
     * Converts the team to a JSON object.
     * 
     * @returns The JSON object.
     */
    public toJSON(): any {
        return {
            teamId:     this.teamId,
            capacity:   this.capacity
        };
    }
}