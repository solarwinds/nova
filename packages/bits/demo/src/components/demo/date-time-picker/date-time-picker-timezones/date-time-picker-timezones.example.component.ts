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

import { Component } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import moment from "moment-timezone";

import { ISelectChangedEvent } from "@nova-ui/bits";

const zonesData = require("moment-timezone/data/packed/latest.json");
moment.tz.add(zonesData.zones);

@Component({
    selector: "nui-date-time-picker-timezones-example",
    templateUrl: "./date-time-picker-timezones.example.component.html",
})
export class DateTimePickerTimezonesExampleComponent {
    public control = new FormControl(moment(), {
        validators: Validators.required,
        nonNullable: true,
    });
    public zones: string[] = zonesData.zones.map(
        (z: string) => z.split("|")[0]
    );
    public displayedZones = this.zones;
    public initialZone = "Australia/Sydney";

    get selectedDate(): string {
        return this.control.value.toString();
    }

    constructor() {
        this.control.setValue(this.control.value.tz(this.initialZone));
    }

    public textboxChanged(searchQuery: ISelectChangedEvent<any>): void {
        const val = searchQuery.newValue;
        this.displayedZones = this.zones.filter((z) =>
            z.toLowerCase().includes(val.toLowerCase())
        );

        if (this.zones.find((z) => z === val)) {
            this.control.setValue(this.control.value.tz(val));
        }
    }
}
