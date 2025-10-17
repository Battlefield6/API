/**
 * @author      Adrian Preuß
 * @version     1.0.0
 */

import {
    ListModDataVersionsRequest,
    ListModDataVersionsResponse,
    CreateModDataVersionRequest,
    CreateModDataVersionResponse
} from "../generated/Main";

import Connector from '../Connector';
import REST from '../REST';

/*
    This actions requires VIP status!

    @permissions VIP
*/
export default class Mod {
    private connector: Connector;

    constructor(connector: Connector) {
        this.connector = connector;
    }

    public async list(playElementId: string): Promise<ListModDataVersionsResponse | null> {
        const bytes: Uint8Array             = ListModDataVersionsRequest.encode({ playElementId }).finish();
        const response: Uint8Array | null   = await REST.post(this.connector.getConfig().getURL('listModDataVersions'), bytes, {
            'Origin':               `https://${this.connector.getConfig().getTarget()}`,
            'Referer':              `https://${this.connector.getConfig().getTarget()}`,
            'x-dice-tenancy':       this.connector.getConfig().getTenancy(),
            'x-gateway-session-id': this.connector.getConfig().getSession() || ''
        });

        if(response == null) {
            return null;
        }

        return ListModDataVersionsResponse.decode(response);
    }

    public async create(playElementId: string): Promise<CreateModDataVersionResponse | null> {
        const bytes: Uint8Array             = CreateModDataVersionRequest.encode({ playElementId }).finish();
        const response: Uint8Array | null   = await REST.post(this.connector.getConfig().getURL('createModDataVersion'), bytes, {
            'Origin':               `https://${this.connector.getConfig().getTarget()}`,
            'Referer':              `https://${this.connector.getConfig().getTarget()}`,
            'x-dice-tenancy':       this.connector.getConfig().getTenancy(),
            'x-gateway-session-id': this.connector.getConfig().getSession() || ''
        });

        if(response == null) {
            return null;
        }

        return CreateModDataVersionResponse.decode(response);
    }
}