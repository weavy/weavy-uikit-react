import debounce from "lodash.debounce";
import { useCallback, useEffect, useRef } from "react";

export default function useDebounce(cb: any, delay: number) {
  
  const inputsRef = useRef({cb, delay}); // mutable ref like with useThrottle
  useEffect(() => { inputsRef.current = { cb, delay }; }); //also track cur. delay
  return useCallback(
    debounce((...args) => {
        // Debounce is an async callback. Cancel it, if in the meanwhile
        // (1) component has been unmounted (see isMounted in snippet)
        // (2) delay has changed
        if (inputsRef.current.delay === delay)
          inputsRef.current.cb(...args);
      }, delay, {
        leading: false,
        trailing: true
      }
    ),
    [delay, debounce]
  );
}