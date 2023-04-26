import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { FreetypeQueryComponent } from "./freetype-query-builder.component";
import { FreeTypeQueryUtilsService } from "./helpers/freetype-query-utils.service";
import { windowProvider, WindowToken } from "./helpers/window";
import { TextHighlightOverlayComponent } from "./text-highlight-overlay/text-highlight-overlay-component";
import { NuiCommonModule } from "../../common/common.module";
import { NuiDividerModule } from "../divider/divider.module";
import { NuiFormFieldModule } from "../form-field/form-field.module";
import { NuiIconModule } from "../icon/icon.module";
import { NuiMenuModule } from "../menu/menu.module";
import { NuiPopupModule } from "../popup/popup.module";
import { NuiSelectV2Module } from "../select-v2/select-v2.module";
import { NuiToastModule } from "../toast/toast.module";

@NgModule({
    declarations: [FreetypeQueryComponent, TextHighlightOverlayComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NuiCommonModule,
        NuiFormFieldModule,
        NuiToastModule,
        NuiDividerModule,
        NuiIconModule,
        NuiMenuModule,
        NuiPopupModule,
        NuiSelectV2Module,
    ],
    providers: [
        FreeTypeQueryUtilsService,
        { provide: WindowToken, useFactory: windowProvider },
    ],
    exports: [FreetypeQueryComponent, TextHighlightOverlayComponent],
})
export class NuiFreetypeQueryModule {}
