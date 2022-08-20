Nui.app().controller("ExampleColorsController", [
    "$http",
    "$scope",
    "nuiToastService",
    "getJsonLocation",
    function ($http, $scope, nuiToastService, getJsonLocation) {
        var vm = this;
        vm.sampleText = "sample text";
        vm.onClipboardSuccess = onClipboardSuccess;
        vm.semanticColors = {};

        function onClipboardSuccess() {
            nuiToastService.success("Color name was copied to clipboard.");
        }

        $http.get(getJsonLocation("colors.json")).then(function (response) {
            Object.assign(vm.semanticColors, response.data);
        });
    },
]);
