import { NgModule } from "@angular/core";

import { NuiCommonModule } from "@nova-ui/bits";

import { FileDropExampleComponent } from "./file-drop.component";


/**
 * @ignore
 */
@NgModule({
    imports: [
        NuiCommonModule,
    ],
    declarations: [
        FileDropExampleComponent,
    ],
    exports: [
        FileDropExampleComponent,
    ],
    providers: [],
})
export class NuiFileDropExampleModule {
}
