/**
 * Finds the nearest scrollable area. Defaults to document.scrollingElement.
 * 
 * @param {Element?} element - Reference element in the scrollable area
 * @param {boolean} [includeHidden=false] - Treat elements with `overflow: hidden` as scrollable areas.
 * @returns Element
 */
export function getScrollParent(element, includeHidden) {
    if (element) {
        var style = getComputedStyle(element);
        var excludeStaticParent = style.position === "absolute";
        var overflowRegex = includeHidden ? /(auto|scroll|overlay|hidden)/ : /(auto|overlay|scroll)/;

        if (style.position === "fixed") {
            return document.scrollingElement;
        }

        for (var parent = element; (parent = parent.parentElement);) {
            style = getComputedStyle(parent);

            if (excludeStaticParent && style.position === "static") {
                continue;
            }
            if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) {
                return parent;
            }
        }
    }

    return document.scrollingElement;
}

/**
 * Checks if a parent scroll container is scrolled to bottom
 * @param {Element?} element 
 * @param {number} [bottomThreshold=32] - Nearby limit for the bottom. Needs to be at least 1 to catch float calculation errors.
 * @returns boolean
 */
export function isParentAtBottom(element, bottomThreshold) {
    if (element) {
        bottomThreshold ??= 32; // Minimum 1 to catch float errors

        let area = getScrollParent(element);
        //console.log("isParentAtBottom", area.scrollTop, area.clientHeight, area.scrollHeight, Math.abs((area.scrollTop + area.clientHeight) - area.scrollHeight) <= bottomThreshold)
        // We need to account for scrollTop being a float
        return Math.abs((area.scrollTop + area.clientHeight) - area.scrollHeight) <= bottomThreshold;
    }
    return false;
}

/**
 * Scrolls a parent scroll container to the bottom using a reference element in the scrollable area.
 * 
 * @param {Element?} element - Element in the scroll area
 * @param {boolean} [smooth] - Use smooth scrolling instead of instant scrolling
 */
export function scrollParentToBottom(element, smooth) {
    if (element) {
        let area = getScrollParent(element);
        //console.log("scrolling to bottom", area.scrollHeight);

        // Don't bother if the scroll already is correct
        if (area.scrollTop + area.clientHeight !== area.scrollHeight) {
            if (smooth) {
                area.scrollTo({
                    top: area.scrollHeight,
                    left: 0,
                    behavior: 'smooth'
                });
            } else {
                area.scrollTop = area.scrollHeight;
            }
        }
    }
}