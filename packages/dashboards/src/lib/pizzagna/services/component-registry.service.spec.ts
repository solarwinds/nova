import { TestBed } from "@angular/core/testing";

import { ComponentRegistryService } from "./component-registry.service";

describe("ComponentRegistryService", () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it("should be created", () => {
        const service: ComponentRegistryService = TestBed.inject(
            ComponentRegistryService
        );
        expect(service).toBeTruthy();
    });
});
