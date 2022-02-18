import {TestBed} from "@angular/core/testing";
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from "@angular/platform-browser-dynamic/testing";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";

export default (testBed: typeof TestBed): typeof TestBed => {
    testBed.initTestEnvironment([
        BrowserDynamicTestingModule,
        NoopAnimationsModule,
    ], platformBrowserDynamicTesting(), {
        teardown: { destroyAfterEach: false },
    });
    return testBed;
};
