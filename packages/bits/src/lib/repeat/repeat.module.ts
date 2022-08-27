import { DragDropModule } from "@angular/cdk/drag-drop";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";
import { NuiCheckboxModule } from "../checkbox/checkbox.module";
import { NuiRadioModule } from "../radio/radio.module";
import { RepeatItemComponent } from "./repeat-item/repeat-item.component";
import { RepeatComponent } from "./repeat.component";

/**
 * @ignore
 */
@NgModule({
    imports: [
        NuiCommonModule,
        NuiCheckboxModule,
        NuiRadioModule,
        ScrollingModule,
        DragDropModule,
    ],
    declarations: [RepeatComponent, RepeatItemComponent],
    exports: [RepeatComponent, RepeatItemComponent],
    providers: [],
})
export class NuiRepeatModule {}
