import { inject, TestBed } from "@angular/core/testing";
import { Apollo } from "apollo-angular";

import { AuthService } from "./auth.service";

describe("AuthService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AuthService,
                Apollo,
            ],
        });
    });

    it("should be created", inject([AuthService], (service: AuthService) => {
        expect(service).toBeTruthy();
    }));
});
