import { Atom, TableAtom } from "@solarwinds/nova-bits/sdk/atoms";
import { browser } from "protractor";

export class UserRolesPage {

    public table: TableAtom;

    constructor() {
        this.table = Atom.find(TableAtom, "rd-user-roles-table");
    }

    public async navigateTo(): Promise<void> {
        return browser.get("/admin/user-roles");
    }

    public async getUserName(rowIndex: number): Promise<string> {
        return this.table.getCellText(rowIndex, 1);
    }

    public async getDisplayedUserCount(): Promise<number> {
        return this.table.getRowsCount();
    }

    public async getTableHeaderLabels(): Promise<any[]> {
        return this.table.getRowContent(0);
    }
}
