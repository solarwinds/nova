import { Component } from "@angular/core";
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from "@angular/router";

import { AuthService } from "./services/auth.service";
import { UserService } from "./services/user.service";

@Component({
    selector: "rd-app",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.less"],
})
export class AppComponent {
    public title = "Rubber Duck";
    public loading = false;
    public username: string;

    constructor(private router: Router,
                private authService: AuthService,
                private userService: UserService) {
        router.events.subscribe(this.navigationInterceptor);
        authService.authSubject.subscribe(this.authInterceptor);
    }

    public navigationInterceptor = (event: Event): void => {
        if (event instanceof NavigationStart) {
            this.loading = true;
        }
        if (event instanceof NavigationEnd) {
            this.loading = false;
        }

        // Set loading state to false in both of the below events to hide the spinner in case a request fails
        if (event instanceof NavigationCancel) {
            this.loading = false;
        }
        if (event instanceof NavigationError) {
            this.loading = false;
        }
    }

    public onSearch(query: string) {
        this.router.navigate(["/search", query]);
    }

    public authInterceptor = (isLoggedIn: boolean): void => {
        this.username = isLoggedIn ? this.userService.currentUser.username : null;
    }

    public logout = async () => {
        await this.authService.logout().toPromise();
    }

    public goHome = (): void => {
        this.router.navigate(["/questions"]);
    }
}
