import throttle from "lodash.throttle";

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

  return scrollbarClassnameTarget.classList.contains("wy-scrollbars");
}

/**
 * Creates a scrollbar detection element and starts observing it.
 */
export function detectScrollbars() {
  // insert scrollbar detection element
  var scrollCheckElement = document.getElementById("wy-scrollbar-detection");

  if (!scrollCheckElement) {
    scrollCheckElement = document.createElement("aside");
    scrollCheckElement.id = "wy-scrollbar-detection";
    scrollCheckElement.className = "wy-scrollbar-detection";
    document.documentElement.insertBefore(scrollCheckElement, document.body);
  }

  return new Promise((resolve) => {
    var scrollObserver = new ResizeObserver((entries) => {
      let hasScrollbars = checkScrollbar(entries);
      resolve(hasScrollbars);
    });
    scrollObserver.observe(scrollCheckElement);
  })
}

/**
 * The callback function for the scrollbar adjustments observer.
 * 
 * @param {ResizeObserverTarget[]} entries 
 */
export function checkScrollbarAdjust(entries) {
  for (var entry in entries) {
    let target = entries[entry].target;
    let targetStyle = getComputedStyle(target);
    //console.log("checking scrollbar adjust", target)
    if (target.dataset.adjustScrollbarTop !== undefined) {
      scrollbarClassnameTarget.style.setProperty('--wy-scrollbar-adjust-top', targetStyle.height);
    }
    if (target.dataset.adjustScrollbarBottom !== undefined) {
      scrollbarClassnameTarget.style.setProperty('--wy-scrollbar-adjust-bottom', targetStyle.height);
    }
  }
}

/**
 * Creates a scrollbar adjustment observer.
 */
export function detectScrollbarAdjustments() {
  //console.log("detect scrollbar adjust");
  var adjustRO = new ResizeObserver(checkScrollbarAdjust);
  
  const registerAdjustmentElements = () => {
    //console.log("register scrollbar adjust");

    scrollbarClassnameTarget.style.removeProperty('--wy-scrollbar-adjust-top');
    scrollbarClassnameTarget.style.removeProperty('--wy-scrollbar-adjust-bottom');
    adjustRO.disconnect();
    
    if (scrollbarClassnameTarget.classList.contains("wy-scrollbars")) {
      let scrollbarAdjustElements = document.querySelectorAll("[data-adjust-scrollbar-top], [data-adjust-scrollbar-bottom]");
      if (scrollbarAdjustElements) {
        scrollbarAdjustElements.forEach((target) => {
          checkScrollbarAdjust([{ target: target }]);
          adjustRO.observe(target);
        });
      }
    }    
  }  
  
  requestAnimationFrame(registerAdjustmentElements);
  setTimeout(registerAdjustmentElements, 5000);

  var adjustMO = new MutationObserver(throttle(registerAdjustmentElements, 100));
  adjustMO.observe(scrollbarClassnameTarget, {
    childList: true,
    subtree: true
  });
}
