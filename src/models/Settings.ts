/**
 * @author      Adrian Preuß
 * @since       1.0.0
 */

export default class Settings {
    private secret: string | null = null;
    private messages: any[] = [];
    private allowCopies: boolean = false;

    /**
     * Gets the secret.
     * 
     * @returns The secret.
     */
    public getSecret(): string | null {
        return this.secret;
    }

    /**
     * Sets the secret.
     * 
     * @param secret The secret.
     */
    public setSecret(secret: string | null): void {
        this.secret = secret;
    }

    /**
     * Gets the messages.
     * 
     * @returns The messages.
     */
    public getMessages(): any[] {
        return this.messages;
    }

    /**
     * Sets the messages.
     * 
     * @param messages The messages.
     */
    public setMessages(messages: any[]): void {
        this.messages = messages;
    }

    /**
     * Gets the allow copies flag.
     * 
     * @returns The allow copies flag.
     */
    public getAllowCopies(): boolean {
        return this.allowCopies;
    }

    /**
     * Sets the allow copies flag.
     * 
     * @param allowCopies The allow copies flag.
     */
    public setAllowCopies(allowCopies: boolean): void {
        this.allowCopies = allowCopies;
    }

    /**
     * Populates the settings from a JSON object.
     * 
     * @param json The JSON object.
     * @returns The populated settings.
     */
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

    /**
     * Converts the settings to a JSON object.
     * 
     * @returns The JSON object.
     */
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
