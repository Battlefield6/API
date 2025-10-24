/**
 * @author      Adrian Preuß
 * @version     1.0.0
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

// Create singleton instance and export backend instances
const instance: Connector               = new Connector();
const config: Configuration             = instance.getConfig();

export {
    instance as Connector,
    config as Configuration
};

// Export backend instances
export const Authentication = instance.getAuthentication();
export const Blueprints = instance.getBlueprints();
export const PlayElements = instance.getPlayElements();
export const Experience = instance.getExperience();
export const Mod = instance.getMod();
