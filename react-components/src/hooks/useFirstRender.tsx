import {useEffect, useRef} from "react";

export const useIsFirstRender = (): boolean => {
    let firstRender = useRef(true)
    useEffect(() => {
        firstRender.current = false
    }, [])
    return firstRender.current
}