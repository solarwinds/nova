import { CdkDragDrop, copyArrayItem, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { ChangeDetectionStrategy, Component } from "@angular/core";

class Company {
    name: string;
    industries?: Industry[];
}

const COMPANY_ADOBE: string = "Adobe";
const COMPANY_IBM: string = "IBM";
const COMPANY_DELL: string = "Dell";

class Industry {
    name: string;
    companies?: Company[];
}

const INDUSTRY_HW: string = "Hardware";
const INDUSTRY_SW: string = "Software";

const availableCompanies: Company[] = [
    { name: COMPANY_ADOBE, industries: [{ name: INDUSTRY_SW }] },
    { name: COMPANY_IBM, industries: [{ name: INDUSTRY_SW }, { name: INDUSTRY_HW }] },
    { name: COMPANY_DELL, industries: [{ name: INDUSTRY_HW }, { name: INDUSTRY_SW }] },
];

@Component({
    selector: "dnd-dropzone-visual",
    templateUrl: "./dnd-dropzone-visual-example.component.html",
    styleUrls: ["./dnd-dropzone-visual-example.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DndDropzoneVisualExampleComponent {
    public companies: Company[] = availableCompanies;

    public industries: Industry[] = [{ name: INDUSTRY_HW, companies: [{ name: COMPANY_IBM }] }, { name: INDUSTRY_SW, companies: [] }];

    // Note: Prevent user from putting back already displaced items
    public sourceAcceptsItem(): boolean {
        return false;
    }

    public destinationAcceptsItem(company: Company): boolean {
        return company.name === "Adobe" || company.name === "Dell";
    }

    public onItemDropped(event: CdkDragDrop<Company[]>): void {
        if (!this.destinationAcceptsItem(event.item.data)) {
            return;
        }
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
            return;
        }
        if (event.previousContainer.element.nativeElement.classList.contains("dragzone")) {
            copyArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
            return;
        }
        transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
}
