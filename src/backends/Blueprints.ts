/**
 * @author      Adrian Preuß
 * @since     1.0.0
 */

import {
    GetBlueprintsByIdRequest,
    GetBlueprintsByIdResponse, GetOwnedPlayElementsResponse,
    GetScheduledBlueprintsRequest,
    GetScheduledBlueprintsResponse, PlayElementResponse,
} from "../generated/Main";

import Connector from '../Connector';
import REST from '../REST';
import Blueprint from "../models/Blueprint";
import {BlueprintId} from "../generated/models/BlueprintId";
/**
 * @class Blueprints
 * @category Backends
 * @hideconstructor
 */
class Blueprints {
    private connector: Connector;

    constructor(connector: Connector) {
        this.connector = connector;
    }

    /**
     * List all available blueprints.
     */
    public async list(): Promise<Blueprint[] | null> {
        const request = GetScheduledBlueprintsRequest.fromPartial({});
        const bytes: Uint8Array = GetScheduledBlueprintsRequest.encode(request).finish();
        const response: Uint8Array | null = await REST.post(this.connector.getConfig().getURL('getScheduledBlueprints'), bytes, {
            'Origin': `https://${this.connector.getConfig().getTarget()}`,
            'Referer': `https://${this.connector.getConfig().getTarget()}`,
            'x-dice-tenancy': this.connector.getConfig().getTenancy(),
            'x-gateway-session-id': this.connector.getConfig().getSession() || ''
        });

        if(response == null) {
            return null;
        }

        const responseMessage = GetScheduledBlueprintsResponse.decode(response);
        const blueprints = await this.get(responseMessage.blueprintIds);

        if(!blueprints) {
            return null;
        }

        return blueprints;
    }

    /**
     * Get all blueprints by given id's.
     *
     * @param ids Array of blueprint ids.
     */
    public async get(ids: BlueprintId[]): Promise<Blueprint[] | null> {
        const request = GetBlueprintsByIdRequest.fromPartial({blueprintIds});
        const bytes: Uint8Array = GetBlueprintsByIdRequest.encode(request).finish();
        const response: Uint8Array | null = await REST.post(this.connector.getConfig().getURL('getBlueprintsById'), bytes, {
            'Origin': `https://${this.connector.getConfig().getTarget()}`,
            'Referer': `https://${this.connector.getConfig().getTarget()}`,
            'x-dice-tenancy': this.connector.getConfig().getTenancy(),
            'x-gateway-session-id': this.connector.getConfig().getSession() || ''
        });

        if (response == null) {
            return null;
        }

        const responseMessage = GetBlueprintsByIdResponse.decode(response);

        if(!responseMessage) {
            return null;
        }

        const results: Blueprint[] = [];

        for(const entry of responseMessage.blueprints) {
            results.push(new Blueprint().fromJSON(entry));
        }

        return results;
    }
}

export { Blueprints };
export default Blueprints;