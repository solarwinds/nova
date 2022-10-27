// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

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
