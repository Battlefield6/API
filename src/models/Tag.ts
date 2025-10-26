/**
 * @author      Adrian Preuß
 * @since     1.0.0
 */

export default class Tag {
    private id: string = '';
    private name: string = '';
    private category: string = '';

    public getId(): string {
        return this.id;
    }

    public setId(id: string): void {
        this.id = id;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getCategory(): string {
        return this.category;
    }

    public setCategory(category: string): void {
        this.category = category;
    }

    public fromJSON(json: any): Tag {
        if(json.id) {
            this.id = json.id;
        }

        if(json.name) {
            this.name = json.name;
        }

        if(json.category) {
            this.category = json.category;
        }

        if(json.metadata) {
            if(json.metadata.translations) {
                //console.log(json.metadata.translations);
            }

            if(json.metadata.resources) {
                //console.log(json.metadata.resources);
            }
        }

        return this;
    }

    public toJSON(): any {
        const result: any = {
            id: this.id,
            name: this.name,
            category: this.category
        };

        // TODO: metadata handling

        return result;
    }
}