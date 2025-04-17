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

/*
CLI commands used to generate the current examples:

ng g "./schematics/src/collection.json":table --force --path=demo/src/schematics/table --prefix=app
 --name=basic-table --dataSource=clientSide --enable-search=false --enable-sort=false --pagingMode=pagination

ng g "./schematics/src/collection.json":table --force --path=demo/src/schematics/table --prefix=app
 --name=table-with-sort --dataSource=serverSide --enable-search=false --enable-sort=true --pagingMode=pagination

ng g "./schematics/src/collection.json":table --force --path=demo/src/schematics/table --prefix=app
 --name=table-with-search --dataSource=serverSide --enable-search=true --enable-sort=false --pagingMode=pagination

ng g "./schematics/src/collection.json":table --lint-fix --force --path=demo/src/schematics/table
 --name=table-with-pagination --prefix=app --dataSource=serverSide --pagingMode=pagination

ng g "./schematics/src/collection.json":table --lint-fix --force
--name=table-with-selection  --path=demo/src/schematics/table --prefix=app --dataSource=serverSide --pagingMode=pagination --selectionMode=multi

ng g "./schematics/src/collection.json":table --lint-fix --force --path=demo/src/schematics/table --prefix=app
 --name=table-with-virtual-scroll --dataSource=serverSide --pagingMode=virtualScroll
*/
import { Component } from "@angular/core";

import { SchematicsDocsComponentType } from "../utils/schematic-docs-cli-option/schematic-docs-cli-option.component";

@Component({
    selector: "nui-table-schematics-docs-example",
    templateUrl: "table-schematic-example.component.html",
    providers: [
        {
            provide: SchematicsDocsComponentType,
            useValue: SchematicsDocsComponentType.table,
        },
    ],
    standalone: false
})
export class TableSchematicExampleComponent {}
