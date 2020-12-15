import { Component, OnDestroy } from "@angular/core";
import { ThemeSwitchService } from "@nova-ui/bits";

@Component({
    selector: "charts-test-harness",
    templateUrl: "./charts-test-harness.component.html",
    host: { class: "charts-test-harness" },
})
export class ChartsTestHarnessComponent implements OnDestroy {
    public originalWithRefreshRoute: boolean;

    constructor(public themeSwitcher: ThemeSwitchService) {
        // disable route refreshing because the theme service currently always reverts to
        // the light theme on route refresh unless route.data.showThemeSwitcher is 'true'
        this.originalWithRefreshRoute = this.themeSwitcher.withRefreshRoute;
        this.themeSwitcher.withRefreshRoute = false;
    }

    public ngOnDestroy() {
        this.themeSwitcher.withRefreshRoute = this.originalWithRefreshRoute;
    }
}
