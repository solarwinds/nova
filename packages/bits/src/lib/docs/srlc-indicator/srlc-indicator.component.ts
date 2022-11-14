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

import { Component, OnInit } from "@angular/core";
import { Router, RoutesRecognized } from "@angular/router";
import defaults from "lodash/defaults";
import { filter, map } from "rxjs/operators";

import { ISrlcDetails, SrlcStage } from "./public-api";

/** @ignore */
@Component({
    selector: "nui-srlc-indicator",
    templateUrl: "./srlc-indicator.component.html",
})
export class SrlcIndicatorComponent implements OnInit {
    constructor(private router: Router) {}

    public globalSrlc: ISrlcDetails = {
        stage: SrlcStage.preAlpha,
        eolDate: new Date("1/1/2100"),
        hideIndicator: false,
    };

    public componentSrlc: ISrlcDetails;

    public ngOnInit(): void {
        this.router.events
            .pipe(
                filter((event) => event instanceof RoutesRecognized),
                map((event) => {
                    let route = (<RoutesRecognized>event).state.root;
                    while (route.firstChild) {
                        route = route.firstChild;
                    }
                    return route;
                })
            )
            .subscribe((route) => {
                const routeDataSrlc = (route.data || {}).srlc;
                this.componentSrlc = defaults(
                    routeDataSrlc || {},
                    this.globalSrlc
                );
            });
    }

    public getMessageType = (): string => {
        switch (this.componentSrlc.stage) {
            case SrlcStage.preAlpha:
                return "critical";
            case SrlcStage.alpha:
                return "warning";
            case SrlcStage.beta:
                return "info";
            case SrlcStage.ga:
                return "ok";
            case SrlcStage.support:
                return "hint";
            case SrlcStage.eol:
                return "error";
            default:
                return "error";
        }
    };

    public getMessageText = (): string => {
        switch (this.componentSrlc.stage) {
            case SrlcStage.preAlpha:
                return `<strong>Under Development</strong> DO NOT USE. This component is under active development and significant,
                    API breaking changes are still expected. Its use will not be supported.`;
            case SrlcStage.alpha:
                // eslint-disable-next-line max-len
                return `<strong>Alpha</strong> USE AT YOUR OWN RISK. This component may be unstable, include defects and is still subject to API breaking changes.
                    We encourage prototypical use and feedback - but won't support production use.`;
            case SrlcStage.beta:
                return `<strong>Beta</strong> This component is in the final testing stage. It should be quite stable,
                    but some defects may still exist. Keep an eye on it!`;
            case SrlcStage.ga:
                return `<strong>Production Ready</strong> Available for production use - see documented examples below.`;
            case SrlcStage.support:
                return `<strong>Deprecated</strong> Sorry, but we no longer recommend using this component.
                    Only critical issues are going to be fixed.
                    End Of Life is scheduled to <strong>${this.componentSrlc.eolDate?.toDateString()}</strong>.`;
            case SrlcStage.eol:
                return `<strong>Not Supported</strong> Sorry, but this component is not supported any more!`;
            default:
                return `Current state of this component is unknown. Please, contact Nova team for more details.`;
        }
    };
}
