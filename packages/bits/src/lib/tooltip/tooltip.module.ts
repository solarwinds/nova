import { A11yModule } from "@angular/cdk/a11y";
import { OverlayModule } from "@angular/cdk/overlay";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { NuiOverlayModule } from "../overlay/overlay.module";

import { TooltipComponent } from "./tooltip.component";
import { TooltipDirective } from "./tooltip.directive";

/** @ignore */
@NgModule({
  imports: [
    A11yModule,
    CommonModule,
    OverlayModule,
    NuiOverlayModule,
  ],
  exports: [TooltipDirective, TooltipComponent],
  declarations: [TooltipDirective, TooltipComponent],
  entryComponents: [TooltipComponent],
})
export class NuiTooltipModule {}
