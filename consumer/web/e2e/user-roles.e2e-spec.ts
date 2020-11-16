import { Helper } from "./helper";
import { UserRolesPage } from "./page-objects/user-roles.po";

describe("User Roles >", () => {
    let page: UserRolesPage;

    beforeAll(async () => {
        page = new UserRolesPage();
    });

    describe("Initial state >", () => {

        beforeAll(async () => {
            await page.navigateTo();
            await Helper.waitForUrl("/admin/user-roles");
        });
        
        describe("Table >", async () => {
            it("should display the correct header row", async () => {
                expect(await page.getTableHeaderLabels()).toEqual(["No.", "Name", "Location", "Basic", "Admin", "Superhero"]);
            });

            it("should have the correct number of rows", async () => {
                expect(await page.getDisplayedUserCount()).toBe(12);
            });

            it("should have data in the cells", async () => {
                expect(await page.getUserName(1)).toBe("Lukas");
            });
        });
    });
});
