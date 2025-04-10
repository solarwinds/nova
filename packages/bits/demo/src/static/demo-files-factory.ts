import { CodeSourceFiles } from "@nova-ui/bits";

import { DEMO_PATHS } from "../components/demo/demo.files";

export const getDemoFiles = (
    filePrefix: string
): CodeSourceFiles => {
    const files = DEMO_PATHS.filter((filePath) =>
        filePath.includes(filePrefix)
    );
    return {
        context: filePrefix,
        files: files.map((filePath) => ({
            content: async () =>
                import(`./../components/demo/${filePath}`).then((e) => {
                    if (e.default) {
                        return e.default;
                    }
                    // typescript files may have exports non default members
                    return `${Object.values(e).join("\n")}`;
                }),
            path: filePath,
        })),
    };
};
