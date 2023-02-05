import React, {useRef} from "react";
import "../stylesheets/Screen.css";
//Displays values and operations on screen
const Screen = ({ input }) => {
    let isOverflown = false;
    const display = useRef(null)
    //Check if overflows
    if(display.current){
        if(display.current.children[0].scrollWidth >= display.current.clientWidth - 30){
            isOverflown = true;
        }
    }
    return (
    <div id="display" ref={display} className="input">
        <span>{!isOverflown ? input : "Digit limit!"}</span>
    </div>
    )
}

export default Screen;