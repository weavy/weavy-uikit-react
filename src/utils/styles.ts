
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
   * Prefixes one or more classnames (with or without dot or double dash) using the themePrefix
   * @param {...string} strs 
   * @returns string[]
   */
  export function prefixes(...strs:string[]) {
    const _prefix = themePrefix || '';
    if (_prefix) {
      strs = strs.map((str) => {
        str ??= '';
        if (str[0] === '.') { // .example-class
          // Skip if already set
          if (str.substring(1).indexOf(_prefix + "-") !== 0) {
            return `.${_prefix}-${str.substring(1)}`;
          }
        } else if (str.indexOf("--") === 0) { // --example-var
          // Skip if already set
          if (str.substring(2).indexOf(_prefix + "-") !== 0) {
            return `--${_prefix}-${str.substring(2)}`;
          }
        } else { // example-class
          // Skip if already set
          if (str.indexOf(_prefix + "-") !== 0) {
            return `${_prefix}-${str}`;
          }
        }

        // return untouched str
        return str;
        
      })
    }
    return strs;
  }

  /**
   * Prefixes a classname string (containing one or multiple space-separated classnames, with or without dot or double dash) using the themePrefix
   * @param {string} str 
   * @returns string
   */
  export function prefix(str:string) {
    return prefixes(...(str.split(" "))).join(" ");
  }