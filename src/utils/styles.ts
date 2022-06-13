
var themePrefix = "wy";

/**
 * Sets the prefix for CSS classes on the HTML element for usage in javascript.
 * @param {string} prefix
 */
 export function setPrefix(prefix:string) {
    if (typeof prefix === "string") {
        themePrefix = prefix;
    }
  }
  
  
  /**
   * Prefixes one or more classnames (with or without dot) using the themePrefix
   * @param {...string} strs 
   * @returns string[]
   */
  export function prefixes(...strs:string[]) {
    const _prefix = themePrefix || '';
    if (_prefix) {
      strs = strs.map((str) => {
        str ??= '';
        if (str[0] === '.') {
          return `.${_prefix}-${str.substring(1)}`;
        } else {
          return `${_prefix}-${str}`;
        }
      })
    }
    return strs;
  }

  /**
   * Prefixes one classname (with or without dot) using the themePrefix
   * @param {string} str 
   * @returns string
   */
  export function prefix(str:string) {
    return prefixes(...(str.split(" "))).join(" ");
  }