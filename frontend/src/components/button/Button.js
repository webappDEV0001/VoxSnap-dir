import React from 'react';

import './Button.scss';

const Button = (props) => {
  return (
    <button
      type="button"
      className={`Button ${props.type ? props.type : ''}`}
      onClick={props.onClick ? props.onClick : () => {}}
    >
      {props.children}
    </button>
  );
}

export default Button;
