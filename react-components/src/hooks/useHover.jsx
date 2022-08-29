import {useRef} from "@types/react";
import {useEffect, useState} from "react";

export const useHover = () => {
    let ref = useRef()
    let [isHovered, setIsHoverd] = useState(false)
    useEffect(() => {

    })

    return [ref, isHovered]
}

function example() {
    const [ref, isHovered] = useHover()
    return <div ref={ref}>{isHovered? 'hovered': 'not hovered'}</div>
}