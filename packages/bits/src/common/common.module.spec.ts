import { NuiCommonModule } from "./common.module";

describe("CommonModule", () => {
  let commonModule: NuiCommonModule;

  beforeEach(() => {
    commonModule = new NuiCommonModule();
  });

  it("should create an instance", () => {
    expect(commonModule).toBeTruthy();
  });
});
