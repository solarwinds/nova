import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormBuilder } from "@angular/forms";
import { ConfiguratorHeadingService } from "src/lib/configurator/services/configurator-heading.service";
import { LinkConfiguratorComponent } from "./link-configurator.component";

describe("LinkConfiguratorComponent", () => {
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

    it("Creates target component", () => {
        component.initForm();
        const targetControl = component.form.controls['target'];
        expect(targetControl).toBeTruthy();
    });
});
