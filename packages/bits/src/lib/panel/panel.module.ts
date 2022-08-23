import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";
import { NuiButtonModule } from "../button/button.module";
import { PanelComponent } from "./panel.component";

/**
 * @ignore
 */
@NgModule({
    imports: [NuiCommonModule, NuiButtonModule],
    declarations: [PanelComponent],
    exports: [PanelComponent],
    providers: [],
})
export class NuiPanelModule {}
