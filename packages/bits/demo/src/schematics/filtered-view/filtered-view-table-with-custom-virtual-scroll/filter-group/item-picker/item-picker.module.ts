import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { ItemPickerComponent } from "./item-picker.component";

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        ItemPickerComponent,
    ],
    exports: [
        ItemPickerComponent,
    ],
    providers: [],
})

export class ItemPickerModule {}
