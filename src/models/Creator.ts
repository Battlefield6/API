/**
 * @author      Adrian Preuß
 * @since       1.0.0
 */

import CreatorType from '../enums/CreatorType';

export default class Creator {
    private type: CreatorType = CreatorType.UNKNOWN;
    private data: any = null;

    /**
     * Gets the type of the creator.
     * 
     * @returns The type of the creator.
     */
    public getType(): CreatorType {
        return this.type;
    }

    /**
     * Sets the type of the creator.
     * 
     * @param type The type of the creator.
     */
    public setType(type: CreatorType): void {
        this.type = type;
    }

    /**
     * Gets the data of the creator.
     * 
     * @returns The data of the creator.
     */
    public getData(): any {
        return this.data;
    }

    /**
     * Sets the data of the creator.
     * 
     * @param data The data of the creator.
     */
    public setData(data: any): void {
        this.data = data;
    }

    /**
     * Checks if the creator is a player.
     * 
     * @returns True if the creator is a player, false otherwise.
     */
    public isPlayer(): boolean {
        return this.type === CreatorType.PLAYER;
    }

    /**
     * Checks if the creator is an internal creator.
     * 
     * @returns True if the creator is an internal creator, false otherwise.
     */
    public isInternal(): boolean {
        return this.type === CreatorType.INTERNAL;
    }

    /**
     * Checks if the creator is an external creator.
     * 
     * @returns True if the creator is an external creator, false otherwise.
     */
    public isExternal(): boolean {
        return this.type === CreatorType.EXTERNAL;
    }

    /**
     * Checks if the creator is a trusted creator.
     * 
     * @returns True if the creator is a trusted creator, false otherwise.
     */
    public isTrusted(): boolean {
        return this.type === CreatorType.TRUSTED;
    }

    /**
     * Populates the creator from a JSON object.
     * 
     * @param json The JSON object.
     * @returns The populated creator.
     */
    public fromJSON(json: any): Creator {
        if(json.playerCreator) {
            this.type = CreatorType.PLAYER;
            this.data = json.playerCreator;
        } else if(json.internalCreator) {
            this.type = CreatorType.INTERNAL;
            this.data = json.internalCreator;
        } else if(json.externalCreator) {
            this.type = CreatorType.EXTERNAL;
            this.data = json.externalCreator;
        } else if(json.trustedCreator) {
            this.type = CreatorType.TRUSTED;
            this.data = json.trustedCreator;
        }

        return this;
    }

    /**
     * Converts the creator to a JSON object.
     * 
     * @returns The JSON object.
     */
    public toJSON(): any {
        const result: any = {};

        switch(this.type) {
            case CreatorType.PLAYER:
                result.playerCreator = this.data;
            break;
            case CreatorType.INTERNAL:
                result.internalCreator = this.data;
            break;
            case CreatorType.EXTERNAL:
                result.externalCreator = this.data;
            break;
            case CreatorType.TRUSTED:
                result.trustedCreator = this.data;
            break;
        }

        return result;
    }
}
