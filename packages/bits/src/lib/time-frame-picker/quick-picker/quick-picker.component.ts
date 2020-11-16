import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation
} from "@angular/core";

import { IQuickPickPresetDictionary } from "../public-api";

@Component({
    selector: "nui-quick-picker",
    templateUrl: "./quick-picker.component.html",
    styleUrls: ["./quick-picker.component.less"],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickPickerComponent {

    @Input() presets: IQuickPickPresetDictionary;
    @Input() pickerTitle: string;
    @Input() presetsTitle: string = $localize `Quick picks`;

    @Input() selectedPreset?: string;

    /**
     * To control an order of presetKeys
     */
    @Input() public presetKeysOrder: string[];


    /** callback to invoke on selecting specific preset*/
    @Output() public presetSelected = new EventEmitter<string>();

    public get presetKeys(): string[] {
        return this.presetKeysOrder || Object.keys(this.presets);
    }

    constructor(public changeDetector: ChangeDetectorRef) {}

    public selectPreset(key: string) {
        this.presetSelected.emit(key);
    }

    public isPresetSelected(key: string) {
        return this.selectedPreset === key;
    }
}
