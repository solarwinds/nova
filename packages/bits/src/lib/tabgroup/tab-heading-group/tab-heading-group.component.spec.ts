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
    ChangeDetectorRef,
    Component,
    QueryList,
    ViewChild,
    ViewChildren,
} from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { TabHeadingGroupComponent } from "./tab-heading-group.component";
import { IconComponent } from "../../icon/icon.component";
import { TabHeadingComponent } from "../tab-heading/tab-heading.component";

/**
 * @ignore
 */
@Component({
    selector: "nui-test-tab-heading-group-cmp",
    template: ` <nui-tab-heading-group (selected)="updateContent($event)">
        <nui-tab-heading
            *ngFor="let tab of tabsetContent"
            [tabId]="tab.id"
            [active]="currentTabId === tab.id"
        >
            <div class="d-flex align-content-center">
                <div class="d-inline-flex align-items-center">
                    <span [title]="tab.title">{{ tab.title }}</span>
                </div>
            </div>
        </nui-tab-heading>
    </nui-tab-heading-group>`,
    standalone: false
})
class TestTabHeadingComponent {
    public currentTabId: string;
    public tabsetContent: any[] = [];

    @ViewChild(TabHeadingGroupComponent, { static: true })
    tabHeadingGroup: TabHeadingGroupComponent;
    @ViewChildren(TabHeadingComponent)
    tabHeadings: QueryList<TabHeadingComponent>;

    constructor(private changeDetector: ChangeDetectorRef) {
        this.addTab();
        this.addTab();
    }

    public updateContent(tabId: string) {
        this.currentTabId = tabId;
        this.changeDetector.detectChanges();
    }
    public addTab() {
        const nextIndex = this.tabsetContent.length + 1;
        this.tabsetContent.push({
            id: `${nextIndex}`,
            title: "Tab " + nextIndex,
            content: "Lorem ipsum #" + nextIndex,
        });
    }
    public popTab() {
        this.tabsetContent.pop();
    }
}

describe("components >", () => {
    describe("tab heading group >", () => {
        let componentFixture: ComponentFixture<TestTabHeadingComponent>;
        let subject: TestTabHeadingComponent;

        beforeEach(waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [
                    TabHeadingGroupComponent,
                    TabHeadingComponent,
                    TestTabHeadingComponent,
                    IconComponent,
                ],
            })
                .compileComponents()
                .then(() => {
                    componentFixture = TestBed.createComponent(
                        TestTabHeadingComponent
                    );
                    subject = componentFixture.componentInstance;
                });
        }));

        it("should add tabs initially", () => {
            componentFixture.detectChanges();
            expect(subject.tabHeadings.toArray().length).toEqual(2);
        });

        it("should subscribe and unsubscribe from child tabs", () => {
            componentFixture.detectChanges();
            expect(
                (subject.tabHeadingGroup as any)._tabSelectedSubscriptions
                    .length
            ).toEqual(2);
            subject.addTab();
            componentFixture.detectChanges();
            expect(
                (subject.tabHeadingGroup as any)._tabSelectedSubscriptions
                    .length
            ).toEqual(3);
            subject.popTab();
            subject.popTab();
            componentFixture.detectChanges();
            expect(
                (subject.tabHeadingGroup as any)._tabSelectedSubscriptions
                    .length
            ).toEqual(1);
            spyOn(
                (subject.tabHeadingGroup as any)._tabSelectedSubscriptions[0],
                "unsubscribe"
            );
            subject.tabHeadingGroup.ngOnDestroy();
            expect(
                (subject.tabHeadingGroup as any)._tabSelectedSubscriptions[0]
                    .unsubscribe
            ).toHaveBeenCalled();
        });

        it("should publish tabId of new tab", () => {
            componentFixture.detectChanges();
            expect(subject.currentTabId).toBe("1");
            subject.tabHeadings.toArray()[1].selectTab();
            componentFixture.detectChanges();
            expect(subject.currentTabId).toBe("2");
            subject.addTab();
            componentFixture.detectChanges();
            subject.tabHeadings.toArray()[2].selectTab();
            componentFixture.detectChanges();
            expect(subject.currentTabId).toBe("3");
        });
    });
});
