import { Component } from "@angular/core";
const addSchema = require("../../../../schematics/src/ng-add/schema.json");
@Component({
    selector: "nui-dashboard-schematics-docs",
    templateUrl: "./schematics-docs.component.html",
})
export class SchematicsDocsComponent {
    public addJsonScheme: any = {};
    objectKeys = Object.keys;

    constructor() {
        this.schemaObjectFiller(addSchema.properties, "add");
    }

    private schemaObjectFiller(props: any, name: string) {
        const object = (this as any)[`${name}JsonScheme`];
        for (const prop of this.objectKeys(props)) {
            object[prop] = {
                description: props[prop].description,
                type: props[prop].type,
            };
            if (props[prop].enum) {
                object[prop].enum = props[prop].enum;
            }
            if (props[prop].default) {
                object[prop].default = props[prop].default;
            }
            if (props[prop].alias) {
                object[prop].alias = props[prop].alias;
            }
        }
    }
}
