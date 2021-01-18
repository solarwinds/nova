const fs = require("fs");
const lockfile = require("@yarnpkg/lockfile");

let yarnFile = fs.readFileSync("yarn.lock", "utf8");
let json = lockfile.parse(yarnFile);

for (const dependency in json.object) {
    if(dependency.startsWith("@nova-ui/")) {
        delete json.object[dependency];
    }
}

let fileAgain = lockfile.stringify(json.object);

fs.writeFileSync("yarn.lock", fileAgain);
