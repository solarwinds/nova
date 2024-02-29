import { DEMO_PATHS } from "./components/docs/demo.files";

export const getDemoFiles = (
    filePrefix: string
): { context: string; files: { content: string; path: string }[] } => ({
    context: filePrefix,
    files: DEMO_PATHS.filter((filePath) => filePath.includes(filePrefix))
        .map((filePath) => ({
            content: require(`!!raw-loader!./components/docs/${filePath}`)
                .default,
            path: filePath,
        }))
        .concat({
            content:
                require(`./../../package.json.raw!=!raw-loader!./../../package.json`)
                    .default,
            path: "package.json",
        }),
});
