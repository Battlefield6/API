/**
 * @author      Adrian Preuß
 * @version     1.0.0
 */

import Option from './Option';
import Tag from './Tag';

export default class Blueprint {
    public id: string = '';
    public version: string = '';
    public name: string = '';
    public thumbnails: string[] = [];
    public tags: Tag[] = [];
    public settings: Option[] = [];

    constructor() {}

    public getId(): string {
        return this.id;
    }

    public setId(id: string): void {
        this.id = id;
    }

    public getVersion(): string {
        return this.version;
    }

    public setVersion(commit: string): void {
        this.version = commit;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getThumbnails(): string[] {
        return this.thumbnails;
    }

    public setThumbnails(thumbnails: string[]): void {
        this.thumbnails = thumbnails;
    }

    public getThumbnail(index: number): string {
        return this.thumbnails[index];
    }

    public addThumbnail(url: string): void {
       this.thumbnails.push(url);
    }

    public removeThumbnail(index: number): void {
        this.thumbnails.splice(index, 1);
    }

    public fromJSON(print: any): Blueprint {
        if(print.id) {
            this.id = print.id.id;
            this.version = print.id.version;
        }

        if(print.name) {
            this.name = print.name;
        }

        if(print.availableThumbnailUrls) {
            this.thumbnails = print.availableThumbnailUrls;
        }

        if(print.availableGameData) {
            if(print.availableGameData.mutators) {
                print.availableGameData.mutators.map((mutator: any) => {
                    this.settings.push(new Option().fromJSON(mutator));
                });
            }

            if(print.availableGameData.AvailableMapEntry) {
                print.availableGameData.AvailableMapEntry.map((value: any) => {
                    //console.log('AvailableMapEntry', value);
                });
            }

            /*
            * modRules: { rulesVersion: 121215716, modBuilder: [Uint8Array] },
    assetCategories: { rootTags: [Array], tags: [Array] },
    spatialAssetInfo: undefined
            * */
        }

        if(print.availableTags) {
            print.availableTags.tags.map((tag: any) => {
                this.tags.push(new Tag().fromJSON(tag));
            });
        }

        return this;
    }

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