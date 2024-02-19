import React from 'react';
import { NavLink } from 'react-router-dom'
import {useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'

import Axios from 'axios'
import { useState, useEffect } from 'react'

const Profile = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {user} = useSelector((state)=> ({...state}))

    const logout = () => {
        dispatch({
        type: "LOGOUT",
        payload: null,
        });
        navigate("/login")
    }

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
  
    return (
        <div className='flex flex-col relative w-full h-screen bg-[#E1F7FF] justify-around'>
            <div className="flex flex-col justify-center items-center">
                <div className="flex flex-col justify-between items-center bg-white px-6 min-w-60">
                    {user && <>
                        <p className='text-[24px] font-bold py-6'>Account Info</p>
                        <p className='pb-3'>Name : {profileList.p_name} {profileList.p_sname}</p>
                        <p className='pb-3'>ID : {profileList.p_id}</p>
                        <p className='pb-3'>Username : {profileList.username}</p>
                        <p className='pb-3'>Password : {profileList.password}</p>
                        <button onClick={logout} className='bg-[#61DAFB] py-[12px] px-[24px] mb-6 text-[12px] rounded-3xl opacity-60 hover:opacity-100'>Log Out</button>
                    </>}
                    {!user && <>
                        <h1>Welcome to SabaiDee Bó</h1>
                        <a href="login"><button>Login</button></a>
                    </>}
                </div>
            </div>
        </div>
    );
}

export default Profile