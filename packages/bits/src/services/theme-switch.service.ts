import { DOCUMENT } from "@angular/common";
import { Inject, Injectable, Renderer2, RendererFactory2 } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { filter, map } from "rxjs/operators";

/** @dynamic */
@Injectable({
    providedIn: "root",
})
export class ThemeSwitchService {
    /** @ignore BehaviorSubject indicating whether we should display theme switcher */
    public showThemeSwitcherSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    /** BehaviorSubject indicating whether dark mode is enabled */
    public isDarkModeEnabledSubject: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(null);

    /** Should route be refreshed after theme switching */
    public withRefreshRoute: boolean = false;

    /** Keep information about preferred dark color scheme on OS */
    private darkThemePreference: MediaQueryList;

    private renderer: Renderer2;

    constructor(
        private rendererFactory: RendererFactory2,
        private router: Router,
        private _route: ActivatedRoute,
        @Inject(DOCUMENT) private document: Document
    ) {
        /** Getting renderer instance */
        this.renderer = this.rendererFactory.createRenderer(null, null);

        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            map(() => {
                let route = this._route.root;
                while (route.firstChild) {
                    route = route.firstChild;
                }
                return route;
            })
        )
            .subscribe(route => {
                const showThemeSwitcher = (route.snapshot.data || {}).showThemeSwitcher;

                this.showThemeSwitcherSubject.next(showThemeSwitcher);

                if (showThemeSwitcher) {
                    /** Case when route is changed on the same page (see on breadcrumb component docs page) */
                    if (typeof this.isDarkModeEnabledSubject.getValue() === "boolean") {
                        this.darkThemePreference = window.matchMedia("(prefers-color-scheme: dark)");
                        return;
                    }

                    this.enableColorSchemePreferenceHandling();
                } else {
                    /** Reset to light theme */
                    this.darkModePreferenceHandler(false);

                    this.disableColorSchemePreferenceHandling();
                }
            });
    }

    /**
     * Use this method to manually toggle your app between light and dark theme
     *
     * @param isDarkModeEnabled Use true for dark theme and false for light theme
     */
    public setDarkTheme(isDarkModeEnabled: boolean): void {
        this.darkModePreferenceHandler(isDarkModeEnabled);
    }

    /**
     * Use this method to configure the service to synchronize your app's theme with the user's
     * light/dark mode system preference
     */
    public enableColorSchemePreferenceHandling() {
        this.darkThemePreference = window.matchMedia("(prefers-color-scheme: dark)");

        /** First call to set initial theme */
        this.darkModePreferenceHandler(this.darkThemePreference.matches);

        /** If browser supports subscribing to MediaQueryList event we do it */
        if (typeof this.darkThemePreference.addEventListener === "function") {
            this.darkThemePreference.addEventListener("change", this.darkModePreferenceHandler);
        }
    }

    /**
     * Use this method to disable synchronization of your app's theme with the user's light/dark mode
     * system preference
     */
    public disableColorSchemePreferenceHandling() {
        if (this.darkThemePreference && typeof this.darkThemePreference.removeEventListener === "function") {
            this.darkThemePreference.removeEventListener("change", this.darkModePreferenceHandler);
        }
    }

    private darkModePreferenceHandler = (event: MediaQueryListEvent | boolean) => {
        const isDarkModeEnabled = typeof event === "boolean" ? event : event.matches;
        const isDarkPrevColorMode = this.isDarkModeEnabledSubject.getValue();
        const demoContainerElement = this.document.children[0];

        /** Adding class "dark-nova-theme" to html element we make dark mode, otherwise - light mode */
        this.renderer[isDarkModeEnabled ? "addClass" : "removeClass"](demoContainerElement, "dark-nova-theme");

        /**
         * Reiniting route in case when theme is switching forced
         * It allows to avoid reiniting route while application is started
         */
        if (isDarkPrevColorMode !== null && isDarkPrevColorMode !== isDarkModeEnabled && this.withRefreshRoute) {
            this.reInitRoute();
        }

        this.isDarkModeEnabledSubject.next(isDarkModeEnabled);
    }

    private reInitRoute() {
        /**
         * Logic for refreshing route
         */
        const scrolledElement = this.document.children[0];
        const currentScrollTopPosition = scrolledElement.scrollTop;
        const originalShouldReuseRoute = this.router.routeReuseStrategy.shouldReuseRoute;

        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.navigated = false;

        this.router.navigate([this.router.url]).then(() => {
            this.router.routeReuseStrategy.shouldReuseRoute = originalShouldReuseRoute;

            /** After reiniting route we should restore scroll position */
            setTimeout(() => scrolledElement.scrollTop = currentScrollTopPosition);
        });
    }
}

export default ThemeSwitchService;
