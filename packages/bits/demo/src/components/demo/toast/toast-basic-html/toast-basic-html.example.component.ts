import { Component, Inject, OnInit } from "@angular/core";

import { IToastService, ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-toast-basic-html-example",
    templateUrl: "./toast-basic-html.example.component.html",
})
export class ToastBasicHtmlExampleComponent implements OnInit {
    constructor(@Inject(ToastService) private toastService: IToastService) {}

    ngOnInit() {
        this.toastService.setConfig(
            { timeOut: 5000, extendedTimeOut: 2000 },
            "id"
        );
    }

    public showToastWithEnabledHtml(): void {
        this.toastService.info({
            title: $localize`Toast with enableHtml set to true`,
            message: $localize`Hi there! I'm a simple toast message. <a href="#">Awesome link</a>`,
            options: {
                enableHtml: true, // Note: Default value
            },
        });
    }

    public showToastWithDisabledHtml(): void {
        this.toastService.info({
            title: $localize`Toast with enableHtml set to false`,
            message: $localize`Hi there! I'm a simple toast message <a href="#">Awesome link</a>`,
            options: {
                enableHtml: false,
            },
        });
    }

    public showToastWithScriptTagIncluded(): void {
        this.toastService.info({
            title: $localize`Toast with forbidden tags and enableHtml set to true`,
            message: $localize`
                Hi there! I'm a toast message with forbidden tags:
                <script>alert("You shall not pass")</script>
                <object width="400" height="400"></object>
                <iframe src="https://www.solarwinds.com/"></iframe>
                <embed src="https://www.solarwinds.com/">
                `,
            options: {
                enableHtml: true, // Note: Default value
            },
        });
    }
}
