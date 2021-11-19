import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: "nui-schematic-json",
    template: `
        <div>
            <code>Schema.json <b>options:</b></code>
        </div>
        <div *ngFor="let item of schemaViewData | keyvalue"
                class="d-inline-block p-2">
            <nui-popover [template]="popoverWithBasicUsage"
                            placement="top">
                <span class="nui-text-default--hoverable">{{item.key}}</span>
            </nui-popover>
            <ng-template #popoverWithBasicUsage>
                <div *ngFor="let field of fieldsToDisplay">
                    <ng-container *ngIf="item.value[field] !== undefined">
                        <div class="nui-text-default">
                            <i style="font-weight: bold">{{ field }}: </i> <span>{{item.value[field]}}</span>
                        </div>
                    </ng-container>
                </div>
            </ng-template>
        </div>
    `,
})
export class SchematicJsonComponent implements OnInit {
    // Folder from where schema.json should be taken
    @Input() schematicFolderName: string;

    public schemaViewData: any = {};
    public fieldsToDisplay: Array<string> = ["description", "type", "enum", "alias", "default"];

    ngOnInit(): void {
        const schemaJson = require(`../../../../schematics/src/${this.schematicFolderName}/schema.json`);
        this.fillViewData(schemaJson.properties);
    }

    private fillViewData(schemaJsonFields: any) {
        Object.keys(schemaJsonFields).forEach(fieldName => {
            const { description, type, enum: enumField, default: defaultField, alias: aliasField } = schemaJsonFields[fieldName];
            this.schemaViewData[fieldName] = {
                description,
                type,
                enum: enumField && enumField.join(", "),
                default: defaultField,
                alias: aliasField,
            };
        });
    }
}
