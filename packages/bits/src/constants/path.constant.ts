import { InjectionToken } from "@angular/core";

// This should not be here, but Angular DI is not recognizing this token when it in scope of docsModule
// In any case doc helpers will be moved in separate preject and this will not be here
export const DEMO_PATH_TOKEN = new InjectionToken<any>("DemoPathToken");
