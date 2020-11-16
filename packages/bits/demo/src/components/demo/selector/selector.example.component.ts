import { Component } from "@angular/core";
import { CheckboxStatus, IMenuGroup, SelectionType } from "@solarwinds/nova-bits";

@Component({
    selector: "nui-selector-example",
    templateUrl: "./selector.example.component.html",
})
export class SelectorExampleComponent {

    public selection: SelectionType = SelectionType.None;
    public availableStatuses: IMenuGroup[] = this.getMenuItems([SelectionType.All, SelectionType.AllPages, SelectionType.None]);
    public checkBoxStatus: CheckboxStatus = CheckboxStatus.Unchecked;
    public appendToBody = false;

    public onSelectionChange(event: SelectionType): void {
        this.selection = event;
        switch (this.selection) {
            case SelectionType.All:
                this.availableStatuses = this.getMenuItems([SelectionType.AllPages, SelectionType.None]);
                break;
            case SelectionType.AllPages:
                this.availableStatuses = this.getMenuItems([SelectionType.All, SelectionType.None]);
                break;
            case SelectionType.None:
                this.availableStatuses = this.getMenuItems([SelectionType.All, SelectionType.AllPages]);
                break;
        }
    }

    public makeIndeterminate(): void {
        this.checkBoxStatus = CheckboxStatus.Indeterminate;
    }

    public makeAppendedToBody(): void {
        this.appendToBody = true;
    }

    public getMenuItems(arr: SelectionType[]): IMenuGroup[] {
        const resultArr: IMenuGroup[] = [{
            itemsSource: [],
        }];
        arr.map((element: SelectionType) => {
            resultArr[0].itemsSource.push({ value: element, title: element });
        });
        return resultArr;
    }

}
