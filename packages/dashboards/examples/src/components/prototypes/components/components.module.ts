import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { NuiCheckboxModule, NuiFormFieldModule, NuiIconModule, NuiSelectV2Module, NuiValidationMessageModule } from "@solarwinds/nova-bits";
import { NuiDashboardConfiguratorModule } from "@solarwinds/nova-dashboards";

import { AcmeProportionalDSConfigComponent } from "./data-source-configuration/proportional-ds-config.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NuiDashboardConfiguratorModule,
        NuiCheckboxModule,
        NuiIconModule,
        NuiFormFieldModule,
        NuiSelectV2Module,
        NuiValidationMessageModule,
    ],
    declarations: [
        AcmeProportionalDSConfigComponent,
    ],
    entryComponents: [
        AcmeProportionalDSConfigComponent,
    ],
})
export class AcmeComponentsModule { }
