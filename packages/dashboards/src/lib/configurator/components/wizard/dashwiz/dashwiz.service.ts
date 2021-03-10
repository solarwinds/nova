import { Injectable } from "@angular/core";

import { DashwizComponent } from "./dashwiz.component";

@Injectable({
    providedIn: "root",
})
export class DashwizService {
    public component: DashwizComponent | undefined;

    constructor() { }

}
