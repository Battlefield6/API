/**
 * @author      Adrian Preuß
 * @since       1.0.0
 */

export default class Configuration {
    private domain: string          = 'ops.dice.se';
    private service: string         = 'santiago-prod-wgw-envoy';
    private target: string          = 'portal.battlefield.com';
    private package: string         = 'santiago.web.play.WebPlay';
    private tenancy: string         = 'prod_default-prod_default-santiago-common';
    private session: string | null  = null;
    private debug: boolean          = false;

    public getDebug(): boolean {
        return this.debug;
    }

    public setDebug(debug: boolean) {
        if(debug) {
            console.warn('DEBUG MODE ENABLED!');
        }

        this.debug = debug;
    }

    public hasSession(): boolean {
        return (this.session != null);
    }

    public getSession(): string | null {
        return this.session;
    }

    public setSession(id: string) {
        this.session = id;
    }

    public getTenancy(): string {
        return this.tenancy;
    }

    public getTarget(): string {
        return this.target;
    }

    public getDomain(): string {
        return this.domain;
    }

    public getService(): string {
        return this.service;
    }

    public getPackage(): string {
        return this.package;
    }

    public getURL(path?: string, packages?: string): string {
        return `https://${this.service}.${this.domain}/${packages || this.package}/${path}`;
    }
}