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

@Component({
    selector: "schematics-docs-example",
    templateUrl: "./filtered-view-schematic.example.component.html",
})
export class FilteredViewSchematicExampleComponent {}
