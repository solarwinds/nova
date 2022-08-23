import { Component, ViewEncapsulation } from "@angular/core";

import { ThemeSwitchService } from "../../../../src/services/theme-switch.service";

@Component({
    selector: "nui-app",
    templateUrl: "app.component.html",
    styleUrls: ["app.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
    constructor(public themeSwitcherService: ThemeSwitchService) {}
}
