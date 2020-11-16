import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";

import { IAuthenticationInput, IUser } from "../types";

import { UserService } from "./user.service";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    public authSubject: BehaviorSubject<boolean>;

    constructor(private apollo: Apollo, private userService: UserService) {
        this.authSubject = new BehaviorSubject(!!this.userService.currentUser);
    }

    public login(credentials: IAuthenticationInput): Observable<IUser> {
        return this.apollo.mutate({
            mutation: gql`
                mutation Login($input: AuthenticationInput!) {
                    login(input: $input) {
                        username
                        roles
                    }
                }`,
            variables: {
                "input": credentials,
            },
        }).pipe(map((result) => {
            this.userService.updateUserStore(result.data.login);
            this.authSubject.next(!!this.userService.currentUser);

            return this.userService.currentUser;
        }));
    }

    public logout() {
        return this.apollo.mutate({
            mutation: gql`
                mutation {
                    logout
                }`,
        }).pipe(map(() => {
            this.userService.updateUserStore(null);
            this.authSubject.next(!!this.userService.currentUser);
        }));
    }
}
