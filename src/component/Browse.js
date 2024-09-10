import React from 'react'
// import Header from './Header'
import { useSelector } from 'react-redux'
import Admin from "./admin/Admin";
import User from "./user/User";

const Browse = () => {
  const user = useSelector(store => store.user)
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover"
          src="https://cdn.pixabay.com/photo/2017/03/23/17/00/oranges-2168865_1280.jpg"
          alt="background"
        />
      </div>
      <div className="relative z-10">
      {/* <Header /> */}
        {
          user?.displayName === "admin" 
          ? <Admin />
          : <User />
        }
      </div>
    </div>
  )
}

export default Browse
