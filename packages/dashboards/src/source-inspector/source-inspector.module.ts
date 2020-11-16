import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NuiDocsModule } from "@solarwinds/nova-bits";

import { SourceInspectorComponent } from "./source-inspector.component";

/** @ignore */
@NgModule({
    declarations: [
        SourceInspectorComponent,
    ],
    imports: [
        CommonModule,
        NuiDocsModule,
    ],
    exports: [
        SourceInspectorComponent,
    ],
})
export class SourceInspectorModule { }
