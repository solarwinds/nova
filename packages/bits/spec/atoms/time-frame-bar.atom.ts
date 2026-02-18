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
import { by, ElementFinder } from "protractor";

import { Atom } from "../atom";
import { ButtonAtom } from "./button.atom";
import { PopoverAtom } from "./popover.atom";
import { QuickPickerAtom } from "./quick-picker.atom";
import { TimeFramePickerAtom } from "./time-frame-picker.atom";
import { TimepickerAtom } from "./timepicker.atom";

export class TimeFrameBarAtom extends Atom {
    public static CSS_SELECTOR = ".nui-time-frame-bar";

    public readonly prevButton: ButtonAtom;
    public readonly nextButton: ButtonAtom;
    public readonly undoButton: ButtonAtom;
    public readonly clearButton: ButtonAtom;
    public readonly popover: PopoverAtom;
    public quickPicker: QuickPickerAtom;
    public timeFramePicker: TimeFramePickerAtom;
    public timeFramePickerCancelButton: ButtonAtom;
    public timeFramePickerUseButton: ButtonAtom;

    constructor(rootElement: ElementFinder) {
        super(rootElement);

        this.prevButton = Atom.findIn(
            ButtonAtom,
            rootElement.element(by.css(".prev"))
        );
        this.nextButton = Atom.findIn(
            ButtonAtom,
            rootElement.element(by.css(".next"))
        );
        this.undoButton = Atom.findIn(
            ButtonAtom,
            rootElement.element(by.css(".undo"))
        );
        this.clearButton = Atom.findIn(
            ButtonAtom,
            rootElement.element(by.css(".clear"))
        );
        this.popover = Atom.findIn(
            PopoverAtom,
            rootElement.element(by.css(".picker-label"))
        );

        const popoverBody = this.popover.getPopoverBody();
        this.quickPicker = Atom.findIn(QuickPickerAtom, popoverBody);
        this.timeFramePicker = Atom.findIn(TimeFramePickerAtom, popoverBody);
        this.timeFramePickerCancelButton = Atom.findIn(
            ButtonAtom,
            popoverBody.element(by.css(".cancel"))
        );
        this.timeFramePickerUseButton = Atom.findIn(
            ButtonAtom,
            popoverBody.element(by.css(".use"))
        );
    }

    public async quickPickPreset(presetTitle: string): Promise<void> {
        await this.popover.open();
        await this.quickPicker.selectPresetByTitle(presetTitle);
        return this.popover.waitForClosed();
    }

    // TODO: 1. Move this to TimeFramePickerAtom
    // TODO: 2. Improve DatePickerAtom, TimePickerAtom and DateTimePickerAtom with easy to use `select(m: Moment)` methods
    public async pickTimeFrame(start: Moment, end: Moment): Promise<void> {
        const date = "MM/DD/YYYY";
        const time = TimepickerAtom.defaultFormat;

        await this.popover.open();

        const startDate = this.timeFramePicker
            .getStartDatetimePicker()
            .getDatePicker();
        const startTime = this.timeFramePicker
            .getStartDatetimePicker()
            .getTimePicker();
        const endDate = this.timeFramePicker
            .getEndDatetimePicker()
            .getDatePicker();
        const endTime = this.timeFramePicker
            .getEndDatetimePicker()
            .getTimePicker();

        await startDate.clearText();
        await startDate.acceptText(start.format(date));

        await startTime.selectTime(start.format(time));

        await endDate.clearText();
        await endDate.acceptText(end.format(date));

        await endTime.selectTime(end.format(time));

        await this.timeFramePickerUseButton.click();
        return this.popover.waitForClosed();
    }
}
