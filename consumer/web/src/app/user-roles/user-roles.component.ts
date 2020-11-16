import {
    AfterViewInit,
    Component,
    OnDestroy,
    OnInit,
} from "@angular/core";

export interface BasicTableModel {
    name: string;
    position: number;
    location: string;
    roles: any;
}

const ELEMENT_DATA: BasicTableModel[] = [
    {
        position: 1,
        name: "Lukas",
        location: "Brno",
        roles: ["basic"],
    },
    {
        position: 2,
        name: "Vitalii",
        location: "Kiev",
        roles: ["admin"],
    },
    {
        position: 3,
        name: "Blake",
        location: "waiting on his contractor",
        roles: ["basic", "admin", "superhero"],
    },
    {
        position: 4,
        name: "Shannon",
        location: "London Airport",
        roles: ["basic", "admin"],
    },
    {
        position: 5,
        name: "Josh",
        location: "His Desk",
        roles: ["basic", "admin"],
    },
    {
        position: 6,
        name: "Aaron",
        location: "Home",
        roles: ["basic"],
    },
    {
        position: 7,
        name: "Lukas2",
        location: "Austin",
        roles: ["basic", "admin"],
    },
    {
        position: 8,
        name: "Vitalii2",
        location: "Austin",
        roles: ["superhero"],
    },
    {
        position: 9,
        name: "Blake2",
        location: "still waiting for his contractor",
        roles: ["basic", "admin"],
    },
    {
        position: 10,
        name: "Shannon2",
        location: "New Orleans",
        roles: ["basic"],

    },
    {
        position: 11,
        name: "Josh2",
        location: "picking up a kid",
        roles: ["basic", "admin"],
    },
    {
        position: 12,
        name: "Aaron2",
        location: "Austin",
        roles: ["basic"],
    },
];

@Component({
  selector: "rd-user-roles",
  templateUrl: "./user-roles.component.html",
})

export class UserRolesComponent {

    public displayedColumns = ["position", "name", "location", "role-basic", "role-admin", "role-superhero"];
    public dataSource = ELEMENT_DATA;

    constructor() {
    }
}
