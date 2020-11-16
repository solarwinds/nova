import {Component} from "@angular/core";
import { IRepeatItemConfig, RepeatComponent } from "@solarwinds/nova-bits";

@Component({
    selector: "nui-repeat-example",
    templateUrl: "./repeat-docs.example.component.html",
})
export class RepeatExampleComponent {
    getItemConfigKey(key: keyof IRepeatItemConfig): string {
        return key;
    }

    getRepeatPropKey(key: keyof RepeatComponent): string {
        return key;
    }
}
