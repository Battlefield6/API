/**
 * @author      Adrian Preuß
 * @since       1.0.0
 */

import CreatorType from '../enums/CreatorType';

export default class Creator {
    private type: CreatorType = CreatorType.UNKNOWN;
    private data: any = null;

    public getType(): CreatorType {
        return this.type;
    }

    public setType(type: CreatorType): void {
        this.type = type;
    }

    public getData(): any {
        return this.data;
    }

    public setData(data: any): void {
        this.data = data;
    }

    public isPlayer(): boolean {
        return this.type === CreatorType.PLAYER;
    }

    public isInternal(): boolean {
        return this.type === CreatorType.INTERNAL;
    }

    public isExternal(): boolean {
        return this.type === CreatorType.EXTERNAL;
    }

    public isTrusted(): boolean {
        return this.type === CreatorType.TRUSTED;
    }

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
