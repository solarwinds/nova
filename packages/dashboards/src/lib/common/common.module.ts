import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NuiImageModule } from "@solarwinds/nova-bits";

import { PreviewOverlayComponent } from "./components/preview-overlay/preview-overlay.component";
import { WidgetErrorComponent } from "./components/widget-error/widget-error.component";

const commonComponents = [
    PreviewOverlayComponent,
    WidgetErrorComponent,
];

@NgModule({
    imports: [
        CommonModule,
        NuiImageModule,
    ],
    declarations: commonComponents,
    exports: [
        CommonModule,
        ...commonComponents,
    ],
    entryComponents: commonComponents,
})
export class NuiDashboardsCommonModule {
}
