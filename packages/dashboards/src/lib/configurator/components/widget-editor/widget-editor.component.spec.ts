import {
    ChangeDetectorRef,
    TRANSLATIONS,
    TRANSLATIONS_FORMAT,
} from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";
import {
    EventBus,
    IEvent,
    LoggerService,
    NuiBusyModule,
    NuiButtonModule,
    NuiIconModule,
    NuiSpinnerModule,
} from "@nova-ui/bits";
import set from "lodash/set";
import { Subject } from "rxjs";

import { TemplateLoadErrorComponent } from "../../../components/template-load-error/template-load-error.component";
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
import { IWidget } from "../../../components/widget/types";

import { WidgetEditorComponent } from "./widget-editor.component";

class MockConfiguratorComponent {
    public submitError = new Subject();
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
