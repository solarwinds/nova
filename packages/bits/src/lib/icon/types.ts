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

export interface IconData {
    svgFile: string;
    name: string | MappedIconNames;
    cat_namespace?: string | IconCategoryNamespace;
    category: string | IconCategory;
    code: string;
}

export enum IconCategory {
    Command = "command",
    HealthStatus = "health-status",
    Object = "object",
    Severity = "severity",
    State = "state",
    Tab = "tab",
    Widget = "widget",
}

export enum IconCategoryNamespace {
    Command = "command_",
    Object = "object_",
    Severity = "severity_",
    State = "state_",
    Status = "status_",
    Widget = "widget_",
}

export type MappedIconNames = IconSeverity | IconState | IconWidget;

export enum IconStatus {
    Acknowledged = "acknowledged",
    Critical = "critical",
    Disabled = "disabled",
    Down = "down",
    External = "external",
    Inactive = "inactive",
    Issues = "issues",
    Missing = "missing",
    Mixed = "mixed",
    Reserved = "reserved",
    NotRunning = "notrunning",
    Shutdown = "shutdown",
    Sleep = "sleep",
    Standby = "standby",
    Suspended = "suspended",
    Testing = "testing",
    Transient = "transient",
    Undefined = "undefined",
    Unknown = "unknown",
    Unmanaged = "unmanaged",
    Unplugged = "unplugged",
    Unreachable = "unreachable",
    Up = "up",
    Used = "used",
    Warning = "warning",
}

export enum IconSeverity {
    CriticalInverse = "severity_critical-inverse",
    Critical = "severity_critical",
    Error = "severity_error",
    InfoInverse = "severity_info-inverse",
    Info = "severity_info",
    Ok = "severity_ok",
    Tip = "severity_tip",
    Unknown = "severity_unknown",
    WarningInverse = "severity_warning-inverse",
    Warning = "severity_warning",
}

export enum IconState {
    Hidden = "state_hidden",
    Ok = "state_ok",
    Paused = "state_paused",
    Restarting = "state_restarting",
    Running = "state_running",
    Shutdown = "state_shutdown",
    Sleeping = "state_sleeping",
    Stopped = "state_stopped",
    Unknown = "state_unknown",
    Unmanaged = "state_unmanaged",
    Unplugged = "state_unplugged",
    Visible = "state_visible",
    Lock = "state_lock",
    Unlock = "state_unlock",
}

export enum IconWidget {
    Chart = "widget_chart",
    Dashboard = "widget_dashboard",
    Gauge = "widget_gauge",
    List = "widget_list",
    Map = "widget_map",
    Other = "widget_other",
    PieChart = "widget_pie-chart",
    Summary = "widget_summary",
    Table = "widget_table",
    Tree = "widget_tree",
}
