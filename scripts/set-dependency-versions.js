/** eslint-env es6 */

const projects = require("./projects.json");
const fs = require("fs");

const [version] = [...process.argv].slice(2);

for (const project of projects) {
    const packageJson = require(`../${project.path}/package.json`);

    for (const dep of project.dependencies) {
        if (packageJson.dependencies[dep]) {
            packageJson.dependencies[dep] = `~${version}`;
        }
        if (packageJson.devDependencies[dep]) {
            packageJson.devDependencies[dep] = `~${version}`;
        }
        if (packageJson.peerDependencies[dep]) {
            packageJson.peerDependencies[dep] = `~${version}`;
        }

        fs.writeFileSync(
            `./${project.path}/package.json`,
            JSON.stringify(packageJson, null, 2)
        );
    }
}
