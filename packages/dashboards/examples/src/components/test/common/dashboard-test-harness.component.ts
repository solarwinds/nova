import { Component, EventEmitter, Input, Output } from "@angular/core";

import { ThemeSwitchService } from "@nova-ui/bits";

@Component({
    selector: "dashboard-test-harness",
    templateUrl: "./dashboard-test-harness.component.html",
    host: { class: "dashboard-test-harness" },
})
export class DashboardTestHarnessComponent {
    constructor(public themeSwitcher: ThemeSwitchService) {}

    @Input() public editMode: boolean;
    @Input() public dsError: boolean;

    @Output() public editModeChange: EventEmitter<boolean> =
        new EventEmitter<boolean>();
    @Output() public dsErrorChange: EventEmitter<boolean> =
        new EventEmitter<boolean>();
}
