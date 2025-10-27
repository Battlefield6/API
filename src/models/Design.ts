/**
 * @author      Adrian Preuß
 * @since       1.0.0
 */

import MapRotation from './MapRotation';
import Option from './Option';
import Tag from './Tag';

export default class Design {
    private id: string = '';
    private name: string = '';
    private created?: Date | null = null;
    private designMetadata: any = null;
    private mapRotation: MapRotation = new MapRotation();
    private mutators: Option[] = [];
    private assetCategories: any[] = [];
    private licenseRequirements: string[] = [];
    private modRules: any = null;
    private tags: Tag[] = [];
    private blazeSettings: any = null;
    private modLevelDataId: string | null = null;
    private attachments: any[] = [];
    private groupLicenses: string[] = [];
    private attachmentCompileStatus: number = 0;
    private serverHostLicenseRequirements: string[] = [];

    /**
     * Gets the ID of the design.
     * 
     * @returns The ID of the design.
     */
    public getId(): string {
        return this.id;
    }

    /**
     * Sets the ID of the design.
     * 
     * @param id The ID of the design.
     */
    public setId(id: string): void {
        this.id = id;
    }

    /**
     * Gets the name of the design.
     * 
     * @returns The name of the design.
     */
    public getName(): string {
        return this.name;
    }

    /**
     * Sets the name of the design.
     * 
     * @param name The name of the design.
     */
    public setName(name: string): void {
        this.name = name;
    }

    /**
     * Gets the creation date of the design.
     * 
     * @returns The creation date of the design.
     */
    public getCreated(): Date | null {
        return this.created ?? null;
    }


    /**
     * Sets the creation date of the design.
     * 
     * @param created The creation date of the design.
     */
    public setCreated(created: Date): void {
        this.created = created;
    }

    /**
     * Gets the design metadata.
     * 
     * @returns The design metadata.
     */
    public getDesignMetadata(): any {
        return this.designMetadata;
    }

    /**
     * Sets the design metadata.
     * 
     * @param metadata The design metadata.
     */
    public setDesignMetadata(metadata: any): void {
        this.designMetadata = metadata;
    }

    /**
     * Gets the map rotation.
     * 
     * @returns The map rotation.
     */
    public getMapRotation(): MapRotation {
        return this.mapRotation;
    }

    /**
     * Sets the map rotation.
     * 
     * @param mapRotation The map rotation.
     */
    public setMapRotation(mapRotation: MapRotation): void {
        this.mapRotation = mapRotation;
    }

    /**
     * Gets the mutators.
     * 
     * @returns The mutators.
     */
    public getMutators(): Option[] {
        return this.mutators;
    }

    /**
     * Sets the mutators.
     * 
     * @param mutators The mutators.
     */
    public setMutators(mutators: Option[]): void {
        this.mutators = mutators;
    }

    /**
     * Gets the asset categories.
     * 
     * @returns The asset categories.
     */
    public getAssetCategories(): any[] {
        return this.assetCategories;
    }

    /**
     * Sets the asset categories.
     * 
     * @param assetCategories The asset categories.
     */
    public setAssetCategories(assetCategories: any[]): void {
        this.assetCategories = assetCategories;
    }

    /**
     * Gets the license requirements.
     * 
     * @returns The license requirements.
     */
    public getLicenseRequirements(): string[] {
        return this.licenseRequirements;
    }

    /**
     * Sets the license requirements.
     * 
     * @param licenseRequirements The license requirements.
     */
    public setLicenseRequirements(licenseRequirements: string[]): void {
        this.licenseRequirements = licenseRequirements;
    }

    /**
     * Gets the mod rules.
     * 
     * @returns The mod rules.
     */
    public getModRules(): any {
        return this.modRules;
    }

    /**
     * Sets the mod rules.
     * 
     * @param modRules The mod rules.
     */
    public setModRules(modRules: any): void {
        this.modRules = modRules;
    }

    /**
     * Gets the tags.
     * 
     * @returns The tags.
     */
    public getTags(): Tag[] {
        return this.tags;
    }

    /**
     * Sets the tags.
     * 
     * @param tags The tags.
     */
    public setTags(tags: Tag[]): void {
        this.tags = tags;
    }

    /**
     * Gets the blaze settings.
     * 
     * @returns The blaze settings.
     */
    public getBlazeSettings(): any {
        return this.blazeSettings;
    }

    /**
     * Sets the blaze settings.
     * 
     * @param blazeSettings The blaze settings.
     */
    public setBlazeSettings(blazeSettings: any): void {
        this.blazeSettings = blazeSettings;
    }

    /**
     * Gets the mod level data ID.
     * 
     * @returns The mod level data ID.
     */
    public getModLevelDataId(): string | null {
        return this.modLevelDataId;
    }

    /**
     * Sets the mod level data ID.
     * 
     * @param modLevelDataId The mod level data ID.
     */
    public setModLevelDataId(modLevelDataId: string | null): void {
        this.modLevelDataId = modLevelDataId;
    }

    /**
     * Gets the attachments.
     * 
     * @returns The attachments.
     */
    public getAttachments(): any[] {
        return this.attachments;
    }

    /**
     * Sets the attachments.
     * 
     * @param attachments The attachments.
     */
    public setAttachments(attachments: any[]): void {
        this.attachments = attachments;
    }

    /**
     * Gets the group licenses.
     * 
     * @returns The group licenses.
     */
    public getGroupLicenses(): string[] {
        return this.groupLicenses;
    }

    /**
     * Sets the group licenses.
     * 
     * @param groupLicenses The group licenses.
     */
    public setGroupLicenses(groupLicenses: string[]): void {
        this.groupLicenses = groupLicenses;
    }

    /**
     * Gets the attachment compile status.
     * 
     * @returns The attachment compile status.
     */
    public getAttachmentCompileStatus(): number {
        return this.attachmentCompileStatus;
    }

    /**
     * Sets the attachment compile status.
     * 
     * @param status The attachment compile status.
     */
    public setAttachmentCompileStatus(status: number): void {
        this.attachmentCompileStatus = status;
    }

    /**
     * Gets the server host license requirements.
     * 
     * @returns The server host license requirements.
     */
    public getServerHostLicenseRequirements(): string[] {
        return this.serverHostLicenseRequirements;
    }

    /**
     * Sets the server host license requirements.
     * 
     * @param requirements The server host license requirements.
     */
    public setServerHostLicenseRequirements(requirements: string[]): void {
        this.serverHostLicenseRequirements = requirements;
    }

    /**
     * Populates the design from a JSON object.
     *
     * @param json The JSON object.
     * @returns The populated design.
     */
    public fromJSON(json: any): Design {
        if(json.designId) {
            this.id = json.designId;
        }

        if(json.designName) {
            this.name = json.designName;
        }

        if(json.created) {
            this.created = new Date(json.created);
        }

        if(json.designMetadata) {
            this.designMetadata = json.designMetadata;
        }

        if(json.mapRotation) {
            this.mapRotation.fromJSON(json.mapRotation);
        }

        if(json.mutators && Array.isArray(json.mutators)) {
            this.mutators = json.mutators.map((mutator: any) => {
                return new Option().fromJSON(mutator);
            });
        }

        if(json.assetCategories && Array.isArray(json.assetCategories)) {
            this.assetCategories = json.assetCategories;
        }

        if(json.licenseRequirements && Array.isArray(json.licenseRequirements)) {
            this.licenseRequirements = json.licenseRequirements;
        }

        if(json.modRules) {
            this.modRules = json.modRules;
        }

        if(json.tags && Array.isArray(json.tags)) {
            this.tags = json.tags.map((tag: any) => {
                return new Tag().fromJSON(tag);
            });
        }

        if(json.blazeSettings) {
            this.blazeSettings = json.blazeSettings;
        }

        if(json.modLevelDataId) {
            this.modLevelDataId = json.modLevelDataId.value || json.modLevelDataId;
        }

        if(json.attachments && Array.isArray(json.attachments)) {
            this.attachments = json.attachments;
        }

        if(json.groupLicenses && Array.isArray(json.groupLicenses)) {
            this.groupLicenses = json.groupLicenses;
        }

        if(json.attachmentCompileStatus !== undefined) {
            this.attachmentCompileStatus = json.attachmentCompileStatus;
        }

        if(json.serverHostLicenseRequirements && Array.isArray(json.serverHostLicenseRequirements)) {
            this.serverHostLicenseRequirements = json.serverHostLicenseRequirements;
        }

        return this;
    }

    /**
     * Converts the design to a JSON object.
     * 
     * @returns The JSON object.
     */
    public toJSON(): any {
        const result: any = {
            designId: this.id,
            designName: this.name,
            mutators: this.mutators.map(mutator => mutator.toJSON()),
            assetCategories: this.assetCategories,
            licenseRequirements: this.licenseRequirements,
            tags: this.tags.map(tag => tag.toJSON()),
            attachments: this.attachments,
            groupLicenses: this.groupLicenses,
            attachmentCompileStatus: this.attachmentCompileStatus,
            serverHostLicenseRequirements: this.serverHostLicenseRequirements
        };

        if(this.created) {
            result.created = this.created;
        }

        if(this.designMetadata) {
            result.designMetadata = this.designMetadata;
        }

        if(!this.mapRotation.isEmpty()) {
            result.mapRotation = this.mapRotation.toJSON();
        }

        if(this.modRules) {
            result.modRules = this.modRules;
        }

        if(this.blazeSettings) {
            result.blazeSettings = this.blazeSettings;
        }

        if(this.modLevelDataId) {
            result.modLevelDataId = { value: this.modLevelDataId };
        }

        return result;
    }
}
