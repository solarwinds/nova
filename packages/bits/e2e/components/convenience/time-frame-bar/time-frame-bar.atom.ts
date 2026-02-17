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

import { Moment } from "moment/moment";

import { Atom } from "../../../atom";
import { ButtonAtom } from "../../button/button.atom";
import { PopoverAtom } from "../../popover/popover.atom";
import { QuickPickerAtom } from "../../time-frame-picker/quick-picker.atom";
import { TimeFramePickerAtom } from "../../time-frame-picker/time-frame-picker.atom";
import { TimepickerAtom } from "../../timepicker/timepicker.atom";

export class TimeFrameBarAtom extends Atom {
    public static CSS_CLASS = "nui-time-frame-bar";

    public readonly prevButton: ButtonAtom;
    public readonly nextButton: ButtonAtom;
    public readonly undoButton: ButtonAtom;
    public readonly clearButton: ButtonAtom;
    public readonly popover: PopoverAtom;
    public quickPicker: QuickPickerAtom;
    public timeFramePicker: TimeFramePickerAtom;
    public timeFramePickerCancelButton: ButtonAtom;
    public timeFramePickerUseButton: ButtonAtom;

    constructor(rootElement = Atom.getFromRoot(`.${TimeFrameBarAtom.CSS_CLASS}`)) {
        super(rootElement);

        // ButtonAtom/PopoverAtom have their own CSS selectors, so we pass the button element itself
        this.prevButton = new ButtonAtom(rootElement.locator(".prev button"));
        this.nextButton = new ButtonAtom(rootElement.locator(".next button"));
        this.undoButton = new ButtonAtom(rootElement.locator("button.undo"));
        this.clearButton = new ButtonAtom(rootElement.locator("button.clear"));

        // `PopoverAtom` root should be the trigger element
        this.popover = new PopoverAtom(rootElement.locator(".picker-label"));

        const popoverBody = this.popover.getPopoverBody();
        this.quickPicker = Atom.findIn(QuickPickerAtom, popoverBody) as QuickPickerAtom;
        this.timeFramePicker = Atom.findIn(
            TimeFramePickerAtom,
            popoverBody
        ) as TimeFramePickerAtom;
        this.timeFramePickerCancelButton = new ButtonAtom(
            popoverBody.locator(".cancel")
        );
        this.timeFramePickerUseButton = new ButtonAtom(
            popoverBody.locator(".use")
        );
    }

    public async quickPickPreset(presetTitle: string): Promise<void> {
        await this.popover.open();
        await this.quickPicker.selectPresetByTitle(presetTitle);
        await this.popover.waitForClosed();
    }

    // TODO: 1. Move this to TimeFramePickerAtom
    // TODO: 2. Improve DatePickerAtom, TimePickerAtom and DateTimePickerAtom with easy to use `select(m: Moment)` methods
    public async pickTimeFrame(start: Moment, end: Moment): Promise<void> {
        const date = "MM/DD/YYYY";
        const time = TimepickerAtom.defaultFormat;

        await this.popover.open();

        const startDate = this.timeFramePicker
            .getStartDatetimePicker()
            .datePicker;
        const startTime = this.timeFramePicker
            .getStartDatetimePicker()
            .timePicker;
        const endDate = this.timeFramePicker
            .getEndDatetimePicker()
            .datePicker;
        const endTime = this.timeFramePicker
            .getEndDatetimePicker()
            .timePicker;

        await startDate.textbox.clearText();
        await startDate.textbox.acceptText(start.format(date));

        await startTime.selectTime(start.format(time));

        await endDate.textbox.clearText();
        await endDate.textbox.acceptText(end.format(date));

        await endTime.selectTime(end.format(time));

        await this.timeFramePickerUseButton.click();
        await this.popover.waitForClosed();
    }
}
