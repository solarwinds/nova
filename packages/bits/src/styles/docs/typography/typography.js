Nui.app().controller("TypographyDemoController", [
    function () {
        var vm = this;
        vm.units = [
            {
                header: "Page, Popup Title",
                class: "nui-text-page",
                sample: "Orion Summary Home",
            },
            {
                header: "Widget Title",
                class: "nui-text-widget",
                sample: "Hardware Health Overview",
            },
            {
                header: "From Section",
                class: "nui-text-panel",
                sample: "POLLING METHOD",
            },
            {
                header: "Field Label",
                class: "nui-text-label",
                sample: "Polling IP Address",
            },
            {
                header: "Default Text",
                class: "nui-text-default",
                sample: "Enable Dynamic Polling",
            },
            {
                header: "Secondary Text",
                class: "nui-text-secondary",
                sample: "SNMP and ICMP",
            },
            {
                header: "Small Text",
                class: "nui-text-small",
                sample: "Property",
            },
            {
                header: "Link",
                class: "nui-text-link",
                sample: "Link",
            },
        ];

        vm.fonts = [
            {
                header: "Critical",
                class: "nui-text-critical",
                sample: "Critical text sample",
            },
            {
                header: "Warning",
                class: "nui-text-warning",
                sample: "Warning text sample",
            },
            {
                header: "Regular",
                class: "nui-text-normal",
                sample: "Regular text sample",
            },
        ];

        vm.code = 'function() { console.log("Hello, world!"); }';
    },
]);
