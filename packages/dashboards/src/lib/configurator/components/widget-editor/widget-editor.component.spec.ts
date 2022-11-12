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

import {
    ChangeDetectorRef,
    TRANSLATIONS,
    TRANSLATIONS_FORMAT,
} from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";
import set from "lodash/set";
import { Subject } from "rxjs";

import {
    EventBus,
    IEvent,
    LoggerService,
    NuiBusyModule,
    NuiButtonModule,
    NuiIconModule,
    NuiSpinnerModule,
} from "@nova-ui/bits";

import { TemplateLoadErrorComponent } from "../../../components/template-load-error/template-load-error.component";
import { IWidget } from "../../../components/widget/types";
import { mockLoggerService } from "../../../mocks";
import { NuiPizzagnaModule } from "../../../pizzagna/pizzagna.module";
import { ProviderRegistryService } from "../../../services/provider-registry.service";
import { PizzagnaLayer } from "../../../types";
import { PreviewService } from "../../services/preview.service";
import { ConfiguratorHeadingService } from "../../services/public-api";
import { ConfiguratorComponent } from "../configurator/configurator.component";
import { ConfiguratorHeadingComponent } from "../heading/configurator-heading.component";
import { DashwizStepComponent } from "../wizard/dashwiz-step/dashwiz-step.component";
import { DashwizButtonsComponent } from "../wizard/dashwiz/dashwiz-buttons.component";
import { DashwizComponent } from "../wizard/dashwiz/dashwiz.component";
import { WidgetEditorComponent } from "./widget-editor.component";

class MockConfiguratorComponent {
    public submitError = new Subject<void>();
    public previewWidget: Partial<IWidget> = {
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                header: {
                    properties: {
                        title: "",
                    },
                },
            },
        },
    };

    public updateWidget(previewWidget: IWidget) {
        this.previewWidget = previewWidget;
    }
}

describe("WidgetEditorComponent", () => {
    let component: WidgetEditorComponent;
    let fixture: ComponentFixture<WidgetEditorComponent>;
    let previewService: PreviewService;

    beforeEach(waitForAsync(() => {
        previewService = new PreviewService();

        TestBed.configureTestingModule({
            declarations: [
                ConfiguratorHeadingComponent,
                DashwizComponent,
                DashwizButtonsComponent,
                DashwizStepComponent,
                WidgetEditorComponent,
                TemplateLoadErrorComponent,
            ],
            imports: [
                ReactiveFormsModule,
                NuiButtonModule,
                NuiBusyModule,
                NuiIconModule,
                NuiPizzagnaModule,
                NuiSpinnerModule,
            ],
            providers: [
                ChangeDetectorRef,
                ConfiguratorHeadingService,
                ProviderRegistryService,
                { provide: PreviewService, useValue: previewService },
                { provide: TRANSLATIONS_FORMAT, useValue: "xlf" },
                { provide: TRANSLATIONS, useValue: "" },
                {
                    provide: ConfiguratorComponent,
                    useClass: MockConfiguratorComponent,
                },
                {
                    provide: LoggerService,
                    useValue: mockLoggerService,
                },
            ],
        })
            .overrideModule(BrowserDynamicTestingModule, {
                set: {
                    entryComponents: [
                        DashwizButtonsComponent,
                        TemplateLoadErrorComponent,
                    ],
                },
            })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WidgetEditorComponent);
        component = fixture.componentInstance;
        component.formPizzagnaComponent = {
            eventBus: new EventBus<IEvent>(),
        } as any;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should update the widget title when the preview changes", () => {
        const testTitle = "Test Title";
        previewService.preview = set(
            previewService.preview,
            WidgetEditorComponent.TITLE_PATH,
            testTitle
        );
        expect(component.configuratorTitle).toContain(testTitle);
    });
});
