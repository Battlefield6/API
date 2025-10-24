/**
 * @author      Adrian Preuß
 * @version     1.0.0
 */

import { PublishState } from '../Connector';
import MapRotation from './MapRotation';

export default class PlayElement {
    public id: string                   = '';
    public designId: string             = '';
    public name: string                 = '';
    public description: string          = '';
    public created?: Date | null        = null;
    public updated?: Date | null        = null;
    public publishState: PublishState   = PublishState.DRAFT;
    public thumbnailUrl: string | null  = null;
    public maps: MapRotation            = new MapRotation();

    public getId(): string {
        return this.id;
    }

    public setId(id: string): void {
        this.id = id;
    }

    public getDesignId(): string {
        return this.designId;
    }

    public setDesignId(designId: string): void {
        this.designId = designId;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getDescription(): string {
        return this.description;
    }

    public setDescription(description: string): void {
        this.description = description;
    }

    public getCreated(): Date | null {
        return this.created ?? null;
    }

    public setCreated(created: Date): void {
        this.created = created;
    }

    public getUpdated(): Date | null {
        return this.updated ?? null;
    }

    public setUpdated(updated: Date): void {
        this.updated = updated;
    }

    public getPublishState(): PublishState {
        return this.publishState;
    }

    public setPublishState(publishState: PublishState): void {
        this.publishState = publishState;
    }

    public getThumbnailUrl(): string | null {
        return this.thumbnailUrl;
    }

    public setThumbnailUrl(thumbnailUrl: string): void {
        this.thumbnailUrl = thumbnailUrl;
    }

    public fromJSON(data: any): PlayElement {
        let element = data.playElement;
        let design  = data.playElementDesign;

        if(!element) {
            element = data;
        }

        if(element) {
            if(element.id) {
                this.id = element.id;
            }

            if(element.designId) {
                this.designId = element.designId;
            }

            if(element.name) {
                this.name = element.name;
            }

            if(element.description) {
                this.description = element.description.value;
            }

            if(element.created) {
                this.created = new Date(element.created);
            }

            if(element.updated) {
                this.updated = new Date(element.updated);
            }

            if(element.publishStateType) {
                this.publishState = element.publishStateType;
            } else if(element.publishState) {
                this.publishState = element.publishState;
            }

            if(element.thumbnailUrl && element.thumbnailUrl.value) {
                this.thumbnailUrl = element.thumbnailUrl.value;
            }
        }

        if(design) {
            if(design.mapRotation) {
                this.maps.fromJSON(design.mapRotation);
            }
        }

        /*
        playElementDesign: {
    designId: '258c5b30-ab89-11f0-9de5-324ffafd7bd2',
    designName: 'Remix for Coupe(Example 1760726596235)',
    created: 2025-10-17T18:43:17.000Z,
    designMetadata: { progressionMode: [Object], firstPartyMetadata: undefined },
    mapRotation: { maps: [Array], attributes: [Object] },
    mutators: [],
    assetCategories: [],
    licenseRequirements: [],
    modRules: undefined,
    tags: [ [Object] ],
    blazeSettings: undefined,
    modLevelDataId: undefined,
    attachments: [],
    groupLicenses: [],
    attachmentCompileStatus: 3,
    serverHostLicenseRequirements: []
  },
        {
            creator: {
                internalCreator: undefined,
                playerCreator: [Object],
                externalCreator: undefined,
                trustedCreator: undefined
            },
            playElementSettings: { secret: undefined, messages: [], allowCopies: false },
            likes: { value: 0 },
            publishAt: undefined,
            moderationState: 0,
            shortCode: undefined
        },
        */

        return this;
    }

    public toJSON(): any {
        var object: any = {};

        object.id = this.id;
        object.publishState = this.publishState;

        if(this.designId) {
            object.designId = this.designId;
        }

        if(this.name) {
            object.name = this.name;
        }

        if(this.description) {
            object.description = { value: this.description };
        }

        if(this.created) {
            object.created = { value: this.created };
        }

        if(this.updated) {
            object.updated = { value: this.updated };
        }

        if(this.thumbnailUrl) {
            object.thumbnailUrl = { value: this.thumbnailUrl };
        }

        if(this.maps) {
            if(!this.maps.isEmpty()) {
                object.mapRotation = this.maps.toJSON();
            }
        }

        return object;
    }
}