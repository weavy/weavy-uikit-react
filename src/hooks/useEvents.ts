import { useCallback, useState } from "react";

const events: object[] = [];
const callbacks: any = {};

function useForceUpdate() {
   const [, setState] = useState({});
   return useCallback(() => setState({}), []);
}

export default function useEvents() {

    const forceUpdate = useForceUpdate();
    const runCallbacks = (callbackList: Function[], data: any) => {
       if (callbackList) {
          callbackList.forEach(cb => cb(data));
          forceUpdate();
       }
     
    }

    const dispatch = (event: string, data: any) => {
        events.push({ event, data, created: Date.now() });
        runCallbacks(callbacks[event], data);
    }

    const on = (event: string, cb: Function) => {
        if (callbacks[event]) {
           callbacks[event].push(cb);
        } else {
          callbacks[event] = [cb];
        }
        
        // Return a cleanup function to unbind event
        return () => callbacks[event] = callbacks[event].filter((i: any) => i !== cb);
    }

    const off = (event: string, cb: Function) => {
        callbacks[event] = callbacks[event].filter((i: any) => i !== cb);
    }

    return { dispatch, on, off, events };
}