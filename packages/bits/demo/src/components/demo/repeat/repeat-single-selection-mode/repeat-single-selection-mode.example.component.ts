import { Component } from "@angular/core";


@Component({
    selector: "nui-repeat-single-selection-mode-example",
    templateUrl: "./repeat-single-selection-mode.example.component.html",
    styleUrls: [
        "./repeat-single-selection-mode.example.less",
    ],
})
export class RepeatSingleSelectionModeExampleComponent {
    public people = [
        { name: "Jo Smith", level: $localize`bronze`, status: $localize`active` },
        { name: "Claire Rogan", level: $localize`gold`, status: $localize`active`, disabled: true },
        { name: "Declan McGregor", level: $localize`platinum`, status: $localize`active` },
        { name: "Fergus O'Brien", level: $localize`bronze`, status: $localize`inactive` },
        { name: "Catriona Kildare", level: $localize`gold`, status: $localize`active` },
    ];

    public selectedPeople = [this.people[2]];

    constructor() { }

    public onPeopleSelectionChange(selection: any): void {
        this.selectedPeople = selection;
    }
}
