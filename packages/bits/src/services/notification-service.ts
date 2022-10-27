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

import { Injectable } from "@angular/core";
import { Subject, Subscription } from "rxjs";

import { INotificationService } from "./public-api";

export type NotificationHandler = (args: any) => void;

/**
 * @ngdoc service
 *
 * @name nui.services:nuiNotificationService
 *
 * @description
 * Service that provides generic notifications to consumers that subscribe.
 */

/**
 * @ignore
 */
@Injectable({ providedIn: "root" })
export class NotificationService implements INotificationService {
    private channels: { [channelId: string]: Subject<any> } = {};

    private ensureChannel(channelId: string): Subject<any> {
        return (
            this.channels[channelId] ||
            (this.channels[channelId] = new Subject<any>())
        );
    }

    public subscribe(
        channelId: string,
        action: NotificationHandler
    ): Subscription {
        const channel = this.ensureChannel(channelId);
        return channel.subscribe(action);
    }

    public post(channelId: string, args: any): void {
        const channel = this.channels[channelId];
        if (!channel) {
            console.warn(`post on nonexistent channel #${channelId}`);
            return;
        }
        channel.next(args);
    }
}

export default NotificationService;
