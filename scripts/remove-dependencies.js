/** eslint-env es6 */

const projects = require("./projects.json");
const fs = require("fs");

const [projectPath] = [...process.argv].slice(2);

const packageJson = require(`../${projectPath}/package.json`);
const project = projects.find((p) => p.path == projectPath);

if (!project) {
    console.error(`Project ${projectPath} not found!`);
    process.exit(1);
}

for (const dep of project.dependencies) {
    delete packageJson.devDependencies[dep];
}

fs.writeFileSync(
    `./${project.path}/package.json`,
    JSON.stringify(packageJson, null, 2)
);
