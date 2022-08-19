import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormBuilder } from "@angular/forms";

import { ConfiguratorHeadingService, LinkConfiguratorComponent } from "@nova-ui/dashboards";

describe(LinkConfiguratorComponent.name, () => {
    let component: LinkConfiguratorComponent;
    let fixture: ComponentFixture<LinkConfiguratorComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                LinkConfiguratorComponent,
            ],
            imports: [],
            providers: [
                ConfiguratorHeadingService,
                FormBuilder,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(LinkConfiguratorComponent);
        component = fixture.componentInstance;
    }));

    it("Creates targetSelf component", () => {
        component.initForm();
        const targetControl = component.form.controls["targetSelf"];
        expect(targetControl).toBeTruthy();
    });
});
