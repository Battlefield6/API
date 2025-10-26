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

    public getId(): string {
        return this.id;
    }

    public setId(id: string): void {
        this.id = id;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getCreated(): Date | null {
        return this.created ?? null;
    }

    public setCreated(created: Date): void {
        this.created = created;
    }

    public getDesignMetadata(): any {
        return this.designMetadata;
    }

    public setDesignMetadata(metadata: any): void {
        this.designMetadata = metadata;
    }

    public getMapRotation(): MapRotation {
        return this.mapRotation;
    }

    public setMapRotation(mapRotation: MapRotation): void {
        this.mapRotation = mapRotation;
    }

    public getMutators(): Option[] {
        return this.mutators;
    }

    public setMutators(mutators: Option[]): void {
        this.mutators = mutators;
    }

    public getAssetCategories(): any[] {
        return this.assetCategories;
    }

    public setAssetCategories(assetCategories: any[]): void {
        this.assetCategories = assetCategories;
    }

    public getLicenseRequirements(): string[] {
        return this.licenseRequirements;
    }

    public setLicenseRequirements(licenseRequirements: string[]): void {
        this.licenseRequirements = licenseRequirements;
    }

    public getModRules(): any {
        return this.modRules;
    }

    public setModRules(modRules: any): void {
        this.modRules = modRules;
    }

    public getTags(): Tag[] {
        return this.tags;
    }

    public setTags(tags: Tag[]): void {
        this.tags = tags;
    }

    public getBlazeSettings(): any {
        return this.blazeSettings;
    }

    public setBlazeSettings(blazeSettings: any): void {
        this.blazeSettings = blazeSettings;
    }

    public getModLevelDataId(): string | null {
        return this.modLevelDataId;
    }

    public setModLevelDataId(modLevelDataId: string | null): void {
        this.modLevelDataId = modLevelDataId;
    }

    public getAttachments(): any[] {
        return this.attachments;
    }

    public setAttachments(attachments: any[]): void {
        this.attachments = attachments;
    }

    public getGroupLicenses(): string[] {
        return this.groupLicenses;
    }

    public setGroupLicenses(groupLicenses: string[]): void {
        this.groupLicenses = groupLicenses;
    }

    public getAttachmentCompileStatus(): number {
        return this.attachmentCompileStatus;
    }

    public setAttachmentCompileStatus(status: number): void {
        this.attachmentCompileStatus = status;
    }

    public getServerHostLicenseRequirements(): string[] {
        return this.serverHostLicenseRequirements;
    }

    public setServerHostLicenseRequirements(requirements: string[]): void {
        this.serverHostLicenseRequirements = requirements;
    }

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
