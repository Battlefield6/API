/**
 * @author      Adrian Preuß
 * @since       1.0.0
 */

import Connector from './Connector';
import Configuration from './Configuration';

export * from './Configuration';
export * from './Connector';
export * from './Exceptions';
export * from './REST';
export * from './backends';
export * from './enums';
export * from './models';

/* @ignore */
const instance: Connector               = new Connector();

/* @ignore */
const config: Configuration             = instance.getConfig();

export {
    instance as Connector,
    config as Configuration
};

/**
 * Authentication backend instance (Singleton)
 * @category Backends
 */
export const Authentication = instance.getAuthentication();

/**
 * Blueprints backend instance (Singleton)
 * @category Backends
 */
export const Blueprints = instance.getBlueprints();

/**
 * PlayElements backend instance (Singleton)
 * @category Backends
 */
export const PlayElements = instance.getPlayElements();

/**
 * Experience backend instance (Singleton)
 * @category Backends
 */
export const Experience = instance.getExperience();

/**
 * Mod backend instance (Singleton)
 * @category Backends
 */
export const Mod = instance.getMod();
