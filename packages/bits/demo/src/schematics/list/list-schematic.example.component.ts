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

ng g "./schematics/src/collection.json":list --force --path=demo/src/schematics/list --prefix=app
 --name=basic-list --selectionMode=none --dataSource=none --pagingMode=pagination

ng g "./schematics/src/collection.json":list --force --path=demo/src/schematics/list --prefix=app
 --name=selection-list --selectionMode=multi --dataSource=none --pagingMode=pagination

ng g "./schematics/src/collection.json":list --lint-fix --force --path=demo/src/schematics/list --prefix=app
--name=search-list --selectionMode=none --dataSource=serverSide --pagingMode=pagination --enable-search=true --enable-sort=false

ng g "./schematics/src/collection.json":list --lint-fix --force --path=demo/src/schematics/list --prefix=app
 --name=virtual-scroll-list --selectionMode=none --dataSource=serverSide --pagingMode=virtualScroll

ng g "./schematics/src/collection.json":list --lint-fix --force --path=demo/src/schematics/list --prefix=app
 --name=paginated-list --selectionMode=none --dataSource=serverSide --pagingMode=pagination
*/
import { Component } from "@angular/core";

import { SchematicsDocsComponentType, SchematicsDocsCliOptionComponent } from "../utils/schematic-docs-cli-option/schematic-docs-cli-option.component";
import { SchematicDocsPageComponent } from "../utils/schematic-docs-page/schematic-docs-page.component";
import { NuiTabsModule } from "../../../../src/lib/tabgroup/tabs.module";
import { SchematicsDocsCommandComponent } from "../utils/schematic-docs-command/schematic-docs-command.component";
import { SchematicDocsExampleComponent } from "../utils/schematic-docs-example/schematic-docs-example.component";
import { BasicListComponent } from "./basic-list/basic-list.component";
import { SelectionListComponent } from "./selection-list/selection-list.component";
import { SearchListComponent } from "./search-list/search-list.component";
import { PaginatedListComponent } from "./paginated-list/paginated-list.component";
import { NuiMessageModule } from "../../../../src/lib/message/message.module";
import { VirtualScrollListComponent } from "./virtual-scroll-list/virtual-scroll-list.component";

@Component({
    selector: "nui-list-schematics-docs-example",
    templateUrl: "list-schematic.example.component.html",
    providers: [
        {
            provide: SchematicsDocsComponentType,
            useValue: SchematicsDocsComponentType.list,
        },
    ],
    imports: [SchematicDocsPageComponent, SchematicsDocsCliOptionComponent, NuiTabsModule, SchematicsDocsCommandComponent, SchematicDocsExampleComponent, BasicListComponent, SelectionListComponent, SearchListComponent, PaginatedListComponent, NuiMessageModule, VirtualScrollListComponent]
})
export class ListSchematicExampleComponent {}
