export const wordBoundary = '\\s,.:;"';
export const wordBoundaryWithHyphens = '\\s\\-,.:;"_';
export const separateByWordBoundaryRegExp = new RegExp(`^|[${wordBoundary}]|$`, "g");
export const separateByWordBoundaryWithHyphensRegExp = new RegExp(`^|[${wordBoundaryWithHyphens}]|$`, "g");
export const selectByWordBoundaryRegExp = new RegExp(
  `(?<=[${wordBoundary}]|^)[^${wordBoundary}]+(?=[${wordBoundary}]|$)`,
  "g"
);
export const selectByWordBoundaryWithHyphensRegExp = new RegExp(
  `(?<=[${wordBoundaryWithHyphens}]|^)[^${wordBoundaryWithHyphens}]+(?=[${wordBoundaryWithHyphens}]|$)`,
  "g"
);

/**
 *
 * @param name {string} - A name for which to get get initials, e.g. "Eddie" or "John Doe"
 * @param length {number} - Max number of chars to return.
 * @returns
 */
export function getInitials(name: string, length: number = 2) {
    if (!name) {
      return null;
    }
  
    let initials: string = "";
  
    const words = name.split(separateByWordBoundaryRegExp).filter((w) => w);
  
    if (words.length == 1) {
      initials = words[0];
    } else {
      words.forEach((word) => {
        initials += word.charAt(0);
      });
    }
  
    return initials.substring(0, length).toUpperCase();
  }
  