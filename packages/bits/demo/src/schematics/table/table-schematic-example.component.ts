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
})
export class TableSchematicExampleComponent {}
