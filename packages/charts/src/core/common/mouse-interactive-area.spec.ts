import { select } from "d3-selection";

import { IGNORE_INTERACTION_CLASS } from "../../constants";

import { MouseInteractiveArea } from "./mouse-interactive-area";
import { D3Selection, InteractionType } from "./types";

describe("mouse-interactive-area >", () => {
    // Using any as a fallback type to avoid strict mode error
    let target: D3Selection<SVGGElement> | any;
    let interactiveArea: D3Selection<SVGRectElement> | any;
    let mouseInteractiveArea: MouseInteractiveArea;
    const interactiveAreaDimension = 10;
    const cursor = "crosshair";

    beforeEach(() => {
        target = select(document.createElement("div")).append("svg").append("g");
        interactiveArea = select(document.createElement("div")).append("svg").append("g").append("rect");
        interactiveArea.attr("width", interactiveAreaDimension);
        interactiveArea.attr("height", interactiveAreaDimension);
        mouseInteractiveArea = new MouseInteractiveArea(target, interactiveArea, cursor);
    });

    describe("instantiation", () => {
        it("should add the correct container class to the provided interactive area", () => {
            expect(interactiveArea.attr("class")).toContain(MouseInteractiveArea.CONTAINER_CLASS);
        });

        it("should have the specified cursor", () => {
            expect(interactiveArea.style("cursor")).toBe(cursor);
        });

        it("should define handlers for mouse events on the provided target", () => {
            expect(target.on("mouseover")).toBeDefined();
            expect(target.on("mouseout")).toBeDefined();
            expect(target.on(InteractionType.MouseDown)).toBeDefined();
            expect(target.on(InteractionType.MouseUp)).toBeDefined();
            expect(target.on(InteractionType.MouseMove)).toBeDefined();
            expect(target.on(InteractionType.Click)).toBeDefined();
        });
    });

    describe("active", () => {
        it("does not activate on 'mouseover' if the event target has the 'IGNORE_INTERACTION_CLASS'", () => {
            const spy = spyOn(mouseInteractiveArea.active, "next");
            const event = new MouseEvent("mouseover");

            target.classed(IGNORE_INTERACTION_CLASS, true);
            target.node().dispatchEvent(event);

            expect(spy).not.toHaveBeenCalled();
        });

        it("does not activate on 'mouseover' if it's already active", () => {
            target.node().dispatchEvent(new MouseEvent("mouseover"));

            const spy = spyOn(mouseInteractiveArea.active, "next");
            const event = new MouseEvent("mouseover");

            target.node().dispatchEvent(event);

            expect(spy).not.toHaveBeenCalled();
        });

        it("activates on 'mouseover'", () => {
            const spy = spyOn(mouseInteractiveArea.active, "next");

            target.node().dispatchEvent(new MouseEvent("mouseover"));

            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith(true);
        });

        it("does not deactivate on 'mouseout' if not active", () => {
            const spy = spyOn(mouseInteractiveArea.active, "next");
            target.node().dispatchEvent(new MouseEvent("mouseout"));

            expect(spy).not.toHaveBeenCalled();
        });

        it("does not deactivate on 'mouseout' if the event target is a child of the interactive area container", () => {
            target.node().dispatchEvent(new MouseEvent("mouseover"));
            const spy = spyOn(mouseInteractiveArea.active, "next");
            const event = new MouseEvent("mouseout") as any;
            const childNode = document.createElement("div");
            target.node().append(childNode);
            spyOnProperty(event, "relatedTarget").and.returnValue(childNode);

            target.node().dispatchEvent(event);

            expect(spy).not.toHaveBeenCalled();
        });

        it("deactivates on 'mouseout'", () => {
            target.node().dispatchEvent(new MouseEvent("mouseover"));
            const spy = spyOn(mouseInteractiveArea.active, "next");
            target.node().dispatchEvent(new MouseEvent("mouseout"));

            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith(false);
        });
    });

    describe("interaction", () => {
        it("does not emit an interaction if the target has the 'IGNORE_INTERACTION_CLASS'", () => {
            const spy = spyOn(mouseInteractiveArea.interaction, "next");
            const event = new MouseEvent(InteractionType.MouseMove);

            target.classed(IGNORE_INTERACTION_CLASS, true);
            target.node().dispatchEvent(event);

            expect(spy).not.toHaveBeenCalled();
        });

        it("updates on mousedown", () => {
            const spy = spyOn(mouseInteractiveArea.interaction, "next");

            target.node().dispatchEvent(new MouseEvent(InteractionType.MouseDown));

            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith({ type: InteractionType.MouseDown, coordinates: { x: 0, y: 0 } });
        });

        it("updates on mouseup", () => {
            const spy = spyOn(mouseInteractiveArea.interaction, "next");

            target.node().dispatchEvent(new MouseEvent(InteractionType.MouseUp));

            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith({ type: InteractionType.MouseUp, coordinates: { x: 0, y: 0 } });
        });

        it("updates on mousemove", () => {
            const spy = spyOn(mouseInteractiveArea.interaction, "next");

            target.node().dispatchEvent(new MouseEvent(InteractionType.MouseMove));

            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith({ type: InteractionType.MouseMove, coordinates: { x: 0, y: 0 } });
        });

        it("updates on click", () => {
            const spy = spyOn(mouseInteractiveArea.interaction, "next");

            target.node().dispatchEvent(new MouseEvent(InteractionType.Click));

            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith({ type: InteractionType.Click, coordinates: { x: 0, y: 0 } });
        });

        describe("Firefox Hacks", () => {
            beforeEach(() => {
                spyOnProperty(window.navigator, "userAgent").and.returnValue("firefox");
            });

            describe("'x' value clamping", () => {
                it("should clamp the 'x' interaction output to the width of the interactive area", () => {
                    const spy = spyOn(mouseInteractiveArea.interaction, "next");
                    const event = new MouseEvent(InteractionType.MouseMove) as any;
                    spyOnProperty(event, "offsetX").and.returnValue(0);
                    spyOnProperty(event, "offsetY").and.returnValue(0);
                    event.originalTarget = {
                        classList: {
                            contains: () => true,
                        },
                        attributes: {
                            x: {
                                value: (interactiveAreaDimension + 1).toString(),
                            },
                            y: {
                                value: (interactiveAreaDimension - 1).toString(),
                            },
                        },
                    };
                    target.node().dispatchEvent(event);

                    expect(spy).toHaveBeenCalledTimes(1);
                    expect(spy).toHaveBeenCalledWith({
                        type: InteractionType.MouseMove,
                        coordinates: {
                            x: interactiveAreaDimension,
                            y: interactiveAreaDimension - 1,
                        },
                    });
                });

                it("should clamp the 'x' interaction output to the left side of the interactive area", () => {
                    const spy = spyOn(mouseInteractiveArea.interaction, "next");
                    const event = new MouseEvent(InteractionType.MouseMove) as any;
                    spyOnProperty(event, "offsetX").and.returnValue(0);
                    spyOnProperty(event, "offsetY").and.returnValue(0);
                    event.originalTarget = {
                        classList: {
                            contains: () => true,
                        },
                        attributes: {
                            x: {
                                value: "-1",
                            },
                            y: {
                                value: (interactiveAreaDimension - 1).toString(),
                            },
                        },
                    };
                    target.node().dispatchEvent(event);

                    expect(spy).toHaveBeenCalledTimes(1);
                    expect(spy).toHaveBeenCalledWith({
                        type: InteractionType.MouseMove,
                        coordinates: {
                            x: 0,
                            y: interactiveAreaDimension - 1,
                        },
                    });
                });
            });

            describe("'y' value clamping", () => {
                it("should clamp the 'y' interaction output to the bottom of the interactive area", () => {
                    const spy = spyOn(mouseInteractiveArea.interaction, "next");
                    const event = new MouseEvent(InteractionType.MouseMove) as any;
                    spyOnProperty(event, "offsetX").and.returnValue(0);
                    spyOnProperty(event, "offsetY").and.returnValue(0);
                    event.originalTarget = {
                        classList: {
                            contains: () => true,
                        },
                        attributes: {
                            x: {
                                value: (interactiveAreaDimension - 1).toString(),
                            },
                            y: {
                                value: (interactiveAreaDimension + 1).toString(),
                            },
                        },
                    };
                    target.node().dispatchEvent(event);

                    expect(spy).toHaveBeenCalledTimes(1);
                    expect(spy).toHaveBeenCalledWith({
                        type: InteractionType.MouseMove,
                        coordinates: {
                            x: interactiveAreaDimension - 1,
                            y: interactiveAreaDimension,
                        },
                    });
                });

                it("should clamp the 'y' interaction output to the top side of the interactive area", () => {
                    const spy = spyOn(mouseInteractiveArea.interaction, "next");
                    const event = new MouseEvent(InteractionType.MouseMove) as any;
                    spyOnProperty(event, "offsetX").and.returnValue(0);
                    spyOnProperty(event, "offsetY").and.returnValue(0);
                    event.originalTarget = {
                        classList: {
                            contains: () => true,
                        },
                        attributes: {
                            x: {
                                value: (interactiveAreaDimension - 1).toString(),
                            },
                            y: {
                                value: "-1",
                            },
                        },
                    };
                    target.node().dispatchEvent(event);

                    expect(spy).toHaveBeenCalledTimes(1);
                    expect(spy).toHaveBeenCalledWith({
                        type: InteractionType.MouseMove,
                        coordinates: {
                            x: interactiveAreaDimension - 1,
                            y: 0,
                        },
                    });
                });

            });

            describe("offsets", () => {
                it("should add the 'xOffset' value to the interaction output", () => {
                    const spy = spyOn(mouseInteractiveArea.interaction, "next");
                    const event = new MouseEvent(InteractionType.MouseMove) as any;
                    const testOffsetX = 2;
                    const originalTargetX = 5;
                    const originalTargetY = 5;
                    spyOnProperty(event, "offsetX").and.returnValue(testOffsetX);
                    spyOnProperty(event, "offsetY").and.returnValue(0);
                    event.originalTarget = {
                        classList: {
                            contains: () => true,
                        },
                        attributes: {
                            x: {
                                value: originalTargetX.toString(),
                            },
                            y: {
                                value: originalTargetY.toString(),
                            },
                        },
                    };
                    target.node().dispatchEvent(event);

                    expect(spy).toHaveBeenCalledTimes(1);
                    expect(spy).toHaveBeenCalledWith({
                        type: InteractionType.MouseMove,
                        coordinates: {
                            x: originalTargetX + testOffsetX,
                            y: originalTargetY,
                        },
                    });
                });

                it("should add the 'yOffset' value to the interaction output", () => {
                    const spy = spyOn(mouseInteractiveArea.interaction, "next");
                    const event = new MouseEvent(InteractionType.MouseMove) as any;
                    const testOffsetY = 2;
                    const originalTargetX = 5;
                    const originalTargetY = 5;
                    spyOnProperty(event, "offsetX").and.returnValue(0);
                    spyOnProperty(event, "offsetY").and.returnValue(testOffsetY);
                    event.originalTarget = {
                        classList: {
                            contains: () => true,
                        },
                        attributes: {
                            x: {
                                value: originalTargetX.toString(),
                            },
                            y: {
                                value: originalTargetY.toString(),
                            },
                        },
                    };
                    target.node().dispatchEvent(event);

                    expect(spy).toHaveBeenCalledTimes(1);
                    expect(spy).toHaveBeenCalledWith({
                        type: InteractionType.MouseMove,
                        coordinates: {
                            x: originalTargetX,
                            y: originalTargetY + testOffsetY,
                        },
                    });
                });

                it("should clamp the 'x' value in the interaction output if the offset overflows the interactive area", () => {
                    const spy = spyOn(mouseInteractiveArea.interaction, "next");
                    const event = new MouseEvent(InteractionType.MouseMove) as any;
                    const originalTargetX = 5;
                    const originalTargetY = 5;
                    const testOffsetX = interactiveAreaDimension - originalTargetX + 1;
                    spyOnProperty(event, "offsetX").and.returnValue(testOffsetX);
                    spyOnProperty(event, "offsetY").and.returnValue(0);
                    event.originalTarget = {
                        classList: {
                            contains: () => true,
                        },
                        attributes: {
                            x: {
                                value: originalTargetX.toString(),
                            },
                            y: {
                                value: originalTargetY.toString(),
                            },
                        },
                    };
                    target.node().dispatchEvent(event);

                    expect(spy).toHaveBeenCalledTimes(1);
                    expect(spy).toHaveBeenCalledWith({
                        type: InteractionType.MouseMove,
                        coordinates: {
                            x: interactiveAreaDimension,
                            y: originalTargetY,
                        },
                    });
                });

                it("should clamp the 'y' value in the interaction output if the offset overflows the interactive area", () => {
                    const spy = spyOn(mouseInteractiveArea.interaction, "next");
                    const event = new MouseEvent(InteractionType.MouseMove) as any;
                    const originalTargetX = 5;
                    const originalTargetY = 5;
                    const testOffsetY = interactiveAreaDimension - originalTargetY + 1;
                    spyOnProperty(event, "offsetX").and.returnValue(0);
                    spyOnProperty(event, "offsetY").and.returnValue(testOffsetY);
                    event.originalTarget = {
                        classList: {
                            contains: () => true,
                        },
                        attributes: {
                            x: {
                                value: originalTargetX.toString(),
                            },
                            y: {
                                value: originalTargetY.toString(),
                            },
                        },
                    };
                    target.node().dispatchEvent(event);

                    expect(spy).toHaveBeenCalledTimes(1);
                    expect(spy).toHaveBeenCalledWith({
                        type: InteractionType.MouseMove,
                        coordinates: {
                            x: originalTargetX,
                            y: interactiveAreaDimension,
                        },
                    });
                });


            });
        });

    });

});
