/**
 * @author      Adrian Preuß
 * @since       1.0.4
 */

/**
 * Represents the type of an option.
 **/
const enum OptionType {
    /**
    * Unknown type
    **/
    UNKNOWN,

    /**
     * The option is a string
     **/
    STRING,

    /**
    * The option is an integer
    **/
    INT,

    /**
     * The option is an float
     **/
    FLOAT,

    /**
     * The option is a Boolean value
     **/
    BOOLEAN
}

export default OptionType;