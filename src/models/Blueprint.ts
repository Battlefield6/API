/**
 * @author      Adrian Preuß
 * @version     1.0.0
 */

import Option from './Option';
import Tag from './Tag';

/**
 * Represents the basic information (blueprints) of the entire game, the possible settings, and the predefined and configured options.
 **/
export default class Blueprint {
    private id: string              = '';
    private version: string         = '';
    private name: string            = '';
    private thumbnails: string[]    = [];
    private tags: Tag[]             = [];
    private settings: Option[]      = [];

    constructor() {}

    /**
    * Returns the ID of the blueprint.
    */
    public getId(): string {
        return this.id;
    }

    /**
    * Set the ID of the blueprint.
    *
    * @param id The ID of the blueprint.
    */
    public setId(id: string): void {
        this.id = id;
    }

    /**
    * Returns the version (`SHA-256` commit version) of the blueprint.
    */
    public getVersion(): string {
        return this.version;
    }

    /**
    * Set the version of the blueprint.
    *
    * @param commit The version (`SHA-256` commit version) of the blueprint.
    */
    public setVersion(commit: string): void {
        this.version = commit;
    }

    /**
    * Returns the name of the blueprint.
    */
    public getName(): string {
        return this.name;
    }

    /**
    * Set the name of the blueprint.
    *
    * @param name The name of the blueprint.
    */
    public setName(name: string): void {
        this.name = name;
    }

    /**
    * Returns the list of available thumbnails.
    */
    public getThumbnails(): string[] {
        return this.thumbnails;
    }

    /**
    * Sets the list of available thumbnails.
    */
    public setThumbnails(thumbnails: string[]): void {
        this.thumbnails = thumbnails;
    }

    /**
    * Get a stored thumbnail by index.
    */
    public getThumbnail(index: number): string {
        return this.thumbnails[index];
    }

    /**
    * Adds a new thumbnail to the list of available thumbnails.
    *
    * @param url The URL of the thumbnail to add.
    */
    public addThumbnail(url: string): void {
       this.thumbnails.push(url);
    }

    /**
    * Deletes an assigned thumbnail.
    *
    * @param index The index of the thumbnail to delete.
    */
    public removeThumbnail(index: number): void {
        this.thumbnails.splice(index, 1);
    }

    /**
    * Returns all tags.
    */
    public getTags(): Tag[] {
        return this.tags;
    }

    /**
    * Sets the tags.
    *
    * @param tags Array of tags
    */
    public setTags(tags: Tag[]): void {
        this.tags = tags;
    }

    /**
    * Adds a tag to the list of tags.
    *
    * @param tag The tag to add
    */
    public addTag(tag: Tag): void {
        this.tags.push(tag);
    }

    /**
    * Removes a tag from the list of tags.
    *
    * @param index The index of the tag to remove
    */
    public removeTag(index: number): void {
        this.tags.splice(index, 1);
    }

    /**
    * Returns all unique categories from all settings/options.
    *
    * @returns Array of unique category names
    */
    public getCategories(): string[] {
        const categories = new Set<string>();

        for(const option of this.settings) {
            const optionCategories = option.getCategories();
            for(const category of optionCategories) {
                if(category) {
                    categories.add(category);
                }
            }
        }

        return Array.from(categories);
    }

    /**
    * Returns all options, optionally filtered by category.
    *
    * @param category Optional category name to filter by. If not provided, returns all options.
    * @returns Array of options (all or filtered by category)
    */
    public getOptions(category?: string): Option[] {
        if(!category) {
            return this.settings;
        }

        return this.settings.filter(option =>
            option.getCategories().includes(category)
        );
    }

    /**
    * Checks if a specific category exists in any of the options.
    *
    * @param category The category name to check
    * @returns True if the category exists, false otherwise
    */
    public hasCategory(category: string): boolean {
        return this.settings.some(option =>
            option.getCategories().includes(category)
        );
    }

    /**
    * Converts the received JSON data into a Blueprint object.
    *
    * @param json The JSON data to convert.
    * @returns The converted Blueprint object.
    */
    public fromJSON(json: any): Blueprint {
        if(json.id) {
            this.id         = json.id.id;
            this.version    = json.id.version;
        }

        if(json.name) {
            this.name = json.name;
        }

        if(json.availableThumbnailUrls) {
            this.thumbnails = json.availableThumbnailUrls;
        }

        if(json.availableGameData) {
            if(json.availableGameData.mutators) {
                json.availableGameData.mutators.map((mutator: any) => {
                    this.settings.push(new Option().fromJSON(mutator));
                });
            }

            if(json.availableGameData.AvailableMapEntry) {
                json.availableGameData.AvailableMapEntry.map((value: any) => {
                    //console.log('AvailableMapEntry', value);
                });
            }

            if(json.availableGameData.modRules) {
                /*
                * modRules: { rulesVersion: 121215716, modBuilder: [Uint8Array] },
                assetCategories: { rootTags: [Array], tags: [Array] },
                spatialAssetInfo: undefined
                * */
            }
        }

        if(json.availableTags) {
            json.availableTags.tags.map((tag: any) => {
                this.tags.push(new Tag().fromJSON(tag));
            });
        }

        return this;
    }

    /**
    * Converts the blueprint object to valid JSON data.
    *
    * @returns The JSON data representing the blueprint.
    */
    public toJSON(): any {
        var object: any = {};

        object.id = {
            id:         this.id,
            version:    this.version
        };

        object.name = this.name;

        if(this.thumbnails) {
            object.availableThumbnailUrls = this.thumbnails;
        }

        return object;
    }
}