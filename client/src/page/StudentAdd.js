import React from 'react';
import { NavLink } from 'react-router-dom'
import {useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { IoIosSearch } from "react-icons/io";
import { TiUserAdd } from "react-icons/ti";
import { FaUserEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";

import Axios from 'axios'
import { useState, useEffect } from 'react'

const StudentAdd = () => {

    const {user} = useSelector((state)=> ({...state}))

    const [profileList,setProfileList] = useState([]);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = () => {
        Axios.get(`http://localhost:3001/professor?username=${user.username}`).then((res) => {
          const foundProfessor = res.data.find((professor) => professor.username === user.username);
          if (foundProfessor) {
            setProfileList(foundProfessor);
            //console.log(foundProfessor);
          } else {
            console.log(`No data found for username: ${user.username}`);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      };
        //6 = 24px 24 = 96px
    return (
        <div className="flex flex-col w-auto h-screen bg-[#E1F7FF]">
          <div className="flex flex-row w-full h-fit my-10 px-24 justify-start">
            <form action="">
              <div className="flex flex-row w-full">
                  <input type="text" placeholder="Serach" className='w-[450px] px-2.5 py-[2px] rounded-l-lg'/>
                  <button className='px-1 bg-sky-800 text-[#fff] rounded-r-lg text-[20px]'><IoIosSearch /></button>
              </div>
            </form>
            <div className="flex ml-6 items-center">
              <NavLink  to={""} className="p-1 bg-sky-800 text-[#fff] rounded text-[20px]"><TiUserAdd /></NavLink>
            </div>
          </div>
        </div>
    );
}

export default StudentAdd