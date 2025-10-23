/**
 * @author      Adrian Preuß
 * @version     1.0.0
 */

import Configuration from './Configuration';
import Authentication from './backends/Authentication';
import Blueprint from './backends/Blueprint';
import Experience from './backends/Experience';
import PlayElements from './backends/PlayElements';
import Mod from './backends/Mod';
import { PublishState } from './generated/enum/PublishState';

export default class Connector {
    private readonly config: Configuration;

    /* Backends */
    private readonly authentication: Authentication;
    private readonly blueprints: Blueprint;
    private readonly playElements: PlayElements;
    private readonly experiences: Experience;
    private readonly mods: Mod;

    constructor(config: Configuration = new Configuration()) {
        this.config     = config;

        /* Register Backends */
        this.authentication = new Authentication(this);
        this.blueprints     = new Blueprint(this);
        this.playElements   = new PlayElements(this);
        this.experiences    = new Experience(this);
        this.mods           = new Mod(this);
    }

    public getConfig(): Configuration {
        return this.config;
    }

    public getBlueprint(): Blueprint {
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

const instance: Connector               = new Connector();
const config: Configuration             = instance.getConfig();
const authentication: Authentication    = instance.getAuthentication();
const blueprint: Blueprint              = instance.getBlueprint();
const playElements: PlayElements        = instance.getPlayElements();
const experiences: Experience           = instance.getExperience();
const mods: Mod                         = instance.getMod();

export {
    /* Main */
    Connector,
    instance as Instance,
    config as Configuration,

    /* Enums */
    PublishState,

    /* Backends */
    authentication as Authentication,
    blueprint as Blueprint,
    playElements as PlayElements,
    experiences as Experience,
    mods as Mod
};