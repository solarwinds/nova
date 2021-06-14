import { ToolbarKeyboardService } from "./toolbar-keyboard.service";
import { MenuComponent } from "../menu";

const buttonsMock = [
    {
        focus: () => {},
    },
    {
        focus: () => {},
    },
] as HTMLButtonElement[];

const menuMock = {
    popup: { isOpen: false },
} as MenuComponent;

const moreBtnMock = {} as HTMLButtonElement;

describe("Services > ", () => {
    describe("ToolbarKeyboardService", () => {
        const service = new ToolbarKeyboardService();

        service.menuComponent = menuMock;
        service.moreBtn = moreBtnMock;

        describe("navigateFormMoreBtn", () => {
            it("should close menu if open", () => {
                (service.menuComponent as MenuComponent).popup.isOpen = true;

                service["navigateFromMoreBtn"](1, buttonsMock);
                expect(service.menuComponent?.popup.isOpen).toBeFalse();
            });

            it("should focus on first button if direction 1", () => {
                const spy = spyOn(buttonsMock[0], "focus");

                service["navigateFromMoreBtn"](1, buttonsMock);
                expect(spy).toHaveBeenCalled();
            });

            it("should focus on last button if direction 0", () => {
                const spy = spyOn(buttonsMock[1], "focus");

                service["navigateFromMoreBtn"](0, buttonsMock);
                expect(spy).toHaveBeenCalled();
            });
        })
    });

});
