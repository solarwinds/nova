import { SimpleChange, SimpleChanges } from "@angular/core";
import { ComponentFixture, fakeAsync, flush, TestBed, waitForAsync } from "@angular/core/testing";
import { EventBus, LoggerService } from "@nova-ui/bits";
import { Subject } from "rxjs";

import { IKpiData } from "../../../../../components/public-api";
import { NuiDashboardsModule } from "../../../../../dashboards.module";
import { ProviderRegistryService } from "../../../../../services/provider-registry.service";
import { DATA_SOURCE, PIZZAGNA_EVENT_BUS } from "../../../../../types";
import { DATA_SOURCE_OUTPUT } from "../../../../types";

import { DataSourceConfigurationV2Component } from "./data-source-configuration-v2.component";

class DataSource1 {
    // This is the ID we'll use to identify the provider
    public static providerId = "TestCaseOne";

    constructor() {
    }

    public outputsSubject = new Subject<Partial<IKpiData>>();

    public applyFilters() {
        this.outputsSubject.next({
            value: "Fizz",
        });
    }

}

class DataSource2 {
    // This is the ID we'll use to identify the provider
    public static providerId = "TestCaseTwo";

    constructor() {
    }

    public outputsSubject = new Subject<Partial<IKpiData>>();
    public properties: any;

    public applyFilters() {
        this.outputsSubject.next({
            value: this.properties.fizz,
        });
    }

    public updateConfiguration(properties: any) {
        this.properties = properties;
    }

}

describe("DataSourceConfigurationV2Component", () => {
    let component: DataSourceConfigurationV2Component;
    let fixture: ComponentFixture<DataSourceConfigurationV2Component>;
    let providerRegistryService: ProviderRegistryService;
    let logger: LoggerService;

    beforeEach(waitForAsync(() => {
        logger = new LoggerService();
        providerRegistryService = new ProviderRegistryService(logger);
        TestBed.configureTestingModule({
            imports: [NuiDashboardsModule],
            providers: [
                {
                    provide: ProviderRegistryService,
                    useValue: providerRegistryService,
                },
                {
                    provide: PIZZAGNA_EVENT_BUS,
                    useClass: EventBus,
                },
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DataSourceConfigurationV2Component);
        component = fixture.componentInstance;
        component.dataSourceProviders = [
            {
                providerId: "TestCaseOne",
                label: "Test Case 1",
            },
            {
                providerId: "TestCaseTwo",
                label: "Test Case 2",
                properties: {
                    fizz: "buzz",
                },
            },
            {
                providerId: "TestCaseThree",
                label: "Test Case 3",
                properties: {},
            },
        ];
        component.providerId = "TestCaseOne";
        component.ngOnInit();
        (<any>component).providerRegistryService.setProviders({
            "TestCaseOne": {
                provide: DATA_SOURCE,
                useClass: DataSource1,
                // Any dependencies that need to be injected into the provider must be listed here
                deps: [],
            },
            "TestCaseTwo": {
                provide: DATA_SOURCE,
                useClass: DataSource2,
                deps: [],
            },
            "TestCaseThree": {
                provide: DATA_SOURCE,
                useClass: DataSource1,
                deps: [],
            },
        });
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should update providerId and properties form on dataSource change", () => {
        const dataSource = component.dataSourceProviders[1];
        component.form.get("dataSource")?.setValue(dataSource);
        component.onDataSourceSelected(dataSource);
        const dataSourceForm = component.form.get("dataSource")?.value;
        expect(dataSourceForm).toEqual(dataSource);
    });

    it("should run DATA_SOURCE_OUTPUT on the event bus", fakeAsync(() => {
        spyOn((<any>component).eventBus.getStream(DATA_SOURCE_OUTPUT), "next");
        const dataSource = component.dataSourceProviders[0];
        component.form.get("dataSource")?.setValue(dataSource);
        component.onDataSourceSelected(dataSource);
        flush();
        expect((<any>component).eventBus.getStream(DATA_SOURCE_OUTPUT).next).toHaveBeenCalled();
    }));

    it("should set outputsSubject based off of its properties", fakeAsync(() => {
        spyOn((<any>component).eventBus.getStream(DATA_SOURCE_OUTPUT), "next");
        const dataSource = component.dataSourceProviders[1];
        component.form.get("dataSource")?.setValue(dataSource);
        component.onDataSourceSelected(dataSource);
        flush();
        expect((<any>component).eventBus.getStream(DATA_SOURCE_OUTPUT).next).toHaveBeenCalledWith(
            {
                payload: {
                    value: "buzz",
                },
            }
        );
    }));

    describe("ngOnChanges > ", () => {
        it("should set providerId on the form", fakeAsync(() => {
            spyOn((<any>component).eventBus.getStream(DATA_SOURCE_OUTPUT), "next");
            component.providerId = "TestCaseOne";
            const changes: SimpleChanges = {
                providerId: new SimpleChange(null, component.providerId, false),
            };
            component.ngOnChanges(changes);
            const formProviderValue = component.form.get("providerId")?.value;
            expect(formProviderValue).toEqual(component.providerId);
            const formDataSourceValue = component.form.get("dataSource")?.value;
            expect(formDataSourceValue).toEqual(component.dataSourceProviders[0]);
            flush();
            expect((<any>component).eventBus.getStream(DATA_SOURCE_OUTPUT).next).toHaveBeenCalledWith(
                {
                    payload: {
                        value: "Fizz",
                    },
                }
            );
        }));

        it("should set properties on the form", fakeAsync(() => {
            spyOn((<any>component).eventBus.getStream(DATA_SOURCE_OUTPUT), "next");
            component.providerId = "TestCaseOne";
            component.properties = {
                fizz: "buzz",
            };
            const changes: SimpleChanges = {
                providerId: new SimpleChange(null, component.providerId, false),
                properties: new SimpleChange(null, component.properties, false),
            };
            component.ngOnChanges(changes);
            const formValue = component.form.get("properties")?.value;
            expect(formValue).toEqual(component.properties);
            flush();
            expect((<any>component).eventBus.getStream(DATA_SOURCE_OUTPUT).next).toHaveBeenCalledWith(
                {
                    payload: {
                        value: "Fizz",
                    },
                }
            );
        }));

        it("should not set data source if theres more than one in the list", () => {
            const changes: SimpleChanges = {
                dataSourceProviders: new SimpleChange(null, component.dataSourceProviders, false),
            };
            component.ngOnChanges(changes);
            const formValue = component.form.get("dataSource")?.value;
            expect(formValue).toBeNull();
        });

        it("should set the 'providerId' and 'properties' form fields if the provider's 'properties' property is undefined", () => {
            component.providerId = "TestCaseOne";
            component.properties = {};
            const changes: SimpleChanges = {
                providerId: new SimpleChange(null, component.providerId, false),
                properties: new SimpleChange(null, component.properties, false),
            };
            component.ngOnChanges(changes);

            const propertiesFormValue = component.form.get("properties")?.value;
            const providerIdFormValue = component.form.get("providerId")?.value;

            expect(propertiesFormValue).toEqual(component.properties);
            expect(providerIdFormValue).toEqual(component.providerId);
        });

        it("should set the 'providerId' and 'properties' form fields if the component's 'properties' property is undefined", () => {
            component.providerId = "TestCaseThree";
            // @ts-ignore
            component.properties = undefined;
            const changes: SimpleChanges = {
                providerId: new SimpleChange(null, component.providerId, false),
                properties: new SimpleChange(null, component.properties, false),
            };
            component.ngOnChanges(changes);

            const propertiesFormValue = component.form.get("properties")?.value;
            const providerIdFormValue = component.form.get("providerId")?.value;

            expect(propertiesFormValue).toEqual({});
            expect(providerIdFormValue).toEqual(component.providerId);

        });
    });

    describe("ngAfterViewInit > ",() => {
        it("should set the dataSource to the first value if no dataSource is provided",  fakeAsync(() => {
            spyOn((<any>component).eventBus.getStream(DATA_SOURCE_OUTPUT), "next");
            component.dataSourceProviders = [
                {
                    providerId: "TestCaseOne",
                    label: "Test Case 1",
                },
            ];
            component.ngAfterViewInit();
            const formValue = component.form.get("dataSource")?.value;
            expect(formValue).toEqual(component.dataSourceProviders[0])
            flush();
            expect((<any>component).eventBus.getStream(DATA_SOURCE_OUTPUT).next).toHaveBeenCalledWith(
                {
                    payload: {
                        value: "Fizz",
                    },
                }
            );
        }));
    });
});
