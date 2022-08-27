import { ListRange } from "@angular/cdk/collections";
import { ScrollingModule } from "@angular/cdk/scrolling";
import {
    AfterViewInit,
    Component,
    NO_ERRORS_SCHEMA,
    OnDestroy,
    ViewChild,
} from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import {
    debounceTime,
    delay,
    shareReplay,
    skip,
    switchMap,
    take,
    takeUntil,
    tap,
} from "rxjs/operators";

import { RepeatComponent } from "../lib/repeat/repeat.component";
import { NuiRepeatModule } from "../lib/repeat/repeat.module";
import { VirtualViewportManager } from "./virtual-viewport-manager.service";

@Component({
    template: `
        <ng-template #repeatItemTemplate let-item="item">
            {{ item }}
        </ng-template>

        <nui-repeat
            [itemsSource]="items$ | async"
            [repeatItemTemplateRef]="repeatItemTemplate"
            [virtualScroll]="true"
            [itemSize]="30"
        >
        </nui-repeat>
    `,
    styles: [
        `
            nui-repeat {
                height: 300px;
            }
        `,
    ],
    providers: [VirtualViewportManager],
})
class ViewportInRepeatComponent implements AfterViewInit, OnDestroy {
    @ViewChild(RepeatComponent) public repeat: RepeatComponent;
    public pageSize: number = 20;
    public items$ = new BehaviorSubject<number[]>([]);
    public nextPage$: Observable<ListRange>;
    public destroy$ = new Subject<unknown>();
    public totalItems: number = 132;

    constructor(public viewportManager: VirtualViewportManager) {}

    public ngAfterViewInit(): void {
        this.nextPage$ = this.viewportManager
            .setViewport(this.repeat.viewportRef)
            .observeNextPage$({ pageSize: this.pageSize })
            .pipe(shareReplay(1));

        this.nextPage$
            .pipe(
                // Using short delay to avoid ExpressionChangedAfterItHasBeenCheckedError
                delay(10),
                tap((newRange: ListRange) => {
                    if (this.totalItems <= newRange.end) {
                        this.items$.next(this.getMockData(this.totalItems));
                        return;
                    }
                    this.items$.next(this.getMockData(newRange.end));
                }),
                takeUntil(this.destroy$)
            )
            .subscribe();
    }

    public getMockData(length: number): number[] {
        return Array.from({ length }).map((item, index) => index);
    }

    public reset(): void {
        this.viewportManager.reset();
        this.items$.next(this.getMockData(this.pageSize));
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

describe("services >", () => {
    describe("VirtualViewportManager on Repeat > ", () => {
        let component: ViewportInRepeatComponent;
        let fixture: ComponentFixture<ViewportInRepeatComponent>;

        beforeEach(waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [ViewportInRepeatComponent, RepeatComponent],
                imports: [ScrollingModule, NuiRepeatModule],
                schemas: [NO_ERRORS_SCHEMA],
            }).compileComponents();

            // component
            fixture = TestBed.createComponent(ViewportInRepeatComponent);
            component = fixture.componentInstance;
            component.pageSize = 10;
            fixture.detectChanges();
        }));

        afterAll(() => {
            TestBed.resetTestingModule();
        });

        it("should create", () => {
            expect(component).toBeTruthy();
        });

        it("should throw when trying to reassign viewport", () => {
            expect(() =>
                component.viewportManager.setViewport(
                    component.repeat.viewportRef
                )
            ).toThrow();
        });

        it("should request first page on init", () => {
            expect(component.items$.getValue().length).toBe(component.pageSize);
        });

        it("should load second page", (done: any) => {
            fixture.detectChanges();
            // Scrolling to last rendered element to trigger next page event
            component.repeat.viewportRef.scrollToIndex(
                component.repeat.viewportRef.getDataLength()
            );
            component.items$.pipe(skip(1), take(1)).subscribe((r) => {
                expect(component.items$.getValue().length).toEqual(
                    component.pageSize * 2
                );
                done();
            });
        });

        it(`should load 5 pages`, (done: any) => {
            const pagesToScroll = 5;
            component.items$
                .pipe(
                    // Scrolling 5 pages
                    tap(() => {
                        fixture.detectChanges();
                        // Scrolling to last rendered element to trigger next page event
                        component.repeat.viewportRef.scrollToIndex(
                            component.repeat.viewportRef.getDataLength()
                        );
                    }),
                    // Taking last emission to perform check
                    skip(pagesToScroll - 1),
                    take(1),
                    tap((users) => {
                        expect(users.length).toEqual(
                            component.pageSize * pagesToScroll
                        );
                        done();
                    })
                )
                .subscribe();
        });

        it(`should not try to load more data if the last loaded page is not complete`, (done) => {
            const pages = 6;
            component.pageSize = 10;
            component.totalItems = component.pageSize * pages + 9;
            let requests: number = 0;

            fixture.detectChanges();
            component.items$
                .pipe(
                    // Trying to scroll 8 pages
                    tap(() => {
                        fixture.detectChanges();
                        // Scrolling to last rendered element to trigger next page event
                        component.repeat.viewportRef.scrollToIndex(
                            component.repeat.viewportRef.getDataLength()
                        );
                    }),
                    // While we're using behaviour subject we don't need to count first value
                    skip(1),
                    tap(() => (requests = requests + 1)),
                    // Waiting for the all pages to be loaded
                    debounceTime(300),
                    take(1),
                    tap(() => {
                        const loadedItems = component.items$.getValue().length;
                        const rest = loadedItems % component.pageSize;
                        const pagesLoaded =
                            (loadedItems - rest) / component.pageSize;
                        expect(pagesLoaded).toEqual(requests);
                        done();
                    })
                )
                .subscribe();
        });

        it("should start over on reset call", (done) => {
            const pagesToScroll = 5;
            component.items$
                .pipe(
                    // Scrolling 5 pages
                    tap(() => {
                        fixture.detectChanges();
                        // Scrolling to last rendered element to trigger next page event
                        component.repeat.viewportRef.scrollToIndex(
                            component.repeat.viewportRef.getDataLength()
                        );
                    }),
                    skip(pagesToScroll - 1),
                    take(1),
                    switchMap((users) => {
                        expect(users.length).toEqual(
                            component.pageSize * pagesToScroll
                        );
                        component.reset();
                        fixture.detectChanges();
                        // Now we are on page 1, we scrolling one more time to be able to check
                        // if the nextPage$ emission corresponds to second page
                        component.repeat.viewportRef.scrollToIndex(
                            component.repeat.viewportRef.getDataLength()
                        );
                        return component.nextPage$.pipe(
                            // Note: skipping previous cached value
                            skip(1),
                            take(1),
                            tap((range: ListRange) => {
                                expect(range.end).toEqual(
                                    component.pageSize * 2
                                );
                                done();
                            })
                        );
                    })
                )
                .subscribe();
        });
    });
});
