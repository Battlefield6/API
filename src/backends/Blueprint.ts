/**
 * @author      Adrian Preuß
 * @version     1.0.0
 */

import {
    GetBlueprintsByIdRequest,
    GetBlueprintsByIdResponse,
    GetScheduledBlueprintsRequest,
    GetScheduledBlueprintsResponse,
} from "../generated/Main";

import { BlueprintId } from '../generated/models/BlueprintId';
import Connector from '../Connector';
import REST from '../REST';

export default class Blueprint {
    private connector: Connector;

    constructor(connector: Connector) {
        this.connector = connector;
    }

    public async list(): Promise<GetScheduledBlueprintsResponse | null> {
        const request                       = GetScheduledBlueprintsRequest.fromPartial({});
        const bytes: Uint8Array             = GetScheduledBlueprintsRequest.encode(request).finish();
        const response: Uint8Array | null   = await REST.post(this.connector.getConfig().getURL('getScheduledBlueprints'), bytes, {
            'Origin':               `https://${this.connector.getConfig().getTarget()}`,
            'Referer':              `https://${this.connector.getConfig().getTarget()}`,
            'x-dice-tenancy':       this.connector.getConfig().getTenancy(),
            'x-gateway-session-id': this.connector.getConfig().getSession() || ''
        });

        if(response == null) {
            return null;
        }

        return GetScheduledBlueprintsResponse.decode(response);
    }

    public async get(blueprintIds: BlueprintId[]): Promise<GetBlueprintsByIdResponse | null> {
        const request                       = GetBlueprintsByIdRequest.fromPartial({ blueprintIds });
        const bytes: Uint8Array             = GetBlueprintsByIdRequest.encode(request).finish();
        const response: Uint8Array | null   = await REST.post(this.connector.getConfig().getURL('getBlueprintsById'), bytes, {
            'Origin':               `https://${this.connector.getConfig().getTarget()}`,
            'Referer':              `https://${this.connector.getConfig().getTarget()}`,
            'x-dice-tenancy':       this.connector.getConfig().getTenancy(),
            'x-gateway-session-id': this.connector.getConfig().getSession() || ''
        });

        if(response == null) {
            return null;
        }

        return GetBlueprintsByIdResponse.decode(response);
    }
}