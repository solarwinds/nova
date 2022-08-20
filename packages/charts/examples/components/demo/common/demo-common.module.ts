import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { ChartsTestHarnessComponent } from "./charts-test-harness.component";

@NgModule({
    declarations: [ChartsTestHarnessComponent],
    imports: [FormsModule, CommonModule],
    exports: [ChartsTestHarnessComponent, CommonModule],
})
export class DemoCommonModule {}
