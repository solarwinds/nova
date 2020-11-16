/* tslint:disable */
declare namespace jasmine {
    interface Matchers<T> {
        toHaveDialog(util?: any, customEqualityTests?: any): jasmine.CustomMatcher;
        toHaveBackdrop(util?: any, customEqualityTests?: any): jasmine.CustomMatcher;
    }
}
/* tslint:enable */
