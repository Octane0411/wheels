import {useEffect, useRef} from "react";

export const useTimeout = (callback: () => void, delay: number) => {
    const cb = useRef(callback);
    cb.current = callback
    useEffect(() => {
        let id = setTimeout(cb.current, delay)
        return () => { clearTimeout(id) };
    }, [delay]);
}