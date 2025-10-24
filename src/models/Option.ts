/**
 * @author      Adrian Preuß
 * @version     1.0.0
 */

export default class Option {
    public id: string = '';
    public name: string = '';
    public categories: string[] = [];

    public fromJSON(json: any) : Option {
        if(json.id) {
            this.id = json.id;
        }

        if(json.name) {
            this.name = json.name;
        }

        if(json.category) {
            this.categories = json.category.split(',');
        }

        if(json.kind) {
            // Kann nur 1 Value haben:
            /*
            * mutatorBoolean: undefined,
                mutatorString: undefined,
                mutatorFloatValues: undefined,
                mutatorIntValues: undefined,
                mutatorSparseBoolean: undefined,
                mutatorSparseIntValues: { mutator: 0, availableValues: 0 },
                mutatorSparseFloatValues: undefined
            * */
        }

        if(json.metadata) {
            if(json.metadata.translations) {
                json.metadata.translations.forEach((translation: any) => {
                   //console.log(translation);
                });
            }

            if(json.metadata.resources) {

            }
        }

        return this;
    }
}