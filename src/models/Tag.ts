/**
 * @author      Adrian Preuß
 * @since     1.0.0
 */

export default class Tag {
    public id: string = '';
    public name: string = '';
    public category: string = '';

    public fromJSON(json: any) : Tag {
        if(json.id) {
            this.id = json.id;
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
}