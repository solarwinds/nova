// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

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

            const sub = notificationService.subscribe(channel, (args: any) => {
                spy(args);
            });

            sub.unsubscribe();
            expect(spy).not.toHaveBeenCalled();
        });
    });
});
