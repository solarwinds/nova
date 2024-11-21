import { DEMO_PATHS } from "./components/docs/demo.files";

export const getDemoFiles = (
    filePrefix: string
): { context: string; files: Promise<{ content: string; path: string }>[] } => ({
    context: filePrefix,
    files: DEMO_PATHS.filter((filePath) => filePath.includes(filePrefix))
        .map(async (filePath) => ({
            content: await import(`!!raw-loader!./components/docs/${filePath}`).then(e=>e.default),
            path: filePath,
        }))
        ,
});
