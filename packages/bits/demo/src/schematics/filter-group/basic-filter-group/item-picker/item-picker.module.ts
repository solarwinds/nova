import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { ItemPickerCompositeComponent } from "./item-picker.component";

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        ItemPickerCompositeComponent,
    ],
    exports: [
        ItemPickerCompositeComponent,
    ],
    providers: [],
})

export class ItemPickerCompositeModule {}
