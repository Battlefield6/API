/**
 * @author      Adrian Preuß
 * @version     1.0.0
 */
import {
    GetOwnedPlayElementsRequest,
    GetOwnedPlayElementsResponse,
    GetOwnedPlayElementsResponseV2,
    DeletePlayElementRequest,
    DeletePlayElementResponse,
    CreatePlayElementRequest,
    PlayElementResponse,
	GetPlayElementRequest
} from "../generated/Main";
import { UpdatePlayElementRequest } from "../generated/models/UpdatePlayElementRequest";

import { Connector, PublishState } from '../Connector';
import REST from '../REST';
import { StringifyOptions } from "node:querystring";

export default class PlayElement {
    private connector: Connector;

    constructor(connector: Connector) {
        this.connector = connector;
    }

    public async list(publishStates: PublishState[] = [], includeDenied: boolean = false): Promise<GetOwnedPlayElementsResponse | null> {
        const request                       = GetOwnedPlayElementsRequest.fromPartial({ publishStates, includeDenied });
        const bytes: Uint8Array             = GetOwnedPlayElementsRequest.encode(request).finish();
        const response: Uint8Array | null   = await REST.post(this.connector.getConfig().getURL('getOwnedPlayElements'), bytes, {
            'Origin':               `https://${this.connector.getConfig().getTarget()}`,
            'Referer':              `https://${this.connector.getConfig().getTarget()}`,
            'x-dice-tenancy':       this.connector.getConfig().getTenancy(),
            'x-gateway-session-id': this.connector.getConfig().getSession() || ''
        });

        if(response == null) {
            return null;
        }

        return GetOwnedPlayElementsResponse.decode(response);
    }

    public async listV2(publishStates: PublishState[] = [], includeDenied: boolean = false): Promise<GetOwnedPlayElementsResponseV2 | null> {
        const request                       = GetOwnedPlayElementsRequest.fromPartial({ publishStates, includeDenied });
        const bytes: Uint8Array             = GetOwnedPlayElementsRequest.encode(request).finish();
        const response: Uint8Array | null   = await REST.post(this.connector.getConfig().getURL('getOwnedPlayElementsV2'), bytes, {
            'Origin':               `https://${this.connector.getConfig().getTarget()}`,
            'Referer':              `https://${this.connector.getConfig().getTarget()}`,
            'x-dice-tenancy':       this.connector.getConfig().getTenancy(),
            'x-gateway-session-id': this.connector.getConfig().getSession() || ''
        });

        if(response == null) {
            return null;
        }

        return GetOwnedPlayElementsResponseV2.decode(response);
    }

    public async delete(playElementId: string): Promise<DeletePlayElementResponse | null> {
        const request                       = DeletePlayElementRequest.create({ playElementId });
        const bytes: Uint8Array             = DeletePlayElementRequest.encode(request).finish();
        const response: Uint8Array | null   = await REST.post(this.connector.getConfig().getURL('deletePlayElement'), bytes, {
            'Origin':               `https://${this.connector.getConfig().getTarget()}`,
            'Referer':              `https://${this.connector.getConfig().getTarget()}`,
            'x-dice-tenancy':       this.connector.getConfig().getTenancy(),
            'x-gateway-session-id': this.connector.getConfig().getSession() || ''
        });

        if(response == null) {
            return null;
        }

        return DeletePlayElementResponse.decode(response);
    }

    public async create(data: any): Promise<PlayElementResponse | null> {
        const request                       = CreatePlayElementRequest.fromPartial(data);
        const bytes: Uint8Array             = CreatePlayElementRequest.encode(request).finish();
        const response: Uint8Array | null   = await REST.post(this.connector.getConfig().getURL('createPlayElement'), bytes, {
            'Origin':               `https://${this.connector.getConfig().getTarget()}`,
            'Referer':              `https://${this.connector.getConfig().getTarget()}`,
            'x-dice-tenancy':       this.connector.getConfig().getTenancy(),
            'x-gateway-session-id': this.connector.getConfig().getSession() || ''
        });

        if(response == null) {
            return null;
        }

        return PlayElementResponse.decode(response);
    }

    public async update(id: string, data: any): Promise<PlayElementResponse | null> {
        const request                       = UpdatePlayElementRequest.fromPartial({ id, ...data });
        const bytes: Uint8Array             = UpdatePlayElementRequest.encode(request).finish();
        const response: Uint8Array | null   = await REST.post(this.connector.getConfig().getURL('updatePlayElement'), bytes, {
            'Origin':               `https://${this.connector.getConfig().getTarget()}`,
            'Referer':              `https://${this.connector.getConfig().getTarget()}`,
            'x-dice-tenancy':       this.connector.getConfig().getTenancy(),
            'x-gateway-session-id': this.connector.getConfig().getSession() || ''
        });

        if(response == null) {
            return null;
        }

        return PlayElementResponse.decode(response);
    }

    public async get(id: string, includeDenied: boolean = false): Promise<PlayElementResponse | null> {
        const request                       = GetPlayElementRequest.fromPartial({ id, includeDenied });
        const bytes: Uint8Array             = GetPlayElementRequest.encode(request).finish();
        const response: Uint8Array | null   = await REST.post(this.connector.getConfig().getURL('getPlayElement'), bytes, {
            'Origin':               `https://${this.connector.getConfig().getTarget()}`,
            'Referer':              `https://${this.connector.getConfig().getTarget()}`,
            'x-dice-tenancy':       this.connector.getConfig().getTenancy(),
            'x-gateway-session-id': this.connector.getConfig().getSession() || ''
        });

        if(response == null) {
            return null;
        }

        return PlayElementResponse.decode(response);
    }
}