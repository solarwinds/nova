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
@Injectable({providedIn: "root"})
export class NotificationService implements INotificationService {
    private channels: {[channelId: string]: Subject<any>} = {};

    private ensureChannel(channelId: string): Subject<any> {
        return this.channels[channelId] || (this.channels[channelId] = new Subject<any>());
    }

    public subscribe(channelId: string, action: NotificationHandler): Subscription {
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
