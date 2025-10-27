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

    /**
     * Gets the ID.
     * 
     * @returns The ID.
     */
    public getId(): string {
        return this.id;
    }

    /**
     * Sets the ID.
     * 
     * @param id The ID.
     */
    public setId(id: string): void {
        this.id = id;
    }

    /**
     * Gets the design ID.
     * 
     * @returns The design ID.
     */
    public getDesignId(): string {
        return this.designId;
    }

    /**
     * Sets the design ID.
     * 
     * @param designId The design ID.
     */
    public setDesignId(designId: string): void {
        this.designId = designId;
    }

    /**
     * Gets the name.
     * 
     * @returns The name.
     */
    public getName(): string {
        return this.name;
    }

    /**
     * Sets the name.
     * 
     * @param name The name.
     */
    public setName(name: string): void {
        this.name = name;
    }

    /**
     * Gets the description.
     * 
     * @returns The description.
     */
    public getDescription(): string {
        return this.description;
    }

    /**
     * Sets the description.
     * 
     * @param description The description.
     */
    public setDescription(description: string): void {
        this.description = description;
    }

    /**
     * Gets the creation date.
     * 
     * @returns The creation date.
     */
    public getCreated(): Date | null {
        return this.created ?? null;
    }

    /**
     * Sets the creation date.
     * 
     * @param created The creation date.
     */
    public setCreated(created: Date): void {
        this.created = created;
    }

    /**
     * Gets the update date.
     * 
     * @returns The update date.
     */
    public getUpdated(): Date | null {
        return this.updated ?? null;
    }

    /**
     * Sets the update date.
     * 
     * @param updated The update date.
     */
    public setUpdated(updated: Date): void {
        this.updated = updated;
    }

    /**
     * Gets the publish state.
     * 
     * @returns The publish state.
     */
    public getPublishState(): PublishState {
        return this.publishState;
    }

    /**
     * Sets the publish state.
     * 
     * @param publishState The publish state.
     */
    public setPublishState(publishState: PublishState): void {
        this.publishState = publishState;
    }

    /**
     * Gets the thumbnail URL.
     * 
     * @returns The thumbnail URL.
     */
    public getThumbnailUrl(): string | null {
        return this.thumbnailUrl;
    }

    /**
     * Sets the thumbnail URL.
     * 
     * @param thumbnailUrl The thumbnail URL.
     */
    public setThumbnailUrl(thumbnailUrl: string): void {
        this.thumbnailUrl = thumbnailUrl;
    }

    /**
     * Gets the creator.
     * 
     * @returns The creator.
     */
    public getCreator(): Creator {
        return this.creator;
    }

    /**
     * Sets the creator.
     * 
     * @param creator The creator.
     */
    public setCreator(creator: Creator): void {
        this.creator = creator;
    }

    /**
     * Gets the settings.
     * 
     * @returns The settings.
     */
    public getSettings(): Settings {
        return this.settings;
    }

    /**
     * Sets the settings.
     * 
     * @param settings The settings.
     */
    public setSettings(settings: Settings): void {
        this.settings = settings;
    }

    /**
     * Gets the design.
     * 
     * @returns The design.
     */
    public getDesign(): Design {
        return this.design;
    }

    /**
     * Sets the design.
     * 
     * @param design The design.
     */
    public setDesign(design: Design): void {
        this.design = design;
    }

    /**
     * Gets the likes.
     * 
     * @returns The likes.
     */
    public getLikes(): number {
        return this.likes;
    }

    /**
     * Sets the likes.
     * 
     * @param likes The likes.
     */
    public setLikes(likes: number): void {
        this.likes = likes;
    }

    /**
     * Gets the publish date.
     * 
     * @returns The publish date.
     */
    public getPublishAt(): Date | null {
        return this.publishAt ?? null;
    }

    /**
     * Sets the publish date.
     * 
     * @param publishAt The publish date.
     */
    public setPublishAt(publishAt: Date): void {
        this.publishAt = publishAt;
    }

    /**
     * Gets the moderation state.
     * 
     * @returns The moderation state.
     */
    public getModerationState(): number {
        return this.moderationState;
    }

    /**
     * Sets the moderation state.
     * 
     * @param moderationState The moderation state.
     */
    public setModerationState(moderationState: number): void {
        this.moderationState = moderationState;
    }

    /**
     * Gets the short code.
     * 
     * @returns The short code.
     */
    public getShortCode(): string | null {
        return this.shortCode;
    }

    /**
     * Sets the short code.
     * 
     * @param shortCode The short code.
     */
    public setShortCode(shortCode: string | null): void {
        this.shortCode = shortCode;
    }

    /**
     * Gets the map rotation.
     * 
     * @returns The map rotation.
     */
    public getMaps(): MapRotation {
        return this.design.getMapRotation();
    }

    /**
     * Sets the map rotation.
     * 
     * @param maps The map rotation.
     */
    public setMaps(maps: MapRotation): void {
        this.design.setMapRotation(maps);
    }

    /**
     * Populates the play element from a JSON object.
     * 
     * @param data The JSON object.
     * @returns The populated play element.
     */
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

    /**
     * Converts the play element to a JSON object.
     * 
     * @returns The JSON object.
     */
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