/**
 * Creates a new regular scroll listener
 * 
 * @param {Element} observeElement 
 * @param {Function} whenNext
 * @returns IntersectionObserver
 */
 export function createScroller(observeElement, whenNext) {
    //console.log("creating regular scroller");
    var parent = getScrollParent(observeElement);

    // Disable scroll anchoring https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-anchor/Guide_to_scroll_anchoring
    parent.style.overflowAnchor = "none";

    // Bug using scrollingElement in frames. See https://github.com/w3c/IntersectionObserver/issues/372
    var intersectionParent = (parent === document.documentElement ? document : parent);

    whenNext ??= () => Promise.reject(new Error("No scroller handler function defined")); // default

    const nextObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                whenNext();
            }
        });
    }, { root: intersectionParent, threshold: 0, rootMargin: "500px" });

    nextObserver.observe(observeElement);

    return nextObserver;
}

/**
 * Creates a new reverse scroll listener
 * 
 * @param {Element} observeElement 
 * @param {Function} whenNext 
 * @returns IntersectionObserver
 */
export function createReverseScroller(observeElement, whenNext) {
    // inverted infinite scroll (e.g. for messages)
    let prevSleep = false;

    //console.log("creating reverse scroller");
    var parent = getScrollParent(observeElement);

    // Disable scroll anchoring https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-anchor/Guide_to_scroll_anchoring
    parent.style.overflowAnchor = "none";

    // Bug using scrollingElement in frames. See https://github.com/w3c/IntersectionObserver/issues/372
    var intersectionParent = (parent === document.documentElement ? document : parent);

    whenNext ??= () => Promise.reject(new Error("No reverse scroller handler function defined")); // default

    const prevObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(function (entry) {
            if (entry.isIntersecting && !prevSleep) {
                prevSleep = true;

                // find first child (that is regularly positioned)
                var nextPositionedChild = getNextPositionedChild(entry.target);

                var prevScrollHeight = parent.scrollHeight;
                var childOffsetBefore = nextPositionedChild.offsetTop;
                
                //console.log("intersecting", childOffsetBefore);
                
                let afterNext = () => {
                    queueMicrotask(() => { // Place last in microtask queue
                        // scroll parent so that first child remains in the same position as before
                        // NOTE: when this is called via observer we need to requestAnimationFrame, otherwise scrolling happens to fast (before the DOM has been updated)
                        if (prevScrollHeight !== parent.scrollHeight) {
                            // layout already rendered
                            let diff = nextPositionedChild.offsetTop - childOffsetBefore;
                            //console.log("infinite scroll updated instantly", diff);
                            parent.scrollTop += diff;
                            requestAnimationFrame(() => prevSleep = false);
                        } else {
                            queueMicrotask(() => {
                                if (prevScrollHeight !== parent.scrollHeight) {
                                    // layout rendered after 
                                    let diff = nextPositionedChild.offsetTop - childOffsetBefore;
                                    //console.log("infinite scroll updated by microtask", diff);
                                    parent.scrollTop += diff;
                                    requestAnimationFrame(() => prevSleep = false);
                                } else {
                                    // layout not rendered yet
                                    requestAnimationFrame(() => {
                                        let diff = nextPositionedChild.offsetTop - childOffsetBefore;
                                        //console.log("infinite scroll updated by animationframe", diff);
                                        parent.scrollTop += diff;
                                        requestAnimationFrame(() => prevSleep = false);
                                    });
                                }
                            });
                        }
                    });
                };

                let whenNextResult = whenNext();

                if (whenNextResult) {
                    whenNextResult.then(afterNext);
                } else {
                    afterNext();
                }
            }
        })
    }, { root: intersectionParent, threshold: 0, rootMargin: "500px" });

    prevObserver.observe(observeElement);

    return prevObserver;
}

/**
 * 
 * @param {Element} el 
 * @returns Element
 */
export function getNextPositionedChild(el) {
    while(el = el?.nextElementSibling) {
        if(/absolute|sticky|fixed/.test(getComputedStyle(el).position) === false) {
            return el;
        }
    }
}

// get the closest ancestor element that is scrollable (adapted from https://stackoverflow.com/a/42543908/891843)
/**
 * 
 * @param {Element} element 
 * @returns Element
 */
export function getScrollParent(element) {
    var includeHidden = false;

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
 * 
 * @param {Element} ref 
 * @param {boolean} smooth 
 */
export function scrollToBottom(ref, smooth) {
    var parent = getScrollParent(ref);
    //console.log("scrolling #messages", origin, el.scrollHeight, el);
    
    if (parent && parent.scrollTop + parent.clientHeight !== parent.scrollHeight) {
        if (smooth) {
            parent.scrollTo({
                top: parent.scrollHeight,
                left: 0,
                behavior: 'smooth'
            });
        } else {
            parent.scrollTop = parent.scrollHeight;
        }
    }

}

