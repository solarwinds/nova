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

import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { Subject } from "rxjs";

import {
    DataSourceFeatures,
    EventBus,
    IDataSource,
    IEvent,
    IFilteringOutputs,
    IFilteringParticipants,
} from "@nova-ui/bits";

import { RiskScoreTileComponent } from "./risk-score-tile.component";
import { NuiDashboardsModule } from "../../dashboards.module";
import { DynamicComponentCreator } from "../../pizzagna/services/dynamic-component-creator.service";
import { PizzagnaService } from "../../pizzagna/services/pizzagna.service";
import { ProviderRegistryService } from "../../services/provider-registry.service";
import {
    DATA_SOURCE,
    PIZZAGNA_EVENT_BUS,
    WellKnownDataSourceFeatures,
} from "../../types";

class MockDataSource implements IDataSource {
    public outputsSubject = new Subject<IFilteringOutputs>();
    public filterParticipants: IFilteringParticipants;
    public features = new DataSourceFeatures({});

    public async applyFilters(): Promise<void> {
        // @ts-ignore: Suppressed for testing purposes
        return null;
    }

    public registerComponent(
        components: Partial<IFilteringParticipants>
    ): void {
        // @ts-ignore: Suppressed for testing purposes
        this.filterParticipants = components;
    }

    public deregisterComponent(componentKey: string) {
        delete this.filterParticipants?.[componentKey];
    }
}

describe("RiskScoreTileComponent", () => {
    let component: RiskScoreTileComponent;
    let fixture: ComponentFixture<RiskScoreTileComponent>;
    const eventBus = new EventBus<IEvent>();
    const dynamicComponentCreator = new DynamicComponentCreator();
    const pizzagnaService = new PizzagnaService(
        eventBus,
        dynamicComponentCreator
    );
    let dataSource: IDataSource;

    beforeEach(waitForAsync(() => {
        dataSource = new MockDataSource();

        TestBed.configureTestingModule({
            imports: [NuiDashboardsModule],
            providers: [
                ProviderRegistryService,
                {
                    provide: PIZZAGNA_EVENT_BUS,
                    useValue: eventBus,
                },
                {
                    provide: DATA_SOURCE,
                    useValue: dataSource,
                },
                {
                    provide: PizzagnaService,
                    useValue: pizzagnaService,
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RiskScoreTileComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should expose an accessible button and activate it with Enter and Space", () => {
        component.configuration = { interactive: true };
        component.widgetData = { value: 4, label: "Risk level" };
        fixture.detectChanges();

        const tile: HTMLElement = fixture.nativeElement.querySelector(
            ".nui-risk-score-tile-indicator"
        );
        expect(tile.getAttribute("role")).toBe("button");
        expect(tile.getAttribute("tabindex")).toBe("0");
        expect(tile.getAttribute("aria-label")).toBe("Risk level 4");

        const interactionSpy = spyOn(
            component,
            "onInteraction"
        ).and.callThrough();
        tile.dispatchEvent(
            new KeyboardEvent("keydown", {
                key: "Enter",
                bubbles: true,
                cancelable: true,
            })
        );
        expect(interactionSpy).toHaveBeenCalledTimes(1);

        const spaceEvent = new KeyboardEvent("keydown", {
            key: " ",
            bubbles: true,
            cancelable: true,
        });
        tile.dispatchEvent(spaceEvent);
        expect(interactionSpy).toHaveBeenCalledTimes(2);
        expect(spaceEvent.defaultPrevented).toBe(true);
    });

    it("should not add a non-interactive risk score tile to the tab order", () => {
        component.widgetData = { value: 4, label: "Risk level" };
        fixture.detectChanges();

        const tile: HTMLElement = fixture.nativeElement.querySelector(
            ".nui-risk-score-tile-indicator"
        );
        expect(tile.hasAttribute("role")).toBe(false);
        expect(tile.hasAttribute("tabindex")).toBe(false);
        expect(tile.hasAttribute("aria-label")).toBe(false);
    });

    it("should name a static-label tile using its displayed label", () => {
        component.configuration = { interactive: true };
        component.widgetData = {
            value: 4,
            label: "Risk level",
            useStaticLabel: true,
            staticLabel: "High",
        };
        fixture.detectChanges();
        const tile: HTMLElement = fixture.nativeElement.querySelector(
            ".nui-risk-score-tile-indicator"
        );
        expect(tile.getAttribute("aria-label")).toBe("Risk level High");
    });

    it("should preserve native links", () => {
        component.configuration = { interactive: true };
        component.widgetData = { value: 4, link: "https://example.com" };
        fixture.detectChanges();
        const tile: HTMLAnchorElement = fixture.nativeElement.querySelector(
            ".nui-risk-score-tile-indicator"
        );
        expect(tile.tagName).toBe("A");
        expect(tile.href).toBe("https://example.com/");
        expect(tile.hasAttribute("role")).toBe(false);
        expect(tile.hasAttribute("tabindex")).toBe(false);
    });

    it("should ignore repeated keys and keys from descendants", () => {
        component.configuration = { interactive: true };
        component.widgetData = { value: 4 };
        fixture.detectChanges();
        const tile: HTMLElement = fixture.nativeElement.querySelector(
            ".nui-risk-score-tile-indicator"
        );
        const interactionSpy = spyOn(component, "onInteraction");
        const repeat = new KeyboardEvent("keydown", {
            key: " ",
            repeat: true,
            bubbles: true,
            cancelable: true,
        });
        tile.dispatchEvent(repeat);
        tile.firstElementChild?.dispatchEvent(
            new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
        );
        expect(repeat.defaultPrevented).toBe(true);
        expect(interactionSpy).not.toHaveBeenCalled();
    });

    describe("interactive", () => {
        it("is interactive when datasource is interactive with data", () => {
            expect(component.interactive).toBeFalsy();

            dataSource.features = new DataSourceFeatures({
                [WellKnownDataSourceFeatures.Interactivity]: { enabled: true },
            });
            component.widgetData = { value: 0 };

            expect(component.interactive).toBe(true);
        });

        it("is interactive when configured as interactive with data", () => {
            expect(component.interactive).toBeFalsy();

            component.configuration = { interactive: true };
            component.widgetData = { value: 0 };

            expect(component.interactive).toBe(true);
        });

        it("is not interactive when datasource is interactive with no data", () => {
            expect(component.interactive).toBeFalsy();

            dataSource.features = new DataSourceFeatures({
                [WellKnownDataSourceFeatures.Interactivity]: { enabled: true },
            });

            expect(component.interactive).toBe(false);
        });

        it("is not interactive when configured as interactive with no data", () => {
            expect(component.interactive).toBeFalsy();

            component.configuration = { interactive: true };

            expect(component.interactive).toBe(false);
        });
    });
});
