import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NuiImageModule } from "@nova-ui/bits";

import { PreviewOverlayComponent } from "./components/preview-overlay/preview-overlay.component";
import { WidgetErrorComponent } from "./components/widget-error/widget-error.component";
import { DashboardUnitConversionPipe } from "./pipes/dashboard-unit-conversion-pipe";

const commonComponents = [
    PreviewOverlayComponent,
    WidgetErrorComponent,
];

@NgModule({
    imports: [
        CommonModule,
        NuiImageModule,
    ],
    declarations: [
        DashboardUnitConversionPipe,
        ...commonComponents,
    ],
    exports: [
        CommonModule,
        DashboardUnitConversionPipe,
        ...commonComponents,
    ],
    entryComponents: commonComponents,
})
export class NuiDashboardsCommonModule {
}
