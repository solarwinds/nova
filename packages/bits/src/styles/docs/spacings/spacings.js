Nui.app().controller("SpacingDemoController", [
    "$scope",
    function ($scope) {
        var vm = this;
        vm.spacings = {
            types: ["padding", "margin"],
            sizes: [
                {
                    value: "sm",
                    name: "small",
                },
                {
                    value: "md",
                    name: "medium",
                },
                {
                    value: "lg",
                    name: "large",
                },
            ],
            directions: [
                {
                    value: "h",
                    name: "horizontal",
                },
                {
                    value: "v",
                    name: "vertical",
                },
                {
                    value: "r",
                    name: "right",
                },
                {
                    value: "l",
                    name: "left",
                },
            ],
        };
        vm.margin = {
            size: "md",
            direction: "",
            isNegative: false,
        };
        vm.padding = {
            size: "md",
            direction: "",
        };

        vm.marginClass = "";
        vm.paddingClass = "";

        $scope.$watch(
            function () {
                return vm.margin;
            },
            function () {
                vm.marginClass =
                    "nui-margin-" + vm.margin.size + vm.margin.direction;
                if (vm.margin.isNegative) {
                    vm.marginClass += "-neg";
                }
            },
            true
        );
        $scope.$watch(
            function () {
                return vm.padding;
            },
            function () {
                vm.paddingClass =
                    "nui-padding-" + vm.padding.size + vm.padding.direction;
            },
            true
        );
    },
]);
