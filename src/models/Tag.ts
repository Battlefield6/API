/**
 * @author      Adrian Preuß
 * @since     1.0.0
 */

export default class Tag {
    private id: string = '';
    private name: string = '';
    private category: string = '';

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
     * Gets the category.
     * 
     * @returns The category.
     */
    public getCategory(): string {
        return this.category;
    }

    /**
     * Sets the category.
     * 
     * @param category The category.
     */
    public setCategory(category: string): void {
        this.category = category;
    }

    /**
     * Populates the tag from a JSON object.
     * 
     * @param json The JSON object.
     * @returns The populated tag.
     */
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

    /**
     * Converts the tag to a JSON object.
     * 
     * @returns The JSON object.
     */
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