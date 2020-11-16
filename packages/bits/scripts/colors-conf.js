"use strict";

const path = require("path");
const fs = require("fs");
const readline = require("readline");

const dataDir = "./src/styles/data";
if (!fs.existsSync(dataDir)){
    fs.mkdirSync(dataDir);
}

const colorsDarkJsonPath = "./src/styles/data/framework-colors-dark.json";
const colorsDarkLessPath = "./src/styles/nui-framework-colors-dark.less";
const colorsJsonPath = "./src/styles/data/framework-colors.json";
const colorsLessPath = "./src/styles/nui-framework-colors.less";

const colorsDocsPath = "./src/styles/data/nui-framework-colors-docs.less";
const colorsDarkDocsPath = "./src/styles/data/nui-framework-colors-dark-docs.less";

let colorDarkToPaletteMapping = {};
let colorToPaletteMapping = {};

let colorsDocsStyles = `@import (reference) "../../styles/nui-framework-colors.less";\r\n`;
let colorsDarkDocsStyles = `@import (reference) "../../styles/nui-framework-colors-dark.less";\r\n`;

// not @import and exclude lines with //unofficial
const lessVariablesRe = /(^@(?!import)[^:]*)[:\s]*(.*[^;])[;](.*[^\w](unofficial*\b))*/i;
//everything after 'SECTION:' and until ' */'
const sectionNamesRe = /^\/.*(SECTION:)\s*(.*)(?:\s\*\/)/i;

// Create files if they do not exists
checkInit(colorsJsonPath, colorsDarkJsonPath, colorsDocsPath, colorsDarkDocsPath);

// Updating colors.json & nui-framework-colors-docs.less
updateMapping(colorToPaletteMapping, colorsLessPath, false)
    .on('close', () => {
        updateColorJson(colorsJsonPath, colorToPaletteMapping);
        fs.writeFileSync(colorsDocsPath, colorsDocsStyles);
    });

// Updating colors-dark.json & nui-framework-colors-dark-docs.less
updateMapping(colorDarkToPaletteMapping, colorsDarkLessPath, true)
    .on('close', () => {
        updateColorJson(colorsDarkJsonPath, colorDarkToPaletteMapping);
        fs.writeFileSync(colorsDarkDocsPath, colorsDarkDocsStyles);
    });

function checkInit(...paths) {
    paths.forEach((path) => {
        if (!fs.existsSync(path)) {
            const pathStream = fs.createWriteStream(path);
            pathStream.end();
        }
    });
}

function updateMapping(mapping, lessFilePath, isDark) {
    return readline.createInterface({
        input: fs.createReadStream(lessFilePath)
    })
        .on('line', (line) => {
            lineHandler(line, mapping, isDark)
            }
        )
}

function lineHandler(line, mapping, dark) {
    let sectionMatcher = line.match(sectionNamesRe);
    if (sectionMatcher) {
        mapping[sectionMatcher[2]] = [];
    }

    let matcher = line.match(lessVariablesRe);
    let unofficial = matcher && matcher[4] && matcher[4] === 'unofficial';
    if (matcher && !unofficial) {
        let lessVariable = matcher[1];
        let lessValue = matcher[2];
        let section = Object.keys(mapping).pop();
        mapping[section][mapping[section].length] = {
            "color": lessVariable,
            "secondary": lessValue
        };

        if (!dark) {
            colorsDocsStyles += `.${lessVariable.replace("@","")}{background: ${lessVariable}};\r\n`;
        } else {
            colorsDarkDocsStyles += `.${lessVariable.replace("@","")}{background: ${lessVariable}};\r\n`;
        }
    }
}

function updateColorJson(jsonPath, mapping) {
    // crudely determine the line-ending style to avoid altering it
    let dataStr = fs.readFileSync(jsonPath).toString();
    let isDosLineEnding = -1 !== dataStr.indexOf("\r\n");

    let mappingStr = JSON.stringify(mapping, null, 4);
    if (isDosLineEnding) {
        mappingStr = mappingStr.replace(/\r\n/gm, "\n")   // normalize first
            .replace(/\n/gm, "\r\n");  // CR+LF  -  Windows EOL
    }
    fs.writeFileSync(jsonPath, mappingStr);
}
