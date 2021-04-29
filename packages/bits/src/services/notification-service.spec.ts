import { NotificationService } from "./notification-service";
import { INotificationService } from "./public-api";

describe("services >", () => {
    describe("notification-service >", () => {
        let notificationService: INotificationService;
        const countArgs = { count: 0 };
        const channel = "test";

        beforeEach(() => {
            notificationService = new NotificationService();
        });

        function expectOneCall(spy: jasmine.Spy, args: any): void {
            expect(spy).toHaveBeenCalledWith(args);
            expect(spy.calls.count()).toEqual(1);
        }

        it("should post notifications to a subscriber", () => {
            const spy = jasmine.createSpy("spy");

            notificationService.subscribe(channel, (args: any) => {
                spy(args);
            });

            notificationService.post(channel, countArgs);
            expectOneCall(spy, countArgs);
        });

        it("should post notifications to all subscribers of the channel", () => {
            const spy1 = jasmine.createSpy("spy");
            const spy2 = jasmine.createSpy("spy");

            notificationService.subscribe(channel, (args: any) => {
                spy1(args);
            });

            notificationService.subscribe(channel, (args: any) => {
                spy2(args);
            });

            notificationService.post(channel, countArgs);
            expectOneCall(spy1, countArgs);
            expectOneCall(spy2, countArgs);
        });

        it("should post notifications to the specified channel only", () => {
            const spy1 = jasmine.createSpy("spy");
            const spy2 = jasmine.createSpy("spy");

            notificationService.subscribe(channel, (args: any) => {
                spy1(args);
            });

            notificationService.subscribe("nochannel", (args: any) => {
                spy2(args);
            });

            notificationService.post(channel, countArgs);

            expectOneCall(spy1, countArgs);
            expect(spy2).not.toHaveBeenCalled();
        });

        it("should properly unsubscribe", () => {
            const spy = jasmine.createSpy("spy");

            const sub = notificationService.subscribe(channel,  (args: any) => {
                spy(args);
            });

            sub.unsubscribe();
            expect(spy).not.toHaveBeenCalled();
        });
    });
});
