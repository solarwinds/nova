import { fakeAsync, TestBed, tick } from "@angular/core/testing";

import { IconComponent } from "../../lib/icon/icon.component";
import { NotificationService } from "../../services/notification-service";

import { IToastConfig, IToastService, ToastPositionClass } from "./public-api";
import { ToastContainerService } from "./toast-container.service";
import { ToastPackage } from "./toast-package";
import { ToastRef } from "./toast-ref";
import { ToastComponent } from "./toast.component";
import { ToastService } from "./toast.service";

describe("components >", () => {
    describe("toast >", () => {
        let toastService: IToastService;
        let toastPackage: ToastPackage;
        let toastRef: ToastRef<ToastComponent>;
        const mockNgZone = jasmine.createSpyObj("mockNgZone", ["run", "runOutsideAngular"]);
        mockNgZone.run.and.callFake(() => false);
        mockNgZone.runOutsideAngular.and.callFake(() => {});

        const defaultToastConfig: IToastConfig = {
            maxOpened: 2,
            autoDismiss: false,
            newestOnTop: true,
            preventDuplicates: false,
            positionClass: ToastPositionClass.TOP_RIGHT,
            progressAnimation: "decreasing",
            timeOut: 5000,
            progressBar: true,
            toastClass: "nui-toast",
            extendedTimeOut: 2000,
            closeButton: true,
            clickToDismiss: false,
            enableHtml: true,
            stickyError: false,
        };

        const setToastMetadata = () => {
            // @ts-ignore: Suppressing error for testing purposes
            toastRef = new ToastRef(null);
            toastPackage = new ToastPackage(
                1,
                defaultToastConfig,
                "Test message",
                "Test title",
                "success",
                toastRef
            );
        };

        beforeAll(() => {
            setToastMetadata();
        });

        beforeEach(() => {
            TestBed
                .configureTestingModule({
                    declarations: [IconComponent],
                    providers: [
                        NotificationService,
                        ToastContainerService,
                        ToastService,
                    ],
                });

            toastService = TestBed.inject(ToastService);

            setToastMetadata();
        });

        it("Title and body of a component should be set correctly", fakeAsync(() => {
            // @ts-ignore: Suppressing error for testing purposes
            const componentInstance = new ToastComponent(toastService, toastPackage, mockNgZone);
            expect(componentInstance.body).toEqual("Test message");
            expect(componentInstance.title).toEqual("Test title");
            componentInstance.remove();
            tick(10000);
        }));

        it("Class 'success' should be put on success toast", fakeAsync(() => {
            // @ts-ignore: Suppressing error for testing purposes
            const componentInstance = new ToastComponent(toastService, toastPackage, mockNgZone);
            expect(componentInstance.toastClasses.indexOf("success")).not.toEqual(-1);
            componentInstance.remove();
            tick(10000);
        }));

        it("Class 'info' should be put on info toast", fakeAsync(() => {
            toastPackage.toastType = "info";
            // @ts-ignore: Suppressing error for testing purposes
            const componentInstance = new ToastComponent(toastService, toastPackage, mockNgZone);
            expect(componentInstance.toastClasses.indexOf("info")).not.toEqual(-1);
            componentInstance.remove();
            tick(10000);
        }));

        it("Class 'error' should be put on error toast", fakeAsync(() => {
            toastPackage.toastType = "error";
            // @ts-ignore: Suppressing error for testing purposes
            const componentInstance = new ToastComponent(toastService, toastPackage, mockNgZone);
            expect(componentInstance.toastClasses.indexOf("error")).not.toEqual(-1);
            componentInstance.remove();
            tick(10000);
        }));

        it("Class 'warning' should be put on warning toast", fakeAsync(() => {
            toastPackage.toastType = "warning";
            // @ts-ignore: Suppressing error for testing purposes
            const componentInstance = new ToastComponent(toastService, toastPackage, mockNgZone);
            expect(componentInstance.toastClasses.indexOf("warning")).not.toEqual(-1);
            componentInstance.remove();
            tick(10000);
        }));

        // TODO: enable after NUI-3641 is fixed
        xit("After activation toast should be shown", () => {
            // @ts-ignore: Suppressing error for testing purposes
            const componentInstance = new ToastComponent(toastService, toastPackage, mockNgZone);
            toastRef.activate();
            expect(componentInstance.display).toEqual("block");
            expect(componentInstance["state"]).toEqual("active");
            tick(10000);
        });

        // TODO: enable after NUI-3641 is fixed
        xit("After remove toast should be removed", fakeAsync(() => {
            // @ts-ignore: Suppressing error for testing purposes
            const componentInstance = new ToastComponent(toastService, toastPackage, mockNgZone);
            toastRef.activate();
            componentInstance.remove();
            expect(componentInstance["state"]).toEqual("removed");
            tick(10000);
        }));
    });
});
