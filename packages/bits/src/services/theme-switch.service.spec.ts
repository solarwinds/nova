import { Component, NgZone } from "@angular/core";
import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { Router, Routes } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";

import { ThemeSwitchService } from "./theme-switch.service";

@Component({
    template: "",
})
class FakeComponent {
    constructor(private zone: NgZone, private router: Router) {}

    public navigate(commands: any[]) {
        this.zone.run(async () => this.router.navigate(commands));
    }
}

const routes: Routes = [
    {
        path: "route/with/allowed/theme/switcher",
        component: FakeComponent,
        data: { showThemeSwitcher: true },
    },
    { path: "route/with/denied/theme/switcher", component: FakeComponent },
];

describe("ThemeSwitchService", () => {
    let fakeComponent: FakeComponent;
    let service: ThemeSwitchService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes(routes)],
            declarations: [FakeComponent],
        });

        const fixture = TestBed.createComponent(FakeComponent);

        fakeComponent = fixture.componentInstance;
        service = TestBed.inject(ThemeSwitchService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should allow to show theme switcher when route has appropriate data", fakeAsync(() => {
        fakeComponent.navigate([
            "route",
            "with",
            "allowed",
            "theme",
            "switcher",
        ]);
        tick();
        expect(service.showThemeSwitcherSubject.getValue()).toBeTruthy();
    }));

    it("should deny to show theme switcher when route has not appropriate data", fakeAsync(() => {
        fakeComponent.navigate([
            "route",
            "with",
            "denied",
            "theme",
            "switcher",
        ]);
        tick();
        expect(service.showThemeSwitcherSubject.getValue()).toBeFalsy();
    }));

    it("should be applied system theme by default", fakeAsync(() => {
        const isDarkModeEnabled = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;
        fakeComponent.navigate([
            "route",
            "with",
            "allowed",
            "theme",
            "switcher",
        ]);
        tick();
        expect(service.isDarkModeEnabledSubject.getValue()).toEqual(
            isDarkModeEnabled
        );
    }));

    it("should be dark mode when method setDarkTheme was called with true parameter", fakeAsync(() => {
        service.setDarkTheme(true);
        tick();
        expect(service.isDarkModeEnabledSubject.getValue()).toBeTruthy();
    }));

    it("should be light mode when method setDarkTheme was called with false parameter", fakeAsync(() => {
        service.setDarkTheme(false);
        tick();
        expect(service.isDarkModeEnabledSubject.getValue()).toBeFalsy();
    }));
});
