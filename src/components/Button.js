import React from "react";
import "../stylesheets/Button.css";

const Button = (props) =>{
    //Determine if value is an operator
const isOperator = value => {
    return isNaN(value) && (value !== ".") && (value !== "=")
    };

    return(
        <button /* Operators have different style*/
            className={`btn-container ${isOperator(props.children) ? "operator" : ""}`.trimEnd()}
            onClick={() => props.handleClick(props.children)}
            id={props.id}>
            {props.children}
        </button>
    );
};

export default Button;