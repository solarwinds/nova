// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { Component, NgZone } from "@angular/core";
import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import {Router, RouterModule, Routes} from "@angular/router";

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
            imports: [RouterModule.forRoot(routes)],
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
