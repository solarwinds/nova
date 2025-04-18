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

ng g "./schematics/src/collection.json":filtered-view --lint-fix --force --path=demo/src/schematics/filtered-view --prefix=app
 --name=filtered-view-with-list --presentationType=list --dataSource=none --pagingMode=pagination --selectionMode=none

ng g "./schematics/src/collection.json":filtered-view --lint-fix --force --path=demo/src/schematics/filtered-view --prefix=app
 --name=filtered-view-list-with-pagination --presentationType=list --dataSource=serverSide --pagingMode=pagination --selectionMode=none

ng g "./schematics/src/collection.json":filtered-view --lint-fix --force --path=demo/src/schematics/filtered-view --prefix=app --pagingMode=virtualScroll
 --name=filtered-view-list-with-virtual-scroll --presentationType=list --dataSource=serverSide --selectionMode=none

ng g "./schematics/src/collection.json":filtered-view --lint-fix --force --path=demo/src/schematics/filtered-view --prefix=app --pagingMode=pagination
 --name=filtered-view-with-table --presentationType=table --dataSource=none --enableSort=false --enableSearch=false --selectionMode=none

ng g "./schematics/src/collection.json":filtered-view --lint-fix --force --path=demo/src/schematics/filtered-view --prefix=app --pagingMode=pagination \
 --name=filtered-view-table-with-pagination --presentationType=table --dataSource=serverSide --enableSort=false --enableSearch=false --selectionMode=none

ng g "./schematics/src/collection.json":filtered-view --lint-fix --force --path=demo/src/schematics/filtered-view --prefix=app --presentationType=table
--name=filtered-view-table-with-selection --dataSource=serverSide --pagingMode=pagination --selectionMode=multi

ng g "./schematics/src/collection.json":filtered-view --lint-fix --force --path=demo/src/schematics/filtered-view --prefix=app --pagingMode=virtualScroll
 --name=filtered-view-table-with-virtual-scroll --presentationType=table --dataSource=serverSide --enableSort=false --enableSearch=false --selectionMode=none

ng g "./schematics/src/collection.json":filtered-view --lint-fix --force --path=demo/src/schematics/filtered-view --prefix=app --pagingMode=virtualScroll
--name=filtered-view-table-with-virtual-scroll-selection --presentationType=table --dataSource=serverSide --enableSort=false --enableSearch=false
--selectionMode=multi

ng g "./schematics/src/collection.json":filtered-view --lint-fix --force --path=demo/src/schematics/filtered-view --prefix=app --pagingMode=virtualScroll
--name=filtered-view-table-with-virtual-scroll-selection --presentationType=table --dataSource=serverSide --enableSort=false --enableSearch=false
--selectionMode=multi


ng g "./schematics/src/collection.json":filtered-view --lint-fix --force --path=demo/src/schematics/filtered-view --prefix=app --pagingMode=virtualScroll
 --name=filtered-view-table-with-custom-virtual-scroll --presentationType=table --dataSource=serverSide  --enableSort=false --enableSearch=false
 --virtualScrollStrategy=custom --selectionMode=none
*/
import { Component } from "@angular/core";
import { SchematicDocsPageComponent } from "../utils/schematic-docs-page/schematic-docs-page.component";
import { SchematicsDocsCliOptionComponent } from "../utils/schematic-docs-cli-option/schematic-docs-cli-option.component";
import { NuiTabsModule } from "../../../../src/lib/tabgroup/tabs.module";
import { SchematicsDocsCommandComponent } from "../utils/schematic-docs-command/schematic-docs-command.component";
import { SchematicDocsExampleComponent } from "../utils/schematic-docs-example/schematic-docs-example.component";
import { FilteredViewWithListComponent } from "./filtered-view-with-list/filtered-view-with-list.component";
import { FilteredViewListWithPaginationComponent } from "./filtered-view-list-with-pagination/filtered-view-list-with-pagination.component";
import { FilteredViewListWithVirtualScrollComponent } from "./filtered-view-list-with-virtual-scroll/filtered-view-list-with-virtual-scroll.component";
import { FilteredViewWithTableComponent } from "./filtered-view-with-table/filtered-view-with-table.component";
import { FilteredViewTableWithPaginationComponent } from "./filtered-view-table-with-pagination/filtered-view-table-with-pagination.component";
import { FilteredViewTableWithSelectionComponent } from "./filtered-view-table-with-selection/filtered-view-table-with-selection.component";
import { NgIf } from "@angular/common";
import { FilteredViewTableWithVirtualScrollComponent } from "./filtered-view-table-with-virtual-scroll/filtered-view-table-with-virtual-scroll.component";
import { FilteredViewTableWithVirtualScrollSelectionComponent } from "./filtered-view-table-with-virtual-scroll-selection/filtered-view-table-with-virtual-scroll-selection.component";
import { FilteredViewTableWithCustomVirtualScrollComponent } from "./filtered-view-table-with-custom-virtual-scroll/filtered-view-table-with-custom-virtual-scroll.component";
import { FilteredViewWithTreeComponent } from "./filtered-view-with-tree/filtered-view-with-tree.component";

@Component({
    selector: "schematics-docs-example",
    templateUrl: "./filtered-view-schematic.example.component.html",
    imports: [SchematicDocsPageComponent, SchematicsDocsCliOptionComponent, NuiTabsModule, SchematicsDocsCommandComponent, SchematicDocsExampleComponent, FilteredViewWithListComponent, FilteredViewListWithPaginationComponent, FilteredViewListWithVirtualScrollComponent, FilteredViewWithTableComponent, FilteredViewTableWithPaginationComponent, FilteredViewTableWithSelectionComponent, NgIf, FilteredViewTableWithVirtualScrollComponent, FilteredViewTableWithVirtualScrollSelectionComponent, FilteredViewTableWithCustomVirtualScrollComponent, FilteredViewWithTreeComponent]
})
export class FilteredViewSchematicExampleComponent {}
