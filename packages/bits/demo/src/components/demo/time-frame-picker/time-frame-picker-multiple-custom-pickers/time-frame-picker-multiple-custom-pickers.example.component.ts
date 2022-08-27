import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    QueryList,
    ViewChildren,
} from "@angular/core";
import { Subject } from "rxjs";

import {
    ITimeframe,
    ITimeFramePresetDictionary,
    TimeframeService,
} from "@nova-ui/bits";

interface IPicker {
    id: string;
    presets: ITimeFramePresetDictionary;
    timeframeService?: TimeframeService;
    tf?: ITimeframe;
    acceptedTimeframe?: ITimeframe;
    selectedPresetKey: string;
}

@Component({
    selector: "nui-time-frame-picker-multiple-custom-pickers",
    templateUrl:
        "./time-frame-picker-multiple-custom-pickers.example.component.html",
})
export class TimeFramePickerMultipleCustomPickersExampleComponent
    implements AfterViewInit
{
    @ViewChildren("scoper")
    private tfScopers: QueryList<TimeframeServiceScoperExampleComponent>;

    public pickers: IPicker[] = [
        {
            id: "1",
            presets: {
                last42Hours: {
                    name: $localize`Last 42 hours`,
                    startDatetimePattern: { hours: -42 },
                    endDatetimePattern: {},
                },
                last749Days: {
                    name: $localize`Last 749 days`,
                    startDatetimePattern: { days: -749 },
                    endDatetimePattern: {},
                },
            },
            selectedPresetKey: "last749Days",
        },
        {
            id: "2",
            presets: {
                last42Hours: {
                    name: $localize`Last 42 hours`,
                    startDatetimePattern: { hours: -42 },
                    endDatetimePattern: {},
                },
            },
            selectedPresetKey: "last42Hours",
        },
        {
            id: "3",
            presets: {
                lastYear: {
                    name: $localize`Last year`,
                    startDatetimePattern: { year: -1 },
                    endDatetimePattern: {},
                },
                last10Years: {
                    name: $localize`Last 10 years`,
                    startDatetimePattern: { year: -10 },
                    endDatetimePattern: {},
                },
            },
            selectedPresetKey: "lastYear",
        },
    ];

    public presets: ITimeFramePresetDictionary = {
        last42Hours: {
            name: $localize`Last 42 hours`,
            startDatetimePattern: { hours: -42 },
            endDatetimePattern: {},
        },
        last749Days: {
            name: $localize`Last 749 days`,
            startDatetimePattern: { days: -749 },
            endDatetimePattern: {},
        },
    };

    public showFooter: boolean = false;

    public closePopoverSubject = new Subject();
    public openPopoverSubject = new Subject();

    constructor(private cdRef: ChangeDetectorRef) {}

    public updateTf(value: ITimeframe, index: number) {
        const picker = this.pickers[index];
        picker.tf = value;

        const timeFrameDatesValid = () =>
            picker.timeframeService?.areTimeFrameDatesValid(value);
        const timeFrameDatesEqual = () =>
            picker.timeframeService?.isEqual(
                <ITimeframe>picker.tf,
                <ITimeframe>picker.acceptedTimeframe
            );
        if (timeFrameDatesValid() && !timeFrameDatesEqual()) {
            this.showFooter = true;
        }

        picker.selectedPresetKey = <string>picker.tf.selectedPresetId;
    }

    public ngAfterViewInit() {
        this.tfScopers.forEach((scoper, i) => {
            const picker = this.pickers[i];
            const timeframeService = scoper.timeframeService;

            picker.timeframeService = timeframeService;
            timeframeService.currentPresets = picker.presets;
            picker.acceptedTimeframe = timeframeService.getTimeframeByPresetId(
                picker.selectedPresetKey
            );
            picker.tf = picker.acceptedTimeframe;
        });
        this.cdRef.detectChanges();
    }

    public confirmPopover(index: number) {
        const picker = this.pickers[index];

        this.showFooter = false;
        this.closePopoverSubject.next();
        picker.acceptedTimeframe = picker.tf;
    }
    public cancelPopover(index: number) {
        this.showFooter = false;
        this.closePopoverSubject.next();
    }

    public handlePresetSelection(presetKey: string, index: number) {
        const picker = this.pickers[index];

        picker.selectedPresetKey = presetKey;
        picker.tf = picker.timeframeService?.getTimeframeByPresetId(presetKey);
        picker.acceptedTimeframe = picker.tf;
        this.closePopoverSubject.next();
    }
}

@Component({
    selector: "nui-time-frame-service-scoper",
    providers: [TimeframeService],
    template: `<ng-content></ng-content>`,
})
export class TimeframeServiceScoperExampleComponent {
    constructor(public timeframeService: TimeframeService) {}
}
