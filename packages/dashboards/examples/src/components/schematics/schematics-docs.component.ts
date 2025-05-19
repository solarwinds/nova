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

import { Component } from "@angular/core";

import addSchema from "../../../../schematics/src/ng-add/schema.json";

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
