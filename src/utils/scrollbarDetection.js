// SCROLLBAR DETECTION

/**
 * The target which the scrollbar classname will be applied to.
 * @type Element
 */
export var scrollbarClassnameTarget = document.documentElement;

/**
 * The callback function for the scrollbar observer.
 * @param {ResizeObserverTarget[]} entries 
 */
export function checkScrollbar(entries) {
  var element, overflowWidth;
  for (var entry in entries) {
    element = entries[entry].target;
    try {
      overflowWidth = element === document.documentElement ? window.innerWidth : element.clientWidth;
      if (overflowWidth !== element.offsetWidth) {
        // we have visible scrollbars, add .scrollbar to html element
        scrollbarClassnameTarget.classList.add("wy-scrollbars");
      } else {
        scrollbarClassnameTarget.classList.remove("wy-scrollbars");
      }
    } catch (e) {
      console.warn("scrollbar detection failed", e);
    }
  }
}

/**
 * Creates a scrollbar detection element and starts observing it.
 */
export default function observeScrollbars() {
  // insert scrollbar detection element
  var scrollCheck = document.getElementById("wy-scrollbar-detection");

  if (!scrollCheck) {
    scrollCheck = document.createElement("aside");
    scrollCheck.id = "wy-scrollbar-detection";
    scrollCheck.className = "wy-scrollbar-detection";
    document.documentElement.insertBefore(scrollCheck, document.body);
  }

  var scrollObserver = new ResizeObserver(checkScrollbar);
  scrollObserver.observe(scrollCheck);
}

