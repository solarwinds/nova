import { TestBed } from "@angular/core/testing";

import { DashwizService } from "./dashwiz.service";

describe("DashwizService", () => {
  let service: DashwizService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashwizService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
