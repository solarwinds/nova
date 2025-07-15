// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { Component, OnInit, input } from "@angular/core";

@Component({
    selector: "nui-schematic-json",
    template: `
        <div>
            <code>Schema.json <b>options:</b></code>
        </div>
        <div
            *ngFor="let item of schemaViewData | keyvalue"
            class="d-inline-block p-2"
        >
            <nui-popover [template]="popoverWithBasicUsage" placement="top">
                <span class="nui-text-default--hoverable">{{ item.key }}</span>
            </nui-popover>
            <ng-template #popoverWithBasicUsage>
                <div *ngFor="let field of fieldsToDisplay">
                    <ng-container *ngIf="item.value[field] !== undefined">
                        <div class="nui-text-default">
                            <i style="font-weight: bold">{{ field }}: </i>
                            <span>{{ item.value[field] }}</span>
                        </div>
                    </ng-container>
                </div>
            </ng-template>
        </div>
    `,
    standalone: false,
})
export class SchematicJsonComponent implements OnInit {
    // Folder from where schema.json should be taken
    readonly schematicFolderName = input<string>(undefined!);

    public schemaViewData: any = {};
    public fieldsToDisplay: Array<string> = [
        "description",
        "type",
        "enum",
        "alias",
        "default",
    ];

    public async ngOnInit(): Promise<void> {
        const schemaJson = await import(`../../../../schematics/src/${this.schematicFolderName()}/schema.json`);
        this.fillViewData(schemaJson.properties);
    }

    private fillViewData(schemaJsonFields: any) {
        Object.keys(schemaJsonFields).forEach((fieldName) => {
            const {
                description,
                type,
                enum: enumField,
                default: defaultField,
                alias: aliasField,
            } = schemaJsonFields[fieldName];
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
