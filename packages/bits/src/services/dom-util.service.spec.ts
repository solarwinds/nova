import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { DomUtilService } from "./dom-util.service";

describe("services >", () => {
    describe("DomUtilService >", () => {
        let domUtilService: DomUtilService;
        let fixture: ComponentFixture<DomUtilServiceTestComponent>;
        let sourceElement: HTMLElement;

        @Component({}) class DomUtilServiceTestComponent {}

        const createHtml = () =>
            `<span id="match-by-tag">
                        <div id="match-by-class" class="match-class">
                            <div>
                                <div id="source-element"></div>
                            </div>
                        </div>
                    </span>`;

        const createTestComponent = async () => {
            TestBed.overrideComponent(DomUtilServiceTestComponent, {
                set: {
                    template: createHtml(),
                },
            });
            await TestBed.compileComponents();
            return TestBed.createComponent(DomUtilServiceTestComponent);
        };

        beforeEach(() => {
            domUtilService = new DomUtilService(document);
            TestBed.configureTestingModule({
                declarations: [
                    DomUtilServiceTestComponent,
                ],
            });
        });
        beforeEach(async () => {
            fixture = await createTestComponent();
            sourceElement = fixture.debugElement.query(By.css("#source-element")).nativeElement;
        });

        describe("getClosest > ", () => {
            it("should get the closest matching element by class", () => {
                const matchingParent = fixture.debugElement.query(By.css("#match-by-class")).nativeElement;

                expect(domUtilService.getClosest(sourceElement, ".match-class")).toEqual(matchingParent);
            });

            it("should get the closest matching element by tag", () => {
                const matchingParent = fixture.debugElement.query(By.css("#match-by-tag")).nativeElement;

                expect(domUtilService.getClosest(sourceElement, "span")).toEqual(matchingParent);
            });

            it("should return null if no match is found", () => {
                expect(domUtilService.getClosest(sourceElement, ".non-existent-class")).toEqual(null);
            });
        });

    });
});
