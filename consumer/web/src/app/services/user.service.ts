import { Injectable } from "@angular/core";

import { IUser } from "../types";

@Injectable({
    providedIn: "root",
})
export class UserService {
    public currentUser: IUser;

    constructor() {
        this.currentUser = this.getStoredUser();
    }

    public async updateUserStore(user: IUser) {
        this.currentUser = user;
        if (user) {
            sessionStorage.setItem("user", JSON.stringify(this.currentUser));
        } else {
            sessionStorage.removeItem("user");
        }
    }

    private getStoredUser() {
        const storedUser = sessionStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    }
}
