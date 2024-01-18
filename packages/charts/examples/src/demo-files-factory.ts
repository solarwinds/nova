import { DEMO_PATHS } from "./components/demo/demo.files";

export const getDemoFiles = (
    filePrefix: string
): { context: string; files: { content: string; path: string }[] } => ({
    context: filePrefix,
    files: DEMO_PATHS.filter((filePath) => filePath.includes(filePrefix))
        .map((filePath) => ({
            content: require(`!!raw-loader!./components/demo/${filePath}`)
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
