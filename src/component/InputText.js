// InputText.js
import React, { forwardRef } from "react"

const InputText = forwardRef((props, ref) => {
    return <input className="p-3 my-2 w-full bg-gray-700" type="text" ref={ref} placeholder={props.placeholder} {...props} />
});

export default InputText;





// {!isSignInForm && <input
//     ref={firstName}
//       type="text"
//       placeholder="Full name"
//       className="p-3 my-2 w-full bg-gray-700"
//     /> }
    
//     <input
//     ref={email}
//       type="email"
//       placeholder="email"
//       className="p-3 my-2 w-full bg-gray-700"
//     />        
//     <input
//     ref={password}
//       type="password"
//       placeholder="password"
//       className="p-3 my-2 w-full bg-gray-700"
//     />