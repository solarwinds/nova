import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
} from "@angular/core";

import { SeverityLevels } from "./public-api";

/**
 * @ignore
 */

@Component({
    selector: "nui-dialog-header",
    templateUrl: "./dialog-header.component.html",
})
export class DialogHeaderComponent implements OnInit {
    /**
     * Title of the dialog.
     */
    @Input() title: string;
    /**
     * Severity of the dialog. Possible values: 'critical', 'warning', 'info'.
     */
    @Input() severity: SeverityLevels;
    /**
     * Closes dialog on cross click.
     */
    @Output() closed = new EventEmitter();

    public severityClass = "";
    public severityIcon = "";

    public ngOnInit(): void {
        if (this.severity) {
            this.severityClass = `dialog-header-${this.severity}`;
            this.severityIcon = `severity_${this.severity}`;
        }
    }

    public innerClose (event: any) {
        this.closed.emit(event);
    }
}
