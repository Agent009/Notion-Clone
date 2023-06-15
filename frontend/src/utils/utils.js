let debounceTimeout;
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export function debounce(func, wait, immediate) {
    return function() {
        let context = this, args = arguments;
        // console.log("in debounce - " + debounceTimeout);
        // console.log(hashCyrb53(func.toString()));
        // console.log(context);
        let later = function() {
            // console.log("later - " + debounceTimeout);
            // console.log(hashCyrb53(func.toString()));
            debounceTimeout = null;
            if (!immediate) func.apply(context, args);
        };
        let callNow = immediate && !debounceTimeout;
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}