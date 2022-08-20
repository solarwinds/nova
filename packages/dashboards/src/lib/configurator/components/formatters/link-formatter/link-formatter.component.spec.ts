import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { LinkFormatterComponent } from "./link-formatter.component";

describe(LinkFormatterComponent.name, () => {
    let component: LinkFormatterComponent;
    let fixture: ComponentFixture<LinkFormatterComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [LinkFormatterComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LinkFormatterComponent);
        component = fixture.componentInstance;
        component.data = {
            link: "http://some.fake/link",
            value: "text",
        };
    });

    const getLink = (): DebugElement | null =>
        fixture.debugElement.query(By.css("a"));

    const assertLinkTarget = (expectedTarget: string) => {
        const link = getLink();
        expect(link?.attributes.target).toBe(expectedTarget);
    };

    it("Defaults to open in new tab", () => {
        component.ngOnChanges({});
        fixture.detectChanges();
        assertLinkTarget("_blank");
    });

    it("Detects changes for target property", () => {
        component.targetSelf = true;
        component.ngOnChanges({});
        fixture.detectChanges();
        assertLinkTarget("_self");
    });
});
