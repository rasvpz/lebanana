import { useRef, useState } from "react";
import Header from "./Header";
import InputText from "./InputText";
import Spinner from "./user/Spinner";
import { checkValidate } from "../utils/validate";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../utils/firebase";

const Login = () => {
    // const navigate = useNavigate()

    const email = useRef(null)
    const password = useRef(null)
    const firstName = useRef(null)
    const ballRef = useRef(null);

    const [isSignInForm, setIsSignInForm] = useState(true);
    const [errorMessage, setErrorMessage] = useState()


    const handleButtonClick = (event) => {
        event.preventDefault()
        const error = checkValidate(email.current.value,password.current.value)
        setErrorMessage(error)
          if(errorMessage === false) return
  
          if(!isSignInForm){
            // New Rgegistration
             createUserWithEmailAndPassword(auth, email.current.value,password.current.value)
              .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;  
                updateProfile(auth.currentUser, {
                  displayName: firstName.current.value, 
                  photoURL: "/user.png"
                }).then(() => {
                  const { uid, email, displayName, photoURL } = auth.currentUser 
                  console.log("From current user",uid, email, displayName, photoURL)               
                //   dispatch(addUser({
                //     uid:uid, 
                //     email:email, 
                //     displayName:displayName, 
                //     photoURL:photoURL
                //   }))
  
                }).catch((error) => {
                    console.log('error')
                });
                console.log("User", user)
              })
              .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setErrorMessage(errorCode + "-" + errorMessage)
                console.log("signupError", errorMessage)
  
              });
          }
          else{
            // Loging in
             signInWithEmailAndPassword  (auth, email.current.value,password.current.value)
              .then((userCredential) => {
                const user = userCredential.user;
                console.log("signInUser", user);
                
              })
              .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setErrorMessage(errorCode + "-" + errorMessage)
                console.log("signupError", errorMessage)
              });
          }
      }


    const toggleSignInForm = () => {
      setIsSignInForm(!isSignInForm);
    };

  return (
<div className="relative min-h-screen bg-cover bg-center">
  <Header />
  <img
    className="absolute inset-0 w-full h-full object-cover z-[-1]"
    src="https://cdn.pixabay.com/photo/2017/03/23/17/00/oranges-2168865_1280.jpg"
    alt="background"
  />
  
  <div className="flex justify-center items-center min-h-screen px-4 mt-[-100px]">
    <form
      ref={ballRef}
      className="w-full max-w-md p-4 bg-black bg-opacity-80 text-white rounded-lg"
    >
      {errorMessage ? <Spinner /> : 
      <h1 className="font-bold text-3xl py-2 text-[#F5F5F5]"><span className="text-[#007BFF]">
      </span> {isSignInForm ? ":: Log in" : ":: Register now"} </h1>}
      {
        !isSignInForm && (
        <InputText ref={firstName} placeholder="First name" />
      )}
      <InputText ref={email} placeholder="Email" />
      <InputText ref={password} placeholder="Password" />

      <button className="p-3 my-3 bg-[#007BFF]  w-full rounded-lg"
      onClick={handleButtonClick}
      >
      {isSignInForm ? "LogIn" : "Register Now"}
      </button>

      <p className="text-red-500">{errorMessage}</p>

      <p className="py-4 cursor-pointer" onClick={toggleSignInForm}>
          {isSignInForm
            ? "New to shop? Register Now"
            : "Already registered? LogIn."}
        </p>

    </form>
  </div>
</div>

  );
};
export default Login;
