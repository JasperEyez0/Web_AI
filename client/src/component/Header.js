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
    <div className='w-full bg-[#E1F7FF] hidden sm:flex justify-center border-b border-gray-300'>
    <header className='md:w-4/5 flex flex-row items-center sm:gap-8 md:gap-10 lg:gap-16 py-4'>
        <div className='min-w-[56px] flex flex-row items-center'>
          <NavLink to={""}><img src={logo} alt="" className="w-14"/></NavLink>
          <NavLink to={""} className={`flex h-[30px] text-center`}>SabaiDee Bó</NavLink>
        </div>
        <nav className='flex gap-10 lg:gap-16 ms-auto '>
            {user && <>
              <NavLink to={"greetword"} className={({ isActive }) => `flex items-center text-[16px] w-auto text-center px-3 pt-1 pb-2 rounded-[50px] ${isActive ? "text-[#fff] font-bold bg-sky-800" : ""} `}>Greet Word</NavLink>
              <NavLink to={"student"} className={({ isActive }) => `flex items-center text-[16px] w-auto text-center px-3 pt-1 pb-2 rounded-[50px] ${isActive ? "text-[#fff] font-bold bg-sky-800" : ""} `}>Student</NavLink>
              <NavLink to={"report"} className={({ isActive }) => `flex items-center text-[16px] w-auto text-center px-3 pt-1 pb-2 rounded-[50px] ${isActive ? "text-[#fff] font-bold bg-sky-800" : ""} `}>Report</NavLink>
            </>}
        </nav>
        <nav className='text-xl text-slate-500 border p-1 rounded-full border-slate-500'>
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