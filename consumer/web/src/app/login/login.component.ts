import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "../services/auth.service";

@Component({
    selector: "rd-login",
    templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit {

    public username: string;
    public password: string;
    public showAuthenticationError = false;

    constructor(private router: Router, private authService: AuthService) {
    }

    ngOnInit() {
    }

    async login() {
        try {
            await this.authService.login({
                username: this.username,
                password: this.password,
            }).toPromise();

            await this.router.navigate(["/"]);
        } catch (e) {
            this.showAuthenticationError = true;
        }
    }

}
