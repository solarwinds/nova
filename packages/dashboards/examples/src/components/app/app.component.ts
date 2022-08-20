import { Component, ViewEncapsulation } from "@angular/core";
import { ThemeSwitchService } from "@nova-ui/bits";

@Component({
    selector: "nui-dashboards-example-app",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
    constructor(public themeSwitcher: ThemeSwitchService) {}
}
