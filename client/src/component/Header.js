import React from 'react'
import { NavLink } from 'react-router-dom'
import {useSelector } from 'react-redux';
import {RiUserLine} from "react-icons/ri"
import logo from "../assests/img/logo.svg"

const Header = () => {
  
  const {user} = useSelector((state)=> ({...state}))

  return (
    <>
     {/* desktop and table version */}
    <div className='w-full bg-[#E1F7FF] hidden sm:flex'>
    <header className='md:w-4/5 m-auto flex flex-row items-center sm:gap-8 md:gap-10 lg:gap-16 py-4 '>
        <div className='min-w-[56px] flex flex-row items-center'>
          <NavLink to={""}><img src={logo} alt="" className="w-14"/></NavLink>
          <NavLink to={""} className={`flex h-[30px] text-center`}>SabaiDee Bó</NavLink>
        </div>
        <nav className='flex gap-10 lg:gap-16 xl:mr-10'>
            {user && <>
              <NavLink to={"ordering"} className={({ isActive }) => `w-[65.6px] text-rgb(33, 37, 41) text-center ${isActive ? "border-b-2 font-bold pb-2 border-solid border-green-800" : ""} `}>Greet Word</NavLink>
              <NavLink to={"pay"} className={({ isActive }) => `w-[65.6px] text-rgb(33, 37, 41) text-center ${isActive ? "border-b-2 font-bold pb-2 border-solid border-green-800" : ""} `}>Student</NavLink>
              <NavLink to={"pay"} className={({ isActive }) => `w-[65.6px] text-rgb(33, 37, 41) text-center ${isActive ? "border-b-2 font-bold pb-2 border-solid border-green-800" : ""} `}>Report</NavLink>
            </>}
        </nav>
        <nav className='text-xl text-slate-500 border p-1 rounded-full border-slate-500 xl:ml-auto'>
          {!user && <>
            <NavLink to={"login"}><RiUserLine /></NavLink>
          </>}
          {user && <>
            <NavLink to={"profile"}><RiUserLine /></NavLink>
          </>}
        </nav>
    </header>
</div>
</>
  )
}

export default Header