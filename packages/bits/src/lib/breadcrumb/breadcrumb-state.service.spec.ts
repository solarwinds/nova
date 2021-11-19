import { TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";

import { BreadcrumbStateService } from "./breadcrumb-state.service";

describe("services >", () => {
    describe("breadcrumb-state >", () => {
        let service: BreadcrumbStateService;

        const routerState: ActivatedRoute = {
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
        } as unknown as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [],
                providers: [BreadcrumbStateService],
            });
            service = TestBed.inject(BreadcrumbStateService);
        });

        it("should return correct breadcrumb state", () => {
            const state = service.getBreadcrumbState(routerState);
            expect(state.map((item) => [item.routerState, item.title])).toEqual(
                [
                    ["root/", "Root"],
                    ["root/first-level/", "First Level"],
                ]
            );
        });
    });
});
