import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { NuiRepeatModule } from "@nova-ui/bits";

import { ItemPickerCompositeComponent } from "./item-picker.component";

@NgModule({
    imports: [CommonModule, NuiRepeatModule],
    declarations: [ItemPickerCompositeComponent],
    exports: [ItemPickerCompositeComponent],
    providers: [],
})
export class ItemPickerCompositeModule {}
