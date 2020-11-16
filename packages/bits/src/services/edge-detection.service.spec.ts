import { Component, DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import noop from "lodash/noop";

import { DomUtilService } from "./dom-util.service";
import { EdgeDetectionService } from "./edge-detection.service";
import { LoggerService } from "./log-service";

describe("services >", () => {
    describe("edge-detection-service >", () => {
        @Component({}) class EdgeDetectionTestComponent {}

        let edgeDetectionService: EdgeDetectionService,
            deposit: HTMLElement,
            basePoint: HTMLElement,
            dimensionAdjustment: number;
        let logger: LoggerService;
        let logErrorSpy: jasmine.Spy;

        const basePointDimensions = {
            x: 50,
            y: 50,
            width: 20,
            height: 10,
        },
        parentComponentDimension = {
            width: 100,
            height: 100,
        };

        const createBasicHtml = (depositWidth: number, depositHeight: number,
                               addEdgeDefiner?: boolean) => {
            const edgeDefinerClass = addEdgeDefiner ? "nui-edge-definer" : "";
            const parentStyle = addEdgeDefiner ? `width: ${parentComponentDimension.width}px;
                                                       height: ${parentComponentDimension.height}px;
                                                       position: relative;` : "";
            return `<div id="edge-detection"
                         class="${edgeDefinerClass}"
                         style="${parentStyle}">
                        <div id="base-point"
                             style="position: absolute;
                                    left: ${basePointDimensions.x}px;
                                    top: ${basePointDimensions.y}px;
                                    height: ${basePointDimensions.height}px;
                                    width:  ${basePointDimensions.width}px;">
                        </div>
                        <div id="deposit"
                             style="width: ${depositWidth}px;
                                    height: ${depositHeight}px;
                                    display: none;">
                        </div>
                    </div>`;
        };

        const createBasicComponent = async (depositWidth: number, depositHeight: number, addEdgeDefiner?: boolean) => {
            TestBed.overrideComponent(EdgeDetectionTestComponent, {
                set: {
                    template: createBasicHtml(depositWidth, depositHeight, addEdgeDefiner),
                },
            });
            await TestBed.compileComponents();
            return TestBed.createComponent(EdgeDetectionTestComponent);
        };

        beforeEach(() => {
            logger = new LoggerService();

            logErrorSpy = spyOnProperty(logger, "error").and.returnValue(noop);
            spyOnProperty(logger, "warn").and.returnValue(noop);
            edgeDetectionService = new EdgeDetectionService(new DomUtilService(document), document, logger);
            TestBed.configureTestingModule({
                declarations: [
                    EdgeDetectionTestComponent,
                ],
            });
        });

        describe("canBe", () => {
            it("logs errors if arguments were not passed", () => {
                (edgeDetectionService as any).canBe();

                expect(logErrorSpy).toHaveBeenCalled();
            });

            it("uses private 'offset' method to calculate element offset", () => {
                basePoint = document.createElement("div");
                deposit = document.createElement("div");

                spyOn<any>(edgeDetectionService, "offset").and.callThrough();
                edgeDetectionService.canBe(basePoint, deposit);
                expect(edgeDetectionService["offset"]).toHaveBeenCalled();
            });

            it("uses private 'outer' method to calculate either element outerWith or outerHeight", () => {
                basePoint = document.createElement("div");
                deposit = document.createElement("div");

                spyOn<any>(edgeDetectionService, "outer");
                edgeDetectionService.canBe(basePoint, deposit);
                expect(edgeDetectionService["outer"]).toHaveBeenCalled();
            });
        });

        describe("getEdgeDefinerMeasurements (private)", () => {
            it("returns window measurements if no edgeDefiner element passed", () => {
                const container = (edgeDetectionService as any).getEdgeDefinerMeasurements(null);

                expect(container.position.top).toBe(0);
                expect(container.position.left).toBe(0);
            });
        });

        describe("placing >", () => {
            const testLeftRightPlacement = (isPlacementPossible: boolean, placementDirection: string) =>
                async () => {
                    let depositWidth: number;
                    dimensionAdjustment = isPlacementPossible ? -1 : 1;
                    if (placementDirection === "left") {
                        depositWidth = basePointDimensions.x;
                    } else {
                        depositWidth = window.innerWidth - basePointDimensions.x - basePointDimensions.width;
                    }
                    depositWidth += dimensionAdjustment;

                    const fixture = await createBasicComponent(depositWidth, 10);

                    deposit = fixture.debugElement.query(By.css("#deposit")).nativeElement;
                    basePoint = fixture.debugElement.query(By.css("#base-point")).nativeElement;
                    const result: any = edgeDetectionService.canBe(basePoint, deposit);

                    expect(result.placed[placementDirection]).toBe(isPlacementPossible);
                };

            const testTopBottomPlacement = (isPlacementPossible: boolean, placementDirection: string) =>
                async () => {
                    let depositHeight: number;
                    dimensionAdjustment = isPlacementPossible ? -1 : 1;
                    if (placementDirection === "bottom") {
                        depositHeight = window.innerHeight - basePointDimensions.y - basePointDimensions.height;
                    } else {
                        depositHeight = basePointDimensions.y;
                    }
                    depositHeight += dimensionAdjustment;

                    const fixture = await createBasicComponent(10, depositHeight);

                    deposit = fixture.debugElement.query(By.css("#deposit")).nativeElement;
                    basePoint = fixture.debugElement.query(By.css("#base-point")).nativeElement;
                    const result: any = edgeDetectionService.canBe(basePoint, deposit);

                    expect(result.placed[placementDirection]).toBe(isPlacementPossible);
                };

            it("should give expected result when no right direction is available",
                testLeftRightPlacement(false, "right"));
            it("should give expected result when right direction is available",
                testLeftRightPlacement(true, "right"));

            it("should give expected result when no top direction is available",
                testTopBottomPlacement(false, "top"));
            it("should give expected result when top direction is available",
                testTopBottomPlacement(true, "top"));

            it("should give expected result when no bottom direction is available",
                testTopBottomPlacement(false, "bottom"));
            it("should give expected result when bottom direction is available",
                testTopBottomPlacement(true, "bottom"));

            it("should give expected result when no left direction is available",
                testLeftRightPlacement(false, "left"));
            it("should give expected result when left direction is available",
                testLeftRightPlacement(true, "left"));
        });

        describe("placing in ", () => {
            describe("solitary edge-definer > ", () => {
                const testLeftRightPlacementInComponent = (isPlacementPossible: boolean, placementDirection: string) =>
                    async () => {
                        let depositWidth: number;
                        dimensionAdjustment = isPlacementPossible ? -1 : 1;

                        if (placementDirection === "left") {
                            depositWidth = basePointDimensions.x;
                        } else {
                            depositWidth =
                                parentComponentDimension.width - basePointDimensions.x - basePointDimensions.width;
                        }
                        depositWidth += dimensionAdjustment;

                        const fixture = await createBasicComponent(depositWidth, 10, true);

                        deposit = fixture.debugElement.query(By.css("#deposit")).nativeElement;
                        basePoint = fixture.debugElement.query(By.css("#base-point")).nativeElement;
                        const result: any = edgeDetectionService.canBe(basePoint, deposit);

                        expect(result.placed[placementDirection]).toBe(isPlacementPossible);
                    };

                const testTopBottomPlacementInComponent = (isPlacementPossible: boolean, placementDirection: string) =>
                    async () => {
                        let depositHeight: number;
                        dimensionAdjustment = isPlacementPossible ? -1 : 1;

                        if (placementDirection === "bottom") {
                            depositHeight =
                                parentComponentDimension.height - basePointDimensions.y - basePointDimensions.height;
                        } else {
                            depositHeight = basePointDimensions.y;
                        }
                        depositHeight += dimensionAdjustment;

                        const fixture = await createBasicComponent(10, depositHeight, true);

                        deposit = fixture.debugElement.query(By.css("#deposit")).nativeElement;
                        basePoint = fixture.debugElement.query(By.css("#base-point")).nativeElement;
                        const result: any = edgeDetectionService.canBe(basePoint, deposit);

                        expect(result.placed[placementDirection]).toBe(isPlacementPossible);
                    };

                it("should give expected result when no right direction is available",
                    testLeftRightPlacementInComponent(false, "right"));
                it("should give expected result when right direction is available",
                    testLeftRightPlacementInComponent(true, "right"));

                it("should give expected result when no top direction is available",
                    testTopBottomPlacementInComponent(false, "top"));
                it("should give expected result when top direction is available",
                    testTopBottomPlacementInComponent(true, "top"));

                it("should give expected result when no bottom direction is available",
                    testTopBottomPlacementInComponent(false, "bottom"));
                it("should give expected result when bottom direction is available",
                    testTopBottomPlacementInComponent(true, "bottom"));

                it("should give expected result when no left direction is available",
                    testLeftRightPlacementInComponent(false, "left"));
                it("should give expected result when left direction is available",
                    testLeftRightPlacementInComponent(true, "left"));
            });

            describe("multiple edge-definers on the same page > ", () => {
                let fixture: ComponentFixture<EdgeDetectionTestComponent>;
                const outerEdgeDetectionStyle = `"position: absolute;
                                                    left: 0px;
                                                    top: 0px;
                                                    height: 215px;
                                                    width:  215px;"`;
                const topLeftEdgeDefinerStyle = `"position: relative;
                                                    float: left;
                                                    left: 5px;
                                                    top: 5px;
                                                    height: 100px;
                                                    width:  100px;"`;
                const bottomRightEdgeDefinerStyle = `"position: relative;
                                                        float: left;
                                                        left: 10px;
                                                        top: 110px;
                                                        height: 100px;
                                                        width: 100px;"`;
                const topLeftBasePointStyle = `"position: relative;
                                                left: 5px;
                                                top: 5px;
                                                height: 20px;
                                                width:  20px;"`;
                const bottomRightBasePointStyle = `"position: relative;
                                                    left: 75px;
                                                    top: 55px;
                                                    height: 20px;
                                                    width: 20px;"`;
                const depositStyle = `"width: 20px;
                                        height: 20px;
                                        display: none;"`;

                const createHtmlWithMultipleEdgeDefiners = (addOuterEdgeDefiner?: boolean) => {
                    const edgeDefinerClass = addOuterEdgeDefiner ? "nui-edge-definer" : "";
                    return `<div id="outer-edge-detection"
                                 style=${outerEdgeDetectionStyle}
                                 class="${edgeDefinerClass}">
                            <div id="deposit"
                                style=${depositStyle}>
                            </div>
                            <div id="inner-edge-detection-0" class="nui-edge-definer"
                                style=${topLeftEdgeDefinerStyle}>
                                <div id="base-point-0"
                                    style=${topLeftBasePointStyle}>
                                </div>
                                <div id="base-point-1"
                                    style=${bottomRightBasePointStyle}>
                                </div>
                            </div>
                            <div id="inner-edge-detection-1" class="nui-edge-definer"
                                style=${bottomRightEdgeDefinerStyle}>
                                <div id="base-point-2"
                                    style=${topLeftBasePointStyle}>
                                </div>
                                <div id="base-point-3"
                                    style=${bottomRightBasePointStyle}>
                                </div>
                            </div>
                        </div>`;
                };

                const createComponentWithMultipleEdgeDefiners =
                    async (addOuterEdgeDefiner?: boolean) => {
                        TestBed.overrideComponent(EdgeDetectionTestComponent, {
                            set: {
                                template: createHtmlWithMultipleEdgeDefiners(addOuterEdgeDefiner),
                            },
                        });
                        await TestBed.compileComponents();
                        return TestBed.createComponent(EdgeDetectionTestComponent);
                    };

                describe("sibling edge definers > ", () => {
                    let toBePlaced: any;
                    let basePoint2: any;
                    let basePoint3: any;

                    beforeEach(async () => {
                        fixture = await createComponentWithMultipleEdgeDefiners();

                        toBePlaced = fixture.debugElement.query(By.css("#deposit")).nativeElement;
                        basePoint2 = fixture.debugElement.query(By.css("#base-point-2")).nativeElement;
                        basePoint3 = fixture.debugElement.query(By.css("#base-point-3")).nativeElement;
                    });

                    describe("when edge definer is below another edge definer", () => {
                        it(`should report that bottom placement is possible for the base point
                            whose deposit would fall inside the lower edge definer`, () => {
                            const result: any = edgeDetectionService.canBe(basePoint2, toBePlaced);
                            expect(result.placed["bottom"]).toBe(true);
                        });

                        it(`should report that bottom placement is not possible for the base point
                            whose deposit would not fall inside the lower edge definer`, () => {
                            const result: any = edgeDetectionService.canBe(basePoint3, toBePlaced);
                            expect(result.placed["bottom"]).toBe(false);
                        });

                        it(`should report that top placement is possible for the base point
                            whose deposit would fall inside the lower edge definer`, () => {
                            const result: any = edgeDetectionService.canBe(basePoint3, toBePlaced);
                            expect(result.placed["top"]).toBe(true);
                        });

                        it(`should report that top placement is not possible for the base point
                            whose deposit would not fall inside the lower edge definer`, () => {
                            const result: any = edgeDetectionService.canBe(basePoint2, toBePlaced);
                            expect(result.placed["top"]).toBe(false);
                        });
                    });

                    describe(`when edge definer is to the right of another edge definer`, () => {
                        it(`should report that right placement is possible for the base point
                            whose deposit would fall inside the right-most edge definer`, () => {
                            const result: any = edgeDetectionService.canBe(basePoint2, toBePlaced);
                            expect(result.placed["right"]).toBe(true);
                        });

                        it(`should report that right placement is not possible for the base point
                            whose deposit would not fall inside the right-most edge definer`, () => {
                            const result: any = edgeDetectionService.canBe(basePoint3, toBePlaced);
                            expect(result.placed["right"]).toBe(false);
                        });

                        it(`should report that left placement is possible for the base point
                            whose deposit would fall inside the right-most edge definer`, () => {
                            const result: any = edgeDetectionService.canBe(basePoint3, toBePlaced);
                            expect(result.placed["left"]).toBe(true);
                        });

                        it(`should report that left placement is not possible for the base point
                            whose deposit would not fall inside the right-most edge definer`, () => {
                            const result: any = edgeDetectionService.canBe(basePoint2, toBePlaced);
                            expect(result.placed["left"]).toBe(false);
                        });
                    });
                });

                describe(`nested edge-definers >`, () => {
                    let toBePlaced: any;
                    let basePoint0: any;
                    let basePoint1: any;
                    let basePoint2: any;
                    let basePoint3: any;

                    beforeEach(async () => {
                        fixture = await createComponentWithMultipleEdgeDefiners(true);

                        toBePlaced = fixture.debugElement.query(By.css("#deposit")).nativeElement;
                        basePoint0 = fixture.debugElement.query(By.css("#base-point-0")).nativeElement;
                        basePoint1 = fixture.debugElement.query(By.css("#base-point-1")).nativeElement;
                        basePoint2 = fixture.debugElement.query(By.css("#base-point-2")).nativeElement;
                        basePoint3 = fixture.debugElement.query(By.css("#base-point-3")).nativeElement;
                    });

                    describe(`when an edge definer is inside another edge definer`, () => {
                        it(`should report that bottom placement is possible for the base point
                            whose deposit would fall inside both edge definers`, () => {
                            const result: any = edgeDetectionService.canBe(basePoint0, toBePlaced);
                            expect(result.placed["bottom"]).toBe(true);
                        });

                        it(`should report that bottom placement is not possible for the base point whose deposit
                            would fall inside the parent edge definer but not the child edge definer`, () => {
                            const result: any = edgeDetectionService.canBe(basePoint1, toBePlaced);
                            expect(result.placed["bottom"]).toBe(false);
                        });

                        it(`should report that top placement is possible for the base point
                            whose deposit would fall inside both edge definers`, () => {
                            const result: any = edgeDetectionService.canBe(basePoint3, toBePlaced);
                            expect(result.placed["top"]).toBe(true);
                        });

                        it(`should report that top placement is not possible for the base point whose deposit
                            would fall inside the parent edge definer but not the child edge definer`, () => {
                            const result: any = edgeDetectionService.canBe(basePoint2, toBePlaced);
                            expect(result.placed["top"]).toBe(false);
                        });

                        it(`should report that right placement is possible for the base point
                            whose deposit would fall inside both edge definers`, () => {
                            const result: any = edgeDetectionService.canBe(basePoint0, toBePlaced);
                            expect(result.placed["right"]).toBe(true);
                        });

                        it(`should report that right placement is not possible for the base point whose deposit
                            would fall inside the parent edge definer but not the child edge definer`, () => {
                            const result: any = edgeDetectionService.canBe(basePoint1, toBePlaced);
                            expect(result.placed["right"]).toBe(false);
                        });

                        it(`should report that left placement is possible for the base point
                            whose deposit would fall inside both edge definers`, () => {
                            const result: any = edgeDetectionService.canBe(basePoint3, toBePlaced);
                            expect(result.placed["left"]).toBe(true);
                        });

                        it(`should report that left placement is not possible for the base point whose deposit
                            would fall inside the parent edge definer but not the child edge definer`, () => {
                            const result: any = edgeDetectionService.canBe(basePoint2, toBePlaced);
                            expect(result.placed["left"]).toBe(false);
                        });
                    });
                });
            });
        });

        describe("aligning >", () => {
            const testLeftRightAlignment = (isAlignmentPossible: boolean, alignmentDirection: string) =>
                async () => {
                    let depositWidth: number;
                    dimensionAdjustment = isAlignmentPossible ? -10 : 10;
                    if (alignmentDirection === "left") {
                        depositWidth = window.innerWidth - basePointDimensions.x;
                    } else {
                        depositWidth = basePointDimensions.x + basePointDimensions.width;
                    }
                    depositWidth += dimensionAdjustment;

                    const fixture = await createBasicComponent(depositWidth, 10);

                    deposit = fixture.debugElement.query(By.css("#deposit")).nativeElement;
                    basePoint = fixture.debugElement.query(By.css("#base-point")).nativeElement;
                    const result: any = edgeDetectionService.canBe(basePoint, deposit);

                    expect(result.aligned[alignmentDirection]).toBe(isAlignmentPossible);
                };

            const testTopBottomAlignment = (isAlignmentPossible: boolean, alignmentDirection: string) =>
                async () => {
                    let depositHeight: number;
                    dimensionAdjustment = isAlignmentPossible ? -10 : 10;
                    if (alignmentDirection === "bottom") {
                        depositHeight = basePointDimensions.y + basePointDimensions.height;
                    } else {
                        depositHeight = window.innerHeight - basePointDimensions.y;
                    }
                    depositHeight += dimensionAdjustment;

                    const fixture = await createBasicComponent(10, depositHeight);

                    deposit = fixture.debugElement.query(By.css("#deposit")).nativeElement;
                    basePoint = fixture.debugElement.query(By.css("#base-point")).nativeElement;
                    const result: any = edgeDetectionService.canBe(basePoint, deposit);

                    expect(result.aligned[alignmentDirection]).toBe(isAlignmentPossible);
                };

            it("should give expected result when no right direction is available",
                testLeftRightAlignment(false, "right"));
            it("should give expected result when right direction is available",
                testLeftRightAlignment(true, "right"));

            it("should give expected result when no top direction is available",
                testTopBottomAlignment(false, "top"));
            it("should give expected result when top direction is available",
                testTopBottomAlignment(true, "top"));

            it("should give expected result when no bottom direction is available",
                testTopBottomAlignment(false, "bottom"));
            it("should give expected result when bottom direction is available",
                testTopBottomAlignment(true, "bottom"));

            it("should give expected result when no left direction is available",
                testLeftRightAlignment(false, "left"));
            it("should give expected result when left direction is available",
                testLeftRightAlignment(true, "left"));
        });

        describe("aligning in edge-definer >", () => {
            const testLeftRightAlignmentInComponent = (isAlignmentPossible: boolean, alignmentDirection: string) =>
                async () => {
                    let depositWidth: number;
                    dimensionAdjustment = isAlignmentPossible ? -10 : 10;

                    if (alignmentDirection === "left") {
                        depositWidth = parentComponentDimension.width - basePointDimensions.x;
                    } else {
                        depositWidth = basePointDimensions.x + basePointDimensions.width;
                    }
                    depositWidth += dimensionAdjustment;

                    const fixture = await createBasicComponent(depositWidth, 10, true);

                    deposit = fixture.debugElement.query(By.css("#deposit")).nativeElement;
                    basePoint = fixture.debugElement.query(By.css("#base-point")).nativeElement;
                    const result: any = edgeDetectionService.canBe(basePoint, deposit);

                    expect(result.aligned[alignmentDirection]).toBe(isAlignmentPossible);
                };

            const testTopBottomAlignmentInComponent = (isAlignmentPossible: boolean, alignmentDirection: string) =>
                async () => {
                    let depositHeight: number;
                    dimensionAdjustment = isAlignmentPossible ? -10 : 10;

                    if (alignmentDirection === "bottom") {
                        depositHeight = basePointDimensions.y + basePointDimensions.height;
                    } else {
                        depositHeight = parentComponentDimension.height - basePointDimensions.y;
                    }
                    depositHeight += dimensionAdjustment;

                    const fixture = await createBasicComponent(10, depositHeight, true);

                    deposit = fixture.debugElement.query(By.css("#deposit")).nativeElement;
                    basePoint = fixture.debugElement.query(By.css("#base-point")).nativeElement;
                    const result: any = edgeDetectionService.canBe(basePoint, deposit);

                    expect(result.aligned[alignmentDirection]).toBe(isAlignmentPossible);
                };

            it("should give expected result when no right direction is available",
                testLeftRightAlignmentInComponent(false, "right"));
            it("should give expected result when right direction is available",
                testLeftRightAlignmentInComponent(true, "right"));

            it("should give expected result when no top direction is available",
                testTopBottomAlignmentInComponent(false, "top"));
            it("should give expected result when top direction is available",
                testTopBottomAlignmentInComponent(true, "top"));

            it("should give expected result when no bottom direction is available",
                testTopBottomAlignmentInComponent(false, "bottom"));
            it("should give expected result when bottom direction is available",
                testTopBottomAlignmentInComponent(true, "bottom"));

            it("should give expected result when no left direction is available",
                testLeftRightAlignmentInComponent(false, "left"));
            it("should give expected result when left direction is available",
                testLeftRightAlignmentInComponent(true, "left"));
        });
    });
});
