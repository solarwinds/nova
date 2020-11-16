import { Component } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { ISelectChangedEvent } from "@solarwinds/nova-bits";
import moment from "moment-timezone";

const zonesData = require("moment-timezone/data/packed/latest.json");
moment.tz.add(zonesData.zones);

@Component({
    selector: "nui-date-time-picker-timezones-example",
    templateUrl: "./date-time-picker-timezones.example.component.html",
})
export class DateTimePickerTimezonesExampleComponent {
    public control = new FormControl(moment(), Validators.required);
    get selectedDate() { return this.control.value.toString(); }
    public zones: string[] = zonesData.zones.map((z: string) => z.split("|")[0]);
    public displayedZones = this.zones;
    public initialZone = "Australia/Sydney";

    constructor() {
        this.control.setValue(this.control.value.tz(this.initialZone));
    }

    public textboxChanged(searchQuery: ISelectChangedEvent<any>) {
        const val = searchQuery.newValue;
        this.displayedZones = this.zones.filter(z => z.toLowerCase().includes(val.toLowerCase()));

        if (this.zones.find(z => z === val)) {
            this.control.setValue(this.control.value.tz(val));
        }
    }
}
