/**
 * @author      Adrian Preuß
 * @since       1.0.0
 */

import {
    ListExperiencesRequest,
    ListExperiencesResponse
} from "../generated/Main";

import { PlayExperienceQuery } from '../generated/models/PlayExperienceQuery';
import { BlueprintId } from '../generated/models/BlueprintId';
import Connector from '../Connector';
import REST from '../REST';

/**
 * @class Experience
 * @category Backends
 * @hideconstructor
 */
class Experience {
    private connector: Connector;

    constructor(connector: Connector) {
        this.connector = connector;
    }

    public async list(limit: number = 10): Promise<ListExperiencesResponse | null> {
        const request = ListExperiencesRequest.fromPartial({
            filter: {
                pageSize: limit
            }
        });
        const bytes: Uint8Array             = ListExperiencesRequest.encode(request).finish();
        const response: Uint8Array | null   = await REST.post(this.connector.getConfig().getURL('ListExperiences'), bytes, {
            'Origin':               `https://${this.connector.getConfig().getTarget()}`,
            'Referer':              `https://${this.connector.getConfig().getTarget()}`,
            'x-dice-tenancy':       this.connector.getConfig().getTenancy(),
            'x-gateway-session-id': this.connector.getConfig().getSession() || ''
        });

        if(response == null) {
            return null;
        }

        return ListExperiencesResponse.decode(response);
    }
}

export { Experience };
export default Experience;