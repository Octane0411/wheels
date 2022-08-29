import { useRef } from "react"

export const usePrevious = (value) => {
    let prev = useRef(undefined)
    let ret = prev.current
    prev.current = value
    return ret
}