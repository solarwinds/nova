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
import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
    waitForAsync,
} from "@angular/core/testing";
import { Router, RouterModule, Routes } from "@angular/router";

import { ThemeSwitcherComponent } from "./theme-switcher.component";
import { SwitchComponent } from "../../switch/switch.component";

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
];

describe("ThemeSwitcherComponent", () => {
    let component: ThemeSwitcherComponent;
    let fakeComponent: FakeComponent;
    let fixture: ComponentFixture<ThemeSwitcherComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [SwitchComponent, ThemeSwitcherComponent],
            imports: [RouterModule.forRoot(routes)],
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ThemeSwitcherComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        const fixtureFake = TestBed.createComponent(FakeComponent);

        fakeComponent = fixtureFake.componentInstance;
    });
    beforeEach(fakeAsync(() => {
        fakeComponent.navigate([
            "route",
            "with",
            "allowed",
            "theme",
            "switcher",
        ]);
        tick();
    }));

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should be default mode like in operation system", () => {
        const isDarkModeEnabled = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;
        expect(
            (<Array<string>>(
                [].slice.apply(document.children[0].classList)
            )).includes("dark-nova-theme")
        ).toBe(isDarkModeEnabled);
    });

    it("should be dark mode when method onThemeChange is called with true parameter", () => {
        component.onThemeChange(true);
        fixture.detectChanges();
        expect(
            (<Array<string>>(
                [].slice.apply(document.children[0].classList)
            )).includes("dark-nova-theme")
        ).toBeTruthy();
    });

    it("should be light mode when method onThemeChange is called with false parameter", () => {
        component.onThemeChange(false);
        fixture.detectChanges();
        expect(
            (<Array<string>>(
                [].slice.apply(document.children[0].classList)
            )).includes("dark-nova-theme")
        ).toBeFalsy();
    });
});
