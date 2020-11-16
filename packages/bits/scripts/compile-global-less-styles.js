"use strict";

const fs = require("fs");
const exec = require('child_process').exec;

const stylesDir = "./src/styles";
const outputDir = "./sdk/api-docs-ng2/styles/global-styles/";

const requredFiles = [
    "nui-framework-typography.less"
];

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

compileStyles(requredFiles);

function compileStyles(files) {
    files.forEach((fileName) => {
        const filePath = `${stylesDir}/${fileName}`;

        if (!fs.existsSync(filePath)) {
            throw {
                name: "FileNotFoundException: ",
                message: `File with name "${fileName}" doesn't exist under "${stylesDir}"!\n`
            }
        } else exec(`lessc ${filePath} ${outputDir}/${fileName.replace(".less", ".css")}`);
    }
)};

