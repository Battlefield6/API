/**
 * @author      Adrian Preuß
 * @since       1.0.0
 */

/**
* Represents the type of an creator.
*/
const enum CreatorType {
    /**
     * Unknown creator type.
     */
    UNKNOWN,

    /**
     * Represents a player creator (for example, a normal user)
     */
    PLAYER,

    /**
     * Represents an internal creator (for sample DICE, EA,..)
     */
    INTERNAL,

    /**
     * Represents an external creator (for example, a third-party company working for DICE, EA...)
     */
    EXTERNAL,

    /**
     * Represents a trusted creator (for example, a verified content creator)
     */
    TRUSTED
}

export default CreatorType;
