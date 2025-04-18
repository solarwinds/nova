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

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation,
} from "@angular/core";

import { IQuickPickPresetDictionary } from "../public-api";

@Component({
    selector: "nui-quick-picker",
    templateUrl: "./quick-picker.component.html",
    styleUrls: ["./quick-picker.component.less"],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class QuickPickerComponent {
    @Input() presets: IQuickPickPresetDictionary;
    @Input() pickerTitle: string;
    @Input() presetsTitle: string = $localize`Quick picks`;

    @Input() selectedPreset?: string;

    /**
     * To control an order of presetKeys
     */
    @Input() public presetKeysOrder: string[];

    /** callback to invoke on selecting specific preset */
    @Output() public presetSelected = new EventEmitter<string>();

    public get presetKeys(): string[] {
        return this.presetKeysOrder || Object.keys(this.presets);
    }

    constructor(public changeDetector: ChangeDetectorRef) {}

    public selectPreset(key: string): void {
        this.presetSelected.emit(key);
    }

    public isPresetSelected(key: string): boolean {
        return this.selectedPreset === key;
    }
}
