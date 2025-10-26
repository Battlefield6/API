/**
 * @author      Adrian Preuß
 * @since       1.0.0
 */

export default class Settings {
    private secret: string | null = null;
    private messages: any[] = [];
    private allowCopies: boolean = false;

    public getSecret(): string | null {
        return this.secret;
    }

    public setSecret(secret: string | null): void {
        this.secret = secret;
    }

    public getMessages(): any[] {
        return this.messages;
    }

    public setMessages(messages: any[]): void {
        this.messages = messages;
    }

    public getAllowCopies(): boolean {
        return this.allowCopies;
    }

    public setAllowCopies(allowCopies: boolean): void {
        this.allowCopies = allowCopies;
    }

    public fromJSON(json: any): Settings {
        if(json.secret) {
            this.secret = json.secret.value || json.secret;
        }

        if(json.messages && Array.isArray(json.messages)) {
            this.messages = json.messages;
        }

        if(json.allowCopies !== undefined) {
            this.allowCopies = json.allowCopies;
        }

        return this;
    }

    public toJSON(): any {
        const result: any = {
            allowCopies: this.allowCopies,
            messages: this.messages
        };

        if(this.secret) {
            result.secret = { value: this.secret };
        }

        return result;
    }
}
