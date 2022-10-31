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
