"use strict";

const fs = require("fs");

module.exports = {
    install: function (less, pluginManager, functions) {
        functions.add("process", function (file) {
            //break up the less file into lines.
            const lines = fs.readFileSync(file.value, "utf-8").split("\n");

            let finalString = "";
            let firstItem = true;

            lines.forEach(function (line) {
                //I hate regexes.  This one matches whatever is between @ and :
                const match = line.match(/(?<=@).*?(?=:)/);

                if (match && match[0] && match[0].length > 0) {
                    if (!firstItem) {
                        finalString += ",";
                    }
                    finalString += match[0];
                    firstItem = false;
                }
            });
            return finalString;
        });
    },
};
