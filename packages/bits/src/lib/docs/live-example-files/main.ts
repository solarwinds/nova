export const MAIN = "import \"./polyfills\";\n" +
    "import { platformBrowserDynamic } from \"@angular/platform-browser-dynamic\";\n" +
    "\n" +
    "import { AppModule } from \"./app/app.module\";\n" +
    "\n" +
    "platformBrowserDynamic()\n" +
    "    .bootstrapModule(AppModule)\n" +
    "    .catch(err => console.log(err));\n";
