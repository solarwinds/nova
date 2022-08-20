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

import { SchematicsDocsComponentType } from "../utils/schematic-docs-cli-option/schematic-docs-cli-option.component";

@Component({
    selector: "nui-list-schematics-docs-example",
    templateUrl: "list-schematic.example.component.html",
    providers: [
        {
            provide: SchematicsDocsComponentType,
            useValue: SchematicsDocsComponentType.list,
        },
    ],
})
export class ListSchematicExampleComponent {}
