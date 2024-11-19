import { DEMO_PATHS } from "./components/demo/demo.files";

export const getDemoFiles = (
    filePrefix: string
): { context: string; files: Promise<{ path: string; content: string }>[] } => ({
    context: filePrefix,
    files: DEMO_PATHS.filter((filePath) => filePath.includes(filePrefix))
        .map(async (filePath) => ({
            content: await import(`!!raw-loader!./components/demo/${filePath}`).then(e=> e.default),
            path: filePath,
        }))
        ,
});
