/**
 * @author      Adrian Preuß
 * @since       1.0.0
 */

import { PublishState } from '../Connector';
import MapRotation from './MapRotation';
import Creator from './Creator';
import Settings from './Settings';
import Design from './Design';

export default class PlayElement {
    private id: string                   = '';
    private designId: string             = '';
    private name: string                 = '';
    private description: string          = '';
    private created?: Date | null        = null;
    private updated?: Date | null        = null;
    private publishState: PublishState   = PublishState.DRAFT;
    private thumbnailUrl: string | null  = null;
    private creator: Creator             = new Creator();
    private settings: Settings           = new Settings();
    private design: Design               = new Design();
    private likes: number                = 0;
    private publishAt?: Date | null      = null;
    private moderationState: number      = 0;
    private shortCode: string | null     = null;

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

    public getCreator(): Creator {
        return this.creator;
    }

    public setCreator(creator: Creator): void {
        this.creator = creator;
    }

    public getSettings(): Settings {
        return this.settings;
    }

    public setSettings(settings: Settings): void {
        this.settings = settings;
    }

    public getDesign(): Design {
        return this.design;
    }

    public setDesign(design: Design): void {
        this.design = design;
    }

    public getLikes(): number {
        return this.likes;
    }

    public setLikes(likes: number): void {
        this.likes = likes;
    }

    public getPublishAt(): Date | null {
        return this.publishAt ?? null;
    }

    public setPublishAt(publishAt: Date): void {
        this.publishAt = publishAt;
    }

    public getModerationState(): number {
        return this.moderationState;
    }

    public setModerationState(moderationState: number): void {
        this.moderationState = moderationState;
    }

    public getShortCode(): string | null {
        return this.shortCode;
    }

    public setShortCode(shortCode: string | null): void {
        this.shortCode = shortCode;
    }

    public getMaps(): MapRotation {
        return this.design.getMapRotation();
    }

    public setMaps(maps: MapRotation): void {
        this.design.setMapRotation(maps);
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
                this.description = element.description.value || element.description;
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

            if(element.thumbnailUrl) {
                this.thumbnailUrl = element.thumbnailUrl.value || element.thumbnailUrl;
            }

            if(element.creator) {
                this.creator.fromJSON(element.creator);
            }

            if(element.playElementSettings) {
                this.settings.fromJSON(element.playElementSettings);
            }

            if(element.likes) {
                this.likes = element.likes.value || element.likes;
            }

            if(element.publishAt) {
                this.publishAt = new Date(element.publishAt);
            }

            if(element.moderationState !== undefined) {
                this.moderationState = element.moderationState;
            }

            if(element.shortCode) {
                this.shortCode = element.shortCode.value || element.shortCode;
            }
        }

        if(design) {
            this.design.fromJSON(design);
        }

        return this;
    }

    public toJSON(): any {
        const object: any = {
            playElement: {
                id: this.id,
                designId: this.designId,
                name: this.name,
                publishState: this.publishState,
                moderationState: this.moderationState
            },
            playElementDesign: this.design.toJSON()
        };

        if(this.description) {
            object.playElement.description = { value: this.description };
        }

        if(this.created) {
            object.playElement.created = this.created;
        }

        if(this.updated) {
            object.playElement.updated = this.updated;
        }

        if(this.thumbnailUrl) {
            object.playElement.thumbnailUrl = { value: this.thumbnailUrl };
        }

        const creatorJSON = this.creator.toJSON();
        if(Object.keys(creatorJSON).length > 0) {
            object.playElement.creator = creatorJSON;
        }

        const settingsJSON = this.settings.toJSON();
        if(settingsJSON) {
            object.playElement.playElementSettings = settingsJSON;
        }

        if(this.likes > 0) {
            object.playElement.likes = { value: this.likes };
        }

        if(this.publishAt) {
            object.playElement.publishAt = this.publishAt;
        }

        if(this.shortCode) {
            object.playElement.shortCode = { value: this.shortCode };
        }

        return object;
    }
}