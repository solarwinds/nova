import { inject, TestBed } from "@angular/core/testing";
import { Apollo } from "apollo-angular";

import { UserService } from "./user.service";

describe("UserService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                UserService,
                Apollo,
            ],
        });
    });

    it("should be created", inject([UserService], (service: UserService) => {
        expect(service).toBeTruthy();
    }));
});
