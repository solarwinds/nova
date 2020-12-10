import { Component, ViewEncapsulation } from "@angular/core";
import { ThemeSwitchService } from "@nova-ui/bits";

@Component({
    selector: "nui-charts-app",
    templateUrl: "app.component.html",
    styleUrls: ["app.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
    constructor(public themeSwitcherService: ThemeSwitchService) {
        this.themeSwitcherService.withRefreshRoute = true;
    }
}
