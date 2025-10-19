/**
 * @author      Adrian Preuß
 * @version     1.0.0
 */

import {
    AuthCodeAuthentication,
    AuthenticationResponse,
    Platform
} from "../generated/Main";

import Connector from '../Connector';
import REST from '../REST';

export default class Authentication {
    private connector: Connector;

    constructor(connector: Connector) {
        this.connector = connector;
    }

    // Simple Test!dd
    /*
        
        https://santiago-prod-wgw-envoy.ops.dice.se/santiago.web.authentication.WebAuthentication/viaAuthCode
        POST
        tenancy: prod_default-prod_default-santiago-common

        f
*QUOgAGDxFC2B9qw4cuw3AYXMCKtycAl6_5_19EVQAQ6
4https://portal.battlefield.com/bf6/de-de/experiences
    */
    public async start(): Promise<AuthenticationResponse | null> {
        const request                       = AuthCodeAuthentication.fromPartial({
            authCode:       '',
            platform:       Platform.PC,
            //redirectUri:    'https://localhost'
        });
        const bytes: Uint8Array             = AuthCodeAuthentication.encode(request).finish();
        const response: Uint8Array | null   = await REST.post(this.connector.getConfig().getURL('viaAuthCode', 'santiago.web.authentication.WebAuthentication'), bytes, {
            'Origin':               `https://${this.connector.getConfig().getTarget()}`,
            'Referer':              `https://${this.connector.getConfig().getTarget()}`,
            'x-dice-tenancy':       this.connector.getConfig().getTenancy(),
            'x-gateway-session-id': this.connector.getConfig().getSession() || ''
        });

        if(response == null) {
            return null;
        }

        return AuthenticationResponse.decode(response);
    }
}