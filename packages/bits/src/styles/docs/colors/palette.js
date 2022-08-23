Nui.app().controller("ExamplePaletteController", [
    "$http",
    "getJsonLocation",
    function ($http, getJsonLocation) {
        var vm = this;
        vm.palette = {};

        $http.get(getJsonLocation("palette.json")).then(function (response) {
            Object.assign(vm.palette, response.data);
        });
    },
]);
