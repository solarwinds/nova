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

import { SimpleChange } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { NuiDashboardsModule } from "../../dashboards.module";
import { ProviderRegistryService } from "../../services/provider-registry.service";
import { DEFAULT_PIZZAGNA_ROOT } from "../../services/types";
import { StackComponent } from "../layouts/stack/stack.component";
import { WidgetComponent } from "./widget.component";

describe("WidgetComponent", () => {
    let component: WidgetComponent;
    let fixture: ComponentFixture<WidgetComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NuiDashboardsModule],
            providers: [ProviderRegistryService],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WidgetComponent);
        component = fixture.componentInstance;
        component.widget = {
            id: "id",
            type: "kpi",
            pizzagna: {
                structure: {
                    [DEFAULT_PIZZAGNA_ROOT]: {
                        componentType: StackComponent.lateLoadKey,
                    },
                },
            },
        };
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("ngOnChanges > ", () => {
        it("should not invoke widgetConfigurationService.updateWidget if the widget input hasn't changed", () => {
            spyOn((<any>component).widgetConfigurationService, "updateWidget");
            component.ngOnChanges({
                test: new SimpleChange(null, null, false),
            });
            expect(
                (<any>component).widgetConfigurationService.updateWidget
            ).not.toHaveBeenCalled();
        });

        it("should invoke widgetConfigurationService.updateWidget if the widget input changes", () => {
            spyOn((<any>component).widgetConfigurationService, "updateWidget");
            component.ngOnChanges({
                widget: new SimpleChange(null, null, false),
            });
            expect(
                (<any>component).widgetConfigurationService.updateWidget
            ).toHaveBeenCalledWith(component.widget);
        });
    });

    describe("onPizzagnaChange > ", () => {
        it("should emit widgetChange output", () => {
            const pizzagna = { test: {} };
            spyOn(component.widgetChange, "emit");
            component.onPizzagnaChange(pizzagna);
            expect(component.widgetChange.emit).toHaveBeenCalledWith({
                ...component.widget,
                pizzagna,
            });
        });
    });
});
