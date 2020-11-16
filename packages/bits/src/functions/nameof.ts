/**
    The nameof operator obtains the name of a object member as a string constant
*
USAGE EXAMPLE
    console.log(nameof<Interface>("prop")); // "prop"
**/
export function nameof<T extends Object>(prop: Extract<keyof T, string>): string {
        return prop;
}
