import { ToolbarKeyboardService } from "./toolbar-keyboard.service";
import { KEYBOARD_CODE } from "../../constants";

const keyboardEventMock: KeyboardEvent = {
    code: KEYBOARD_CODE.ARROW_LEFT,
    preventDefault: () => {},
} as KeyboardEvent;

function createTestDomElements(): void {
    const fragment = document.createDocumentFragment();
    const container = document.createElement("div");
    const dynamicContainer = document.createElement("div");

    container.id = "testContainer";
    dynamicContainer.classList.add("nui-toolbar-content__dynamic");

    for (let i = 1; i <= 3; i++) {
        const btn = document.createElement("button");
        btn.id = `button-${i}`;
        btn.classList.add("testButton");
        dynamicContainer.appendChild(btn);
    }

    container.appendChild(dynamicContainer);
    fragment.appendChild(container);
    document.body.appendChild(fragment);
}

describe("Services > ", () => {
    describe("ToolbarKeyboardService", () => {
        const service = new ToolbarKeyboardService();

        beforeAll(() => {
            createTestDomElements();
        });

        afterAll(() => {
            const container = document.getElementById("testContainer");

            (container as HTMLElement).remove();
        });

        beforeEach(() => {
            const buttons = document.querySelectorAll(".testButton");

            service.setToolbarItems(Array.from(buttons) as HTMLElement[]);
        });

        describe("onKeyDown", () => {
            const rightButtonPressEvent = {
                ...keyboardEventMock,
                ...{ code: KEYBOARD_CODE.ARROW_RIGHT },
            };

            it("should call preventDefault", () => {
                const spy = spyOn(keyboardEventMock, "preventDefault");

                service.onKeyDown(keyboardEventMock);
                expect(spy).toHaveBeenCalled();
            });

            it("should call navigateByArrow method", () => {
                const spy = spyOn(service, "navigateByArrow" as never);
                const { code } = keyboardEventMock;

                service.onKeyDown(keyboardEventMock);
                expect(spy).toHaveBeenCalledWith(code as never);
            });

            it("should navigate to first if last element in focus on press right arrow button", () => {
                const items = service["toolbarItems"];
                const first = items[0];
                const last = items[items.length - 1];
                const spy = spyOn(first, "focus");

                last.focus();

                service.onKeyDown(rightButtonPressEvent);
                expect(spy).toHaveBeenCalled();
            });

            it("should navigate to last if firs element in focus on press left arrow button", () => {
                const items = service["toolbarItems"];
                const first = items[0];
                const last = items[items.length - 1];
                const spy = spyOn(last, "focus");

                first.focus();

                service.onKeyDown(keyboardEventMock);
                expect(spy).toHaveBeenCalled();
            });

            it("should move right on pressing right arrow button", () => {
                const items = service["toolbarItems"];
                const first = items[0];
                const next = items[1];
                const spy = spyOn(next, "focus");

                first.focus();

                service.onKeyDown(rightButtonPressEvent);
                expect(spy).toHaveBeenCalled();
            });
        });
    });
});
