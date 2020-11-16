import { inject, TestBed } from "@angular/core/testing";
import { Apollo } from "apollo-angular";

import { PostService } from "./post.service";

describe("PostService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PostService,
                Apollo,
            ],
        });
    });

    it("should be created", inject([PostService], (service: PostService) => {
        expect(service).toBeTruthy();
    }));
});
