import React, {useState} from 'react';
import './index.css'

function Star({on, starId}) {
    return (
        <span className={on ? 'on': 'off'} star-id={starId} role={"button"}>{on ?"\u2605": "\u2606"}</span>
    );
}



export default Star;