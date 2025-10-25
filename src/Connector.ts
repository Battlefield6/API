/**
 * @author      Adrian Preuß
 * @since       1.0.0
 */

import Configuration from './Configuration';
import { Authentication, Blueprints, PlayElements, Experience, Mod } from './backends';
import { PublishState } from './generated/enum/PublishState';

export default class Connector {
    private readonly config: Configuration;

    /* Backends */
    private readonly authentication: Authentication;
    private readonly blueprints: Blueprints;
    private readonly playElements: PlayElements;
    private readonly experiences: Experience;
    private readonly mods: Mod;

    constructor(config: Configuration = new Configuration()) {
        this.config     = config;

        /* Register Backends */
        this.authentication = new Authentication(this);
        this.blueprints     = new Blueprints(this);
        this.playElements   = new PlayElements(this);
        this.experiences    = new Experience(this);
        this.mods           = new Mod(this);
    }

    public getConfig(): Configuration {
        return this.config;
    }

    public getBlueprints(): Blueprints {
        return this.blueprints;
    }

    public getPlayElements(): PlayElements {
        return this.playElements;
    }

    public getExperience(): Experience {
        return this.experiences;
    }

    public getMod(): Mod {
        return this.mods;
    }

    public getAuthentication(): Authentication {
        return this.authentication;
    }
}

export { PublishState };