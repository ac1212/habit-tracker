import React from "react";
import checked_svg from "../assets/checked.svg";
import unchecked_svg from "../assets/unchecked.svg";
import "./checkCircle.css";

const CheckCircle = ({checked, dayOfWeek, onClick}) => {
  return (
    <img
      className={
        checked ? "common checked checked-color0" : "common unchecked"
      }
      src={checked ? checked_svg : unchecked_svg}
      alt={checked ? 'Y' : 'N'}
      onClick={() => {onClick(dayOfWeek);} } />
  );
};

export default CheckCircle;
