import React, {useState} from 'react';
import Star from "./Star/index.jsx";
import './index.css'

const StarRating = () => {
    const [rating, setRating] = useState(0)
    const [selection, setSelection] = useState(0)
    const onClick = (e) => {
        let r = e.target.getAttribute('star-id')
        if (!r) {
            return
        }
        if (r === rating) {
            r = 0
        }
        setRating(r)
    }
    const onMouseOver = (e) => {
        let s = e.target.getAttribute('star-id')
        if (!s) {
            return
        }
        console.log(s)
        setSelection(s)
    }
    return (
        <div className={"StarWrapper"} onClick={onClick} onMouseOver={onMouseOver} onMouseOut={() => {setSelection(0)}}>
            {
                new Array(5).fill(false, 0, 5).map((_, index) => {
                    return <Star on={selection && selection > 0? index <= selection - 1: index <= rating - 1} starId={index + 1} key={index}/>
                })
            }
            <div className={"Rate"}>{rating ? rating: 0}</div>
        </div>
    );
};

export default StarRating;
