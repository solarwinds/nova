import { Component } from "@angular/core";

import {ThemeSwitchService} from "../../../services/theme-switch.service";

/**
 * @ignore
 */
@Component({
    selector: "nui-theme-switcher",
    templateUrl: "./theme-switcher.component.html",
})
export class ThemeSwitcherComponent {

    constructor(public themeSwitcherService: ThemeSwitchService) { }

    onThemeChange(isDarkThemeEnabled: boolean): void {
        this.themeSwitcherService.setDarkTheme(isDarkThemeEnabled);
    }
}
