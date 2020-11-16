import { popoverConstants } from "../../constants/popover.constants";
import { DomUtilService } from "../../services/dom-util.service";
import { EdgeDetectionService } from "../../services/edge-detection.service";
import { LoggerService } from "../../services/log-service";
import { PositionService } from "../../services/position.service";
import { IEdgeDetectionResult } from "../../services/public-api";

import { IPopoverPosition, PopoverAlignment, PopoverModalService } from "./popover-modal.service";
import { PopoverPlacement } from "./public-api";

interface IPopoverModalTestCase {
    name: string;
    placement: PopoverPlacement;
    alignment: PopoverAlignment;
    expectedResult: IPopoverPosition;
    edgeDetectionResult: IEdgeDetectionResult;
}

const triggerElementDimension = 200;
const expectedPositionOffset = triggerElementDimension / 2 - popoverConstants.arrowOffset - popoverConstants.arrowBorderWidth;
const popoverModalTestCases: IPopoverModalTestCase[] = [
    {
        name: "left placement / top alignment popover position",
        placement: "left",
        alignment: "top",
        edgeDetectionResult: {
            placed: {
                top: false,
                right: false,
                bottom: false,
                left: true,
            },
            aligned: {
                top: true,
                right: false,
                bottom: false,
                left: false,
            },
        },
        expectedResult: {
            arrowPosition: "top",
            placement: "left",
            position: {
                top: expectedPositionOffset,
                left: 0,
            },
        },
    }, {
        name: "left placement / bottom alignment popover position",
        placement: "left",
        alignment: "bottom",
        edgeDetectionResult: {
            placed: {
                top: false,
                right: false,
                bottom: false,
                left: true,
            },
            aligned: {
                top: false,
                right: false,
                bottom: true,
                left: false,
            },
        },
        expectedResult: {
            arrowPosition: "bottom",
            placement: "left",
            position: {
                top: -expectedPositionOffset,
                left: 0,
            },
        },
    }, {
        name: "right placement / top alignment popover position",
        placement: "right",
        alignment: "top",
        edgeDetectionResult: {
            placed: {
                top: false,
                right: true,
                bottom: false,
                left: false,
            },
            aligned: {
                top: true,
                right: false,
                bottom: false,
                left: false,
            },
        },
        expectedResult: {
            arrowPosition: "top",
            placement: "right",
            position: {
                top: expectedPositionOffset,
                left: 0,
            },
        },
    }, {
        name: "right placement / bottom alignment popover position",
        placement: "right",
        alignment: "bottom",
        edgeDetectionResult: {
            placed: {
                top: false,
                right: true,
                bottom: false,
                left: false,
            },
            aligned: {
                top: false,
                right: false,
                bottom: true,
                left: false,
            },
        },
        expectedResult: {
            arrowPosition: "bottom",
            placement: "right",
            position: {
                top: -expectedPositionOffset,
                left: 0,
            },
        },
    }, {
        name: "bottom placement / right alignment popover position",
        placement: "bottom",
        alignment: "right",
        edgeDetectionResult: {
            placed: {
                top: false,
                right: false,
                bottom: true,
                left: false,
            },
            aligned: {
                top: false,
                right: true,
                bottom: false,
                left: false,
            },
        },
        expectedResult: {
            arrowPosition: "right",
            placement: "bottom",
            position: {
                top: 0,
                left: -expectedPositionOffset,
            },
        },
    }, {
        name: "bottom placement / left alignment popover position",
        placement: "bottom",
        alignment: "left",
        edgeDetectionResult: {
            placed: {
                top: false,
                right: false,
                bottom: true,
                left: false,
            },
            aligned: {
                top: false,
                right: false,
                bottom: false,
                left: true,
            },
        },
        expectedResult: {
            arrowPosition: "left",
            placement: "bottom",
            position: {
                top: 0,
                left: expectedPositionOffset,
            },
        },
    }, {
        name: "top placement / right alignment popover position",
        placement: "top",
        alignment: "right",
        edgeDetectionResult: {
            placed: {
                top: true,
                right: false,
                bottom: false,
                left: false,
            },
            aligned: {
                top: false,
                right: true,
                bottom: false,
                left: false,
            },
        },
        expectedResult: {
            arrowPosition: "right",
            placement: "top",
            position: {
                top: 0,
                left: -expectedPositionOffset,
            },
        },
    }, {
        name: "top placement / left alignment popover position",
        placement: "top",
        alignment: "left",
        edgeDetectionResult: {
            placed: {
                top: true,
                right: false,
                bottom: false,
                left: false,
            },
            aligned: {
                top: false,
                right: false,
                bottom: false,
                left: true,
            },
        },
        expectedResult: {
            arrowPosition: "left",
            placement: "top",
            position: {
                top: 0,
                left: expectedPositionOffset,
            },
        },
    }, {
        name: "position when placement is not defined",
        // @ts-ignore: Suppressing error for testing purposes
        placement: null,
        // @ts-ignore: Suppressing error for testing purposes
        alignment: null,
        edgeDetectionResult: {
            placed: {
                top: true,
                right: true,
                bottom: true,
                left: true,
            },
            aligned: {
                top: true,
                right: true,
                bottom: true,
                left: true,
            },
        },
        expectedResult: {
            arrowPosition: "top",
            placement: "right",
            position: {
                top: expectedPositionOffset,
                left: 0,
            },
        },
    }, {
        name: "position when popover can not be opened in any direction",
        // @ts-ignore: Suppressing error for testing purposes
        placement: null,
        // @ts-ignore: Suppressing error for testing purposes
        alignment: null,
        edgeDetectionResult: {
            placed: {
                top: false,
                right: false,
                bottom: false,
                left: false,
            },
            aligned: {
                top: false,
                right: false,
                bottom: false,
                left: false,
            },
        },
        expectedResult: {
            arrowPosition: "left",
            placement: "top",
            position: {
                top: 0,
                left: expectedPositionOffset,
            },
        },
    },
];

describe("services >", () => {
    describe("PopoverModalService >", () => {
        let edgeDetectionService: EdgeDetectionService;
        let popoverModalService: PopoverModalService;
        let positionService: PositionService;
        let popover: HTMLDivElement;
        let triggerElement: HTMLDivElement;

        beforeAll(() => {
            edgeDetectionService = new EdgeDetectionService(new DomUtilService(document), document, new LoggerService());
            positionService = new PositionService(document);
            popoverModalService = new PopoverModalService(positionService, document, edgeDetectionService);

            popover = document.createElement("div");
            popover.innerHTML = "<div class='nui-popover-container' width='100' height='100'></div>";
            triggerElement = document.createElement("div");
            triggerElement.style.height = `${triggerElementDimension}px`;
            triggerElement.style.width = `${triggerElementDimension}px`;
            document.body.appendChild(triggerElement);
        });

        afterAll(() => {
            document.body.removeChild(triggerElement);
        });

        beforeEach(() => {
            // return uniform position since position service isn't focus of testing
            spyOn(positionService, "getPosition").and.returnValue({ top: 0, left: 0 });
        });

        describe("setPosition >", () => {
            popoverModalTestCases.forEach(test => {
                it(`should correctly calculate ${test.name}`, () => {
                    spyOn(edgeDetectionService, "canBe").and.returnValue(test.edgeDetectionResult);
                    const result = popoverModalService.setPosition(popover, triggerElement, true, test.placement);
                    expect(result).toEqual(test.expectedResult);
                });
            });
        });
    });
});
