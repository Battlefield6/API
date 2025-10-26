/**
 * @author      Adrian Preuß
 * @since       1.0.0
 */

import OptionType from '../enums/OptionType';

/**
 * Represents an settings elemet.
 */
export default class Option {
    private id: string              = '';
    private name: string            = '';
    private value              = null;
    private default           = null;
    private type: OptionType        = OptionType.UNKNOWN;
    private categories: string[]    = [];

    /**
     * Returns the ID of the option.
     */
    public getId() {
        return this.id;
    }

    /**
     * Set the ID of the option.
     *
     * @param id The ID of the option.
     */
    public setId(id: string) {
        this.id = id;
    }

    /**
     * Returns the name of the option.
     */
    public getName() {
        return this.name;
    }

    /**
     * Set the name of the option.
     */
    public setName(name: string) {
        this.name = name;
    }

    /**
     * Returns the type of the option.
     */
    public getType(): OptionType {
        return this.type;
    }

    /**
     * Set the type of the option.
     */
    public setType(type: OptionType) {
        this.type = type;
    }

    /**
     * Returns the value of the option.
     */
    public getValue() {
        return this.value;
    }

    /**
     * Set the value of the option.
     */
    public setValue(value: any) {
        this.value = value;
    }

    /**
     * Returns the default value of the option.
     */
    public getDefault() {
        return this.default;
    }

    /**
     * Returns the categories of the option.
     */
    public getCategories() {
        return this.categories;
    }

    /**
     * Set the default value of the option.
     */
    public setDefault(value: any) {
        this.default = value;
    }

    /**
     * Returns true if the option is a boolean.
     */
    public isBoolean() {
        return this.type === OptionType.BOOLEAN;
    }

    /**
     * Returns true if the option is a string.
     */
    public isString() {
        return this.type === OptionType.STRING;
    }

    /**
     * Returns true if the option is a float.
     */
    public isFloat() {
        return this.type === OptionType.FLOAT;
    }

    /**
     * Returns true if the option is an integer.
     */
    public isInt() {
        return this.type === OptionType.INT;
    }


    /**
     * Converts the received JSON data into a Option object.
     */
    public fromJSON(json: any) : Option {
        //console.log(json);

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
            //console.log(this.name, json.kind);

            if(json.kind.mutatorBoolean) {
                this.type   = OptionType.BOOLEAN;
                this.value  = json.kind.mutatorBoolean.value;
            }

            if(json.kind.mutatorString) {
                this.type   = OptionType.STRING;
                this.value  = json.kind.mutatorString.value;
            }

            if(json.kind.mutatorFloatValues) {
                this.type   = OptionType.FLOAT;
                this.value  = json.kind.mutatorFloatValues.value;
            }

            if(json.kind.mutatorIntValues) {
                this.type   = OptionType.INT;
                this.value  = json.kind.mutatorIntValues.value;
            }

            if(json.kind.mutatorSparseBoolean) {
                this.default  = json.kind.mutatorSparseBoolean.defaultValue;
                // >.size;
                // >.sparseValues;
            }

            if(json.kind.mutatorSparseIntValues) {
                this.default  = json.kind.mutatorSparseIntValues.defaultValue;
                // >.size;
                // >.sparseValues;
            }

            if(json.kind.mutatorSparseFloatValues) {
                this.default  = json.kind.mutatorSparseFloatValues.defaultValue;
                // >.size;
                // >.sparseValues;
            }

           //  console.log(this.name, this.type, this.value, this.default);
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

    /**
     * Converts the options object to valid JSON data.
     *
     * @returns The JSON data representing the option.
     */
    public toJSON(): any {
        const result: any = {
            id: this.id,
            name: this.name
        };

        if(this.categories.length > 0) {
            result.category = this.categories.join(',');
        }

        result.kind = {};

        switch(this.type) {
            case OptionType.BOOLEAN:
                if(this.value !== null) {
                    result.kind.mutatorBoolean = {
                        value: this.value
                    };
                }
            break;
            case OptionType.STRING:
                if(this.value !== null) {
                    result.kind.mutatorString = {
                        value: this.value
                    };
                }
            break;
            case OptionType.FLOAT:
                if(this.value !== null) {
                    result.kind.mutatorFloatValues = {
                        value: this.value
                    };
                }
            break;

            case OptionType.INT:
                if(this.value !== null) {
                    result.kind.mutatorIntValues = {
                        value: this.value
                    };
                }
            break;
        }

        if(this.default !== null) {
            switch(this.type) {
                case OptionType.BOOLEAN:
                    result.kind.mutatorSparseBoolean = {
                        defaultValue: this.default
                        // TODO: size, sparseValues
                    };
                break;
                case OptionType.FLOAT:
                    result.kind.mutatorSparseFloatValues = {
                        defaultValue: this.default
                        // TODO: size, sparseValues
                    };
                break;
                case OptionType.INT:
                    result.kind.mutatorSparseIntValues = {
                        defaultValue: this.default
                        // TODO: size, sparseValues
                    };
                break;
            }
        }

        // TODO: metadata handling (translations, resources)

        return result;
    }
}