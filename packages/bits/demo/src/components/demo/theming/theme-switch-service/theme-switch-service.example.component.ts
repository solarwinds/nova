import { Component, OnDestroy, OnInit } from "@angular/core";
import { ThemeSwitchService } from "@nova-ui/bits";

@Component({
    selector: "theme-switch-service-example",
    templateUrl: "./theme-switch-service.example.component.html",
})
export class ThemeSwitchServiceExampleComponent implements OnInit, OnDestroy {
    // Inject the service
    constructor(public themeSwitchService: ThemeSwitchService) {}

    public ngOnInit() {
        // Configure the service to listen for changes to the system color scheme preference.
        // If the user already has dark mode enabled, the service will set the theme as soon
        // as this method is called.
        this.themeSwitchService.enableColorSchemePreferenceHandling();
    }

    public ngOnDestroy() {
        // Switch back to the default theme
        this.themeSwitchService.setDarkTheme(false);
        // Stop the service from listening for changes to the system color scheme preference.
        this.themeSwitchService.disableColorSchemePreferenceHandling();
    }
}
