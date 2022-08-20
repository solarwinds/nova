import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { DashboardTestHarnessComponent } from "./dashboard-test-harness.component";

@NgModule({
    declarations: [DashboardTestHarnessComponent],
    imports: [CommonModule, FormsModule],
    exports: [DashboardTestHarnessComponent, CommonModule],
})
export class TestCommonModule {}
