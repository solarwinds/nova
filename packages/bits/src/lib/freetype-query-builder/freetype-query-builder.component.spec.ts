// © 2023 SolarWinds Worldwide, LLC. All rights reserved.
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

import { Subject } from "rxjs";
import { take } from "rxjs/operators";

import { FreetypeQueryBuilderComponent } from "./freetype-query-builder.component";

describe("FreetypeQueryBuilderComponent", () => {
    describe("UnitTests", () => {
        const cd = jasmine.createSpyObj("ChangeDetectorRef", [
            "markForCheck",
            "detectChanges",
        ]);
        const renderer2 = jasmine.createSpyObj("Renderer2", ["listen"]);
        const formBuilder = jasmine.createSpyObj("FormBuilder", ["group"]);
        const group = jasmine.createSpyObj("FormGroup", ["get"]);
        const bodyControl = jasmine.createSpyObj("FormControl", ["patchValue"]);
        group.get.and.returnValue(bodyControl);
        formBuilder.group.and.returnValue(group);
        const toastService = jasmine.createSpyObj("ToastService", ["error"]);
        const ta = jasmine.createSpyObj("ElementRef", ["valueOf"]);
        ta.nativeElement = jasmine.createSpyObj("HtmlElement", [
            "addEventListener",
            "removeEventListener",
        ]);
        ta.nativeElement.style = {};
        const taH = jasmine.createSpyObj("ElementRef", ["valueOf"]);
        taH.nativeElement = jasmine.createSpyObj("HtmlElement", [
            "addEventListener",
            "removeEventListener",
        ]);
        taH.container = { scrollHeight: 10 };
        taH.nativeElement.style = {};
        const qs = jasmine.createSpyObj("SelectV2Component", [
            "showDropdown",
            "hideDropdown",
        ]);
        qs.isDropdownOpen = false;
        qs.valueSelected = new Subject();
        qs.inputElement = jasmine.createSpyObj("ElementRef", ["valueOf"]);
        qs.inputElement.nativeElement = jasmine.createSpyObj("HtmlElement", [
            "addEventListener",
            "removeEventListener",
        ]);

        const utils = jasmine.createSpyObj("FreeTypeQueryUtilsService", [
            "getTextareaCaretCoordinates",
        ]);
        utils.getTextareaCaretCoordinates.and.returnValue({
            top: 0,
            left: 0,
            scrollTop: 0,
        });
        let tooLongDropEvent: jasmine.SpyObj<DragEvent>;
        let keyDownEvent: KeyboardEvent;
        let instance: FreetypeQueryBuilderComponent<any> =
            new FreetypeQueryBuilderComponent(
                renderer2,
                formBuilder,
                cd,
                toastService,
                utils
            );

        beforeEach(() => {
            instance = new FreetypeQueryBuilderComponent(
                renderer2,
                formBuilder,
                cd,
                toastService,
                utils
            );
            instance.querySelect = qs;
            instance.messageTextarea = ta;
            instance.textHighlightOverlay = ta;
            instance.messageTextareaHolder = taH;
            instance.textHighlightOverlay = taH;
        });

        describe("onDrop", () => {
            beforeAll(() => {
                tooLongDropEvent = jasmine.createSpyObj("DragEvent", [
                    "preventDefault",
                ]);
            });

            it("should block update which would exceed input max length", () => {
                Object.assign(tooLongDropEvent, {
                    dataTransfer: { getData: () => "123456" },
                });
                instance.maxLength = 5;
                instance.value = "123";

                instance.onDrop(tooLongDropEvent);

                expect(toastService.error).toHaveBeenCalled();
                expect(tooLongDropEvent.preventDefault).toHaveBeenCalled();
            });

            it("should properly drop valid value", () => {
                Object.assign(tooLongDropEvent, {
                    dataTransfer: { getData: () => "16" },
                });
                toastService.error.calls.reset();
                tooLongDropEvent.preventDefault.calls.reset();
                instance.maxLength = 500;
                instance.value = "123";

                instance.onDrop(tooLongDropEvent);

                expect(toastService.error).not.toHaveBeenCalled();
                expect(tooLongDropEvent.preventDefault).not.toHaveBeenCalled();
            });
        });

        describe("onKeyUp", () => {
            beforeAll(() => {
                instance.value = "123456";
            });

            it("Should not update cursor on ENTER", () => {
                spyOn(instance.cursorPos, "emit");

                instance.onKeyUp({
                    key: "Enter",
                    target: { selectionStart: 0 },
                } as any);

                expect(instance.cursorPos.emit).not.toHaveBeenCalled();
            });

            it("Should update cursor", () => {
                spyOn(instance.cursorPos, "emit");

                instance.onKeyUp({
                    key: "a",
                    target: { selectionStart: 3 },
                } as any);

                expect(instance.cursorPos.emit).toHaveBeenCalledWith(3);
            });

            it("Should update coordinates", () => {
                spyOn(instance.cursorCoords, "emit");

                instance.onKeyUp({
                    key: "Escape",
                    target: { selectionStart: 0 },
                } as any);

                expect(instance.cursorCoords.emit).toHaveBeenCalled();
            });

            it("Should not open options on ESC", () => {
                qs.showDropdown.calls.reset();
                qs.isDropdownOpen = false;

                instance.onKeyUp({
                    key: "Escape",
                    target: { selectionStart: 0 },
                } as any);

                expect(qs.showDropdown).not.toHaveBeenCalled();
            });

            it("Should close options on ESC", () => {
                qs.hideDropdown.calls.reset();
                qs.isDropdownOpen = false;

                instance.onKeyUp({
                    key: "Escape",
                    target: { selectionStart: 0 },
                } as any);

                expect(qs.hideDropdown).toHaveBeenCalled();
            });

            it("Should open options", () => {
                qs.showDropdown.calls.reset();
                qs.isDropdownOpen = false;

                instance.onKeyUp({
                    key: "a",
                    target: { selectionStart: 0 },
                } as any);

                expect(qs.showDropdown).toHaveBeenCalled();
            });
        });

        describe("onKeyDown", () => {
            beforeAll(() => {
                keyDownEvent = jasmine.createSpyObj("KeyboardEvent", [
                    "preventDefault",
                ]);
            });

            it("Should emit submit on ENTER when options not open", () => {
                (instance.querySelect as any).isDropdownOpen = false;
                Object.assign(keyDownEvent, { key: "Enter" });
                spyOn(instance.submitQuery, "emit");

                instance.onKeyDown(keyDownEvent);

                expect(instance.submitQuery.emit).toHaveBeenCalled();
            });

            it("Should not emit submit on ENTER when options are open", () => {
                (instance.querySelect as any).isDropdownOpen = true;
                Object.assign(keyDownEvent, { key: "Enter" });
                spyOn(instance.submitQuery, "emit");

                instance.onKeyDown(keyDownEvent);

                expect(instance.submitQuery.emit).not.toHaveBeenCalled();
            });

            it("Should not emit submit on key other than ENTER", () => {
                (instance.querySelect as any).isDropdownOpen = false;
                Object.assign(keyDownEvent, { key: "a" });

                spyOn(instance.submitQuery, "emit");

                instance.onKeyDown(keyDownEvent);

                expect(instance.submitQuery.emit).not.toHaveBeenCalled();
            });
        });

        describe("onClick", () => {
            it("Should update cursor", (done: DoneFn) => {
                instance.cursorPos.pipe(take(1)).subscribe((pos: number) => {
                    expect(pos).toEqual(3);
                    done();
                });

                instance.onClick({ target: { selectionStart: 3 } } as any);
            });

            it("Should open options", () => {
                qs.showDropdown.calls.reset();
                qs.isDropdownOpen = false;

                instance.onClick({ target: { selectionStart: 0 } } as any);

                expect(qs.showDropdown).toHaveBeenCalled();
            });
        });

        describe("itemSelected", () => {
            it("Should emit item selected", () => {
                spyOn(instance.helpItemSelected, "emit");

                instance.itemSelected({ newValue: { value: "newVal" } } as any);

                expect(instance.helpItemSelected.emit).toHaveBeenCalledWith({
                    value: "newVal",
                });
            });
        });

        describe("ngOnChanges", () => {
            it("should patch value if value changed", () => {
                instance.ngOnChanges({ value: { currentValue: "aaa" } } as any);

                expect(bodyControl.patchValue).toHaveBeenCalledWith("aaa");
            });
        });

        describe("onDestroy", () => {
            it("should clear listeners", () => {
                instance.ngOnDestroy();

                expect(
                    taH.nativeElement.removeEventListener
                ).toHaveBeenCalled();
            });
        });
    });
});
