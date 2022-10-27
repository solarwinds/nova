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
    CdkDragDrop,
    copyArrayItem,
    moveItemInArray,
    transferArrayItem,
} from "@angular/cdk/drag-drop";
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
    {
        name: COMPANY_IBM,
        industries: [{ name: INDUSTRY_SW }, { name: INDUSTRY_HW }],
    },
    {
        name: COMPANY_DELL,
        industries: [{ name: INDUSTRY_HW }, { name: INDUSTRY_SW }],
    },
];

@Component({
    selector: "dnd-dropzone-visual",
    templateUrl: "./dnd-dropzone-visual-example.component.html",
    styleUrls: ["./dnd-dropzone-visual-example.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DndDropzoneVisualExampleComponent {
    public companies: Company[] = availableCompanies;

    public industries: Industry[] = [
        { name: INDUSTRY_HW, companies: [{ name: COMPANY_IBM }] },
        { name: INDUSTRY_SW, companies: [] },
    ];

    // Note: Prevent user from putting back already displaced items
    public sourceAcceptsItem(): boolean {
        return false;
    }

    public destinationAcceptsItem(company: Company): boolean {
        return company.name === "Adobe" || company.name === "Dell";
    }

    public onItemDropped(event: CdkDragDrop<Company[]>) {
        if (!this.destinationAcceptsItem(event.item.data)) {
            return;
        }
        if (event.previousContainer === event.container) {
            moveItemInArray(
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        } else {
            if (
                event.previousContainer.element.nativeElement.classList.contains(
                    "dragzone"
                )
            ) {
                copyArrayItem(
                    event.previousContainer.data,
                    event.container.data,
                    event.previousIndex,
                    event.currentIndex
                );
            } else {
                transferArrayItem(
                    event.previousContainer.data,
                    event.container.data,
                    event.previousIndex,
                    event.currentIndex
                );
            }
        }
    }
}
