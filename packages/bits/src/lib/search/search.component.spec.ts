import { SearchComponent } from "./search.component";

describe("components >", () => {
    describe("search >", () => {
        let subject: SearchComponent;

        beforeEach(() => {
            subject = new SearchComponent();
        });

        it("should provide custom placeholder if specified", () => {
            const customPlaceholder = "custom";
            subject.placeholder = customPlaceholder;
            expect(subject.getPlaceholder()).toEqual(customPlaceholder);
        });

        it("should provide default placeholder if no custom one is provided", () => {
            subject.placeholder = "";
            expect(subject.getPlaceholder()).toEqual(
                subject.defaultPlaceholder + "..."
            );
            // @ts-ignore: Suppressing error for testing purposes
            subject.placeholder = undefined;
            expect(subject.getPlaceholder()).toEqual(
                subject.defaultPlaceholder + "..."
            );
        });

        it("should set 'captureFocus' and emit 'focusChange' with true passed on cancel", () => {
            subject.captureFocus = false;
            spyOn(subject.focusChange, "emit");
            subject.onCancel();
            expect(subject.captureFocus).toEqual(true);
            expect(subject.focusChange.emit).toHaveBeenCalledWith(true);
        });

        it("should emit 'cancel' with empty string passed if 'cancel' btn clicked", () => {
            const currentInput = "current input";
            subject.value = currentInput;
            spyOn(subject.cancel, "emit");
            subject.onCancel();
            expect(subject.cancel.emit).toHaveBeenCalledWith("");
        });

        it("should emit 'inputChange' event with current input string passed on each input change", () => {
            const currentInput = "current input";
            subject.value = currentInput;
            spyOn(subject.inputChange, "emit");
            subject.onInputChange();
            expect(subject.inputChange.emit).toHaveBeenCalledWith(currentInput);
        });

        it("should emit 'search' event with current input string passed", () => {
            const currentInput = "current input";
            subject.value = currentInput;
            spyOn(subject.search, "emit");
            subject.onSearch();
            expect(subject.search.emit).toHaveBeenCalledWith(currentInput);
        });

        it("should emit 'search' event when ENTER pressed", () => {
            const currentInput = "current input";
            subject.value = currentInput;
            spyOn(subject.search, "emit");
            const keyboardEvent = <KeyboardEvent>{ key: "Enter" };
            subject.onKeyup(keyboardEvent);
            expect(subject.search.emit).toHaveBeenCalledWith(currentInput);
        });
    });
});
