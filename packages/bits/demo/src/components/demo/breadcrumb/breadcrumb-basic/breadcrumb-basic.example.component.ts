import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BreadcrumbItem, BreadcrumbStateService } from "@nova-ui/bits";
import { Subscription } from "rxjs";

@Component({
    selector: "nui-breadcrumb-basic-example",
    templateUrl: "./breadcrumb-basic.example.component.html",
})
export class BreadcrumbBasicExampleComponent implements OnInit, OnDestroy {
    public breadcrumbSource: Array<BreadcrumbItem>;
    private routerSubscription: Subscription;

    constructor(private router: Router,
                private routerState: ActivatedRoute,
                private breadcrumbStateService: BreadcrumbStateService) { }

    ngOnInit() {
        this.breadcrumbSource = this.breadcrumbStateService.getBreadcrumbState(this.router, this.routerState);
        // this.breadcrumbSource = this.breadcrumbStateService.getBreadcrumbState(this.routerState, "/breadcrumb/");
        this.routerSubscription = this.breadcrumbStateService.getNavigationSubscription(this.router)
            .subscribe(() => {
                this.breadcrumbSource = this.breadcrumbStateService.getBreadcrumbState(this.router, this.routerState);
            });
    }

    public onNavigation(routerState: string): void {
        void this.router.navigate([routerState]);
    }

    public relativeNavigation(routerState: string): void {
        void this.router.navigate([routerState], {relativeTo: this.routerState});
    }

    ngOnDestroy() {
        this.routerSubscription.unsubscribe();
    }
}


@Component({
    selector: "nui-breadcrumb-first-subview",
    template: `
        <div class="container">
            <div i18n class="nui-text-default">
                Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi
                optio, cumque nihil impedit, quo minus id, quod maxime placeat, facere possimus, omnis voluptas assumenda
                est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus
                saepe eveniet, ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur
                a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus
                asperiores repellat.
            </div>
            <button id="nui-demo-breadcrumb-show-first-country"
                    nui-button
                    type="button"
                    (click)="relativeNavigation('usa')"
                    i18n>USA</button>
            <button id="nui-demo-breadcrumb-show-second-country"
                    class="ml-1"
                    nui-button
                    type="button"
                    (click)="relativeNavigation('ukraine')"
                    i18n>Ukraine</button>
            <router-outlet></router-outlet>
        </div>`,
})
export class BreadcrumbCountriesSubviewComponent {
    constructor(private router: Router,
                private routerState: ActivatedRoute) {
    }

    public relativeNavigation(routerState: string): void {
        this.router.navigate([routerState], {relativeTo: this.routerState});
    }
}

@Component({
    selector: "nui-breadcrumb-second-subview",
    template: `
        <div>
            <p i18n class="nui-text-default">Some data about country here</p>
        </div>`,
})
export class BreadcrumbSingleCountryComponent {
}

@Component({
    selector: "nui-breadcrumb-offices-subview",
    template: `
        <div>
            <p i18n class="nui-text-default">Some data about offices here</p>
        </div>`,
})
export class BreadcrumbOfficesSubviewComponent {
}
