/**
 * The interface for a dynamic link provider for widget header.
 */
export interface IHeaderLinkProvider {
    /**
     * Generates a link url based on a user configured URL
     *
     * @param template a user configured URL
     */
    getLink(template: string): string;
}
