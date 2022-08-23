import { Component, Inject } from "@angular/core";

import { LoggerService } from "@nova-ui/bits";

@Component({
    selector: "nui-toolbar-selection-example",
    templateUrl: "./toolbar-selection.example.component.html",
})
export class ToolbarSelectionExampleComponent {
    public selectionEnabled = true;
    public select = {
        current: 1,
        total: 72,
    };
    public busy = false;
    public placeholder = $localize`Placeholder`;
    public searchKey: string;
    public stringToSearch = `
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec efficitur rutrum lacus id vulputate.
        Integer eu ex eu augue efficitur luctus quis ac elit. Nam odio est, iaculis nec varius id, congue erat.
        Nullam mi lectus, gravida quis pretium sit amet, accumsan non elit. In tempus commodo sem ac vulputate.
        Sed vel sagittis purus. Integer non ornare felis. Sed aliquam, purus et euismod tincidunt, felis ligula
    `;
    public value: string;
    private timerHandler: number;

    public constructor(@Inject(LoggerService) private logger: LoggerService) {}

    public onCancel(value: string) {
        this.logger.warn("Example onCancel fired. Value passed: " + value);
        if (value === "") {
            this.value = "";
            this.searchKey = "";
        } else {
            this.doCancel();
        }
    }

    public onSearch(value: string) {
        this.logger.warn(
            "Example onSearch fired. Current input value passed: " + value
        );
        this.doSearch(value);
    }

    private doCancel() {
        clearTimeout(this.timerHandler);
        this.busy = false;
    }

    private doSearch(value: string) {
        this.logger.warn("Example search started.");
        const _this = this;
        clearTimeout(_this.timerHandler);
        _this.busy = true;
        _this.timerHandler = <any>setTimeout(() => {
            _this.busy = false;
            _this.searchKey = value;
            _this.logger.warn("Example search finished.");
        }, 2000);
    }

    public toggleSelectedChange(event: any) {
        this.selectionEnabled = !this.selectionEnabled;
    }
}
