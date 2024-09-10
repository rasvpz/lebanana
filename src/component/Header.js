import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../utils/firebase";
import { addUser, removeUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";

const Header = ({totalSale}) => {
  const user = useSelector(store => store.user)
  const place = user?.displayName?.split(',')[1]?.trim()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email, displayName, photoURL } = user;
        dispatch(addUser({ uid, email, displayName, photoURL }));
        if (window.location.pathname === '/') { // Only navigate to /browse if on login page
          navigate('/browse');
        }
      } else {
        dispatch(removeUser());
        navigate('/');
      }
    });
  
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [dispatch, navigate]);
  

  const signoutButton = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      signOut(auth).then(() => {
        // Sign-out successful.
        navigate('/');
      }).catch((error) => {
        // An error happened.
      });
    }
  };

const viewOrders = () => {
  if (user) { // Check if user is logged in
    navigate('/view');
  } else {
    // Handle potential scenarios like prompting login if not signed in
    // (optional, depending on your authentication flow)
  }
};

const viewHome = () => {
  if (user) { // Check if user is logged in
    navigate('/browse');
  } else {
    // Handle potential scenarios like prompting login if not signed in
    // (optional, depending on your authentication flow)
  }
};



  return (
<div className="flex items-center justify-between px-6 py-4 z-10">
<div className="flex items-center space-x-2 cursor-pointer" onClick={viewHome}>
  <img className="rounded-full w-10 h-10 border-2 border-white" src="/logo192.png" alt="logo" />
  <span className="text-lg font-bold text-[#ffdf27] lg:inline-block hidden sm:hidden">Le Banana</span>
</div>

  <div className="ml-auto flex items-center space-x-4">
    <span className="text-white cursor-pointer mt-2 flex" onClick={viewOrders}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-8 w-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5c4.36 0 7.89 3.94 7.98 4.04.15.17.22.4.2.63-.02.23-.11.45-.27.62-.09.1-3.64 4.05-7.91 4.05s-7.82-3.95-7.91-4.05a.875.875 0 0 1-.27-.62c-.02-.23.05-.46.2-.63C4.11 8.44 7.64 4.5 12 4.5zm0 6.75a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5z" />
      </svg> 
      <span className="ml-2">{totalSale ?  "₹" + totalSale : ''} </span>
    </span>

    {user?.displayName && (
      <>
        <span type="button" className="text-white font-bold">{place}</span>
        <span onClick={signoutButton} className="text-red-600 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m6.364-5.657a7.5 7.5 0 11-12.728 0" />
          </svg>
        </span>
      </>
    )}
  </div>
</div>

  );
};

export default Header;
