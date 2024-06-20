import React from "react";
export const InputComp = (props) => {
  const propName = Object.keys(props)[0];
  const setThing = props[propName];
  const secondProp = Object.keys(props)[1];
//below message is only for setting the message when use is typing in the message bar and as soon as he will send the messsage message bar would go empty 
const value = props[secondProp];
  // Get the prop value
  return (
    <input
      onChange={(e) => { 
       
          setThing(e.target.value);
      }}
      required
      value={value}
      type={props.type}
      placeholder={props.placeholder}
      autoComplete="new-password"
      className={`
             ${props.style} w-full h-[3.5rem]  p-4 border border-gray-400 outline-none rounded-md `}
    />
  );
};
export const ButtonComp = ({disable = false , type = "button", Content }) => {
  return (
    <button
    disabled={disable}
      type={type}
      className="w-full h-[3rem] bg-sky-600 border text-white  shadow-2xl   rounded-md  "
    >
      {Content}
    </button>
  );
};
