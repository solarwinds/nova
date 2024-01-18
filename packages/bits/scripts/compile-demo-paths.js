"use strict";

const fs = require("fs");
const path = require("path");

const dir = "demo/src/components/demo/";
const files = [];
const fileTypes = [".ts", ".html", ".less", ".css"];

const getFilesRecursively = (directory) => {
    const filesInDirectory = fs.readdirSync(directory);
    for (const file of filesInDirectory) {
        const absolute = path.join(directory, file);
        if (fs.statSync(absolute).isDirectory()) {
            getFilesRecursively(absolute);
        } else {
            if (fileTypes.includes(path.extname(file))) {
                files.push(`"${absolute}"`);
            }
        }
    }
};

getFilesRecursively(dir);

const trimmedFiles = files.map((filePath) => {
    return filePath.replaceAll("\\", "\/").replace(dir, "");
});

fs.writeFileSync(`${dir}/demo.files.ts`, `// this file autogenerated, do not edit it manually please run the script\n// yarn run compile-demo-paths\nexport const DEMO_PATHS = [\n\t${trimmedFiles.join(",\n\t")},\n];\n`);