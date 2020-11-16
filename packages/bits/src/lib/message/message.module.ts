import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";
import { NuiButtonModule } from "../../lib/button/button.module";
import { NuiIconModule } from "../../lib/icon/icon.module";

import { MessageComponent } from "./message.component";

/**
 * @ignore
 */
@NgModule({
    declarations: [ MessageComponent ],
    imports: [
        NuiCommonModule,
        NuiIconModule,
        NuiButtonModule,
    ],
    exports: [
        MessageComponent,
    ],
    providers: [],
})
export class NuiMessageModule {}
