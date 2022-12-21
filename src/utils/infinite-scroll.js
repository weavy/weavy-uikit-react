import { getNextPositionedChild, getScrollParent } from "./scroll-position"

const THRESHOLD = 0; // as soon as even one pixel is visible, the callback will be run
const ROOT_MARGIN = "24px"; // margin around the root, used to grow or shrink the root element's bounding box before computing intersections

/**
 * Creates a new regular scroll listener
 * 
 * @param {Element} observeElement 
 * @param {Function} whenNext
 * @returns IntersectionObserver
 */
 export function createScroller(observeElement, whenNext, reverse = false) {
    // inverted infinite scroll (e.g. for messages)
    let prevSleep = false;

    //console.log("creating reverse scroller");
    var parent = getScrollParent(observeElement);

    // Disable scroll anchoring https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-anchor/Guide_to_scroll_anchoring
    parent.style.overflowAnchor = "none";

    // Bug using scrollingElement in frames. See https://github.com/w3c/IntersectionObserver/issues/372
    var intersectionParent = (parent === document.documentElement ? document : parent);

    whenNext ??= () => Promise.reject(new Error("No reverse scroller handler function defined")); // default

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(function (entry) {
            if (entry.isIntersecting && !prevSleep) {
                prevSleep = true;

                // find first child (that is regularly positioned)
                if (reverse) {
                    var nextPositionedChild = getNextPositionedChild(entry.target);
                    var prevScrollHeight = parent.scrollHeight;
                    var childOffsetBefore = nextPositionedChild.offsetTop;
                }
                
                let afterNext = () => {
                    queueMicrotask(() => { // Place last in microtask queue
                        // scroll parent so that first child remains in the same position as before
                        // NOTE: when this is called via observer we need to requestAnimationFrame, otherwise scrolling happens to fast (before the DOM has been updated)
                        if (prevScrollHeight !== parent.scrollHeight) {
                            // layout already rendered
                            //console.log("infinite scroll updated instantly");
                            if (reverse) {
                                let diff = nextPositionedChild.offsetTop - childOffsetBefore;
                                parent.scrollTop += diff;
                            }
                            requestAnimationFrame(() => prevSleep = false);
                        } else {
                            queueMicrotask(() => {
                                if (prevScrollHeight !== parent.scrollHeight) {
                                    // layout rendered after 
                                    //console.log("infinite scroll updated by microtask");
                                    if (reverse) {
                                        let diff = nextPositionedChild.offsetTop - childOffsetBefore;
                                        parent.scrollTop += diff;
                                    }
                                    requestAnimationFrame(() => prevSleep = false);
                                } else {
                                    // layout not rendered yet
                                    requestAnimationFrame(() => {
                                        //console.log("infinite scroll updated by animationframe", diff);
                                        if (reverse) {
                                            let diff = nextPositionedChild.offsetTop - childOffsetBefore;
                                            parent.scrollTop += diff;
                                        }
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
    }, { root: intersectionParent, threshold: THRESHOLD, rootMargin: ROOT_MARGIN });

    scrollObserver.observe(observeElement);

    return scrollObserver;
}

/**
 * Creates a new reverse scroll listener
 * 
 * @param {Element} observeElement 
 * @param {Function} whenNext 
 * @returns IntersectionObserver
 */
export function createReverseScroller(observeElement, whenNext) {
    return createScroller(observeElement, whenNext, true);
}
