import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";
import { NuiIconModule } from "../icon/icon.module";
import { NuiTooltipModule } from "../tooltip/tooltip.module";
import { ChipComponent } from "./chip/chip.component";
import { ChipsOverflowComponent } from "./chips-overflow/chips-overflow.component";
import { ChipsComponent } from "./chips.component";

/**
 * @ignore
 */
@NgModule({
    imports: [NuiCommonModule, NuiIconModule, NuiTooltipModule],
    declarations: [ChipComponent, ChipsComponent, ChipsOverflowComponent],
    exports: [ChipComponent, ChipsComponent, ChipsOverflowComponent],
    providers: [],
})
export class NuiChipsModule {}
