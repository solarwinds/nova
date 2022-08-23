import {
    ChangeDetectorRef,
    Component,
    QueryList,
    ViewChild,
    ViewChildren,
} from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { IconComponent } from "../../icon/icon.component";
import { TabHeadingComponent } from "../tab-heading/tab-heading.component";
import { TabHeadingGroupComponent } from "./tab-heading-group.component";

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
