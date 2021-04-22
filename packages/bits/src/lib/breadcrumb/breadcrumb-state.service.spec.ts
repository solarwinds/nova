import { TestBed } from "@angular/core/testing";

import { BreadcrumbStateService } from "./breadcrumb-state.service";

describe("services >", () => {
    describe("breadcrumb-state >", () => {
        let instance: BreadcrumbStateService;
        let routerState: any;
        routerState = {
            routeConfig: {
                path: "root",
            },
            firstChild: {
                routeConfig: {
                    path: "first-level",
                },
                snapshot: {
                    data: {
                        breadcrumb: "First Level",
                    },
                },
            },
            snapshot: {
                data: {
                    breadcrumb: "Root",
                },
            },
        };
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [],
                providers: [
                    BreadcrumbStateService,
                ],
            });
            instance = TestBed.inject(BreadcrumbStateService);

        });

        it("should return correct breadcrumb state", () => {
            const state = instance.getBreadcrumbState(routerState);
            expect(state[0].routerState).toEqual("root/");
            expect(state[1].routerState).toEqual("root/first-level/");

            expect(state[0].title).toEqual("Root");
            expect(state[1].title).toEqual("First Level");
        });
    });
});
