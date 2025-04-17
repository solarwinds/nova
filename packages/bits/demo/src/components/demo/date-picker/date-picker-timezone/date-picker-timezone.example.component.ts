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
    Component,
    computed,
    OnInit,
    signal,
    Signal,
    WritableSignal,
} from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import moment from "moment-timezone";

import { OptionValueType } from "@nova-ui/bits";

@Component({
    selector: "nui-date-picker-timezone-example",
    templateUrl: "./date-picker-timezone.example.component.html",
    standalone: false
})
export class DatePickerTimezoneExampleComponent implements OnInit {
    public control = new FormControl(moment(), {
        validators: [Validators.required],
        nonNullable: true,
    });
    public selectedZone = new FormControl("");
    public zonesDataS: WritableSignal<{
        zones: string[];
    }> = signal({ zones: [] });

    public zonesS: Signal<string[]> = computed(() =>
        this.zonesDataS().zones.map((z: string) => z.split("|")[0])
    );

    constructor() {}

    get selectedDate(): string {
        return this.control.value?.toString();
    }

    async ngOnInit(): Promise<void> {
        const zonesData = await import(
            "moment-timezone/data/packed/latest.json"
        );
        moment.tz.add(zonesData.default.zones);
        const zones = zonesData.default.zones;
        this.zonesDataS.set({ zones });
        this.selectedZone.setValue(this.zonesS()[0]);
    }

    public changeZone(
        $event: OptionValueType | OptionValueType[] | null
    ): void {
        if (!$event) {
            return;
        }
        this.control.setValue(this.control.value.tz($event as string));
    }
}
