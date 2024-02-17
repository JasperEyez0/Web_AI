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
        Axios.get('http://localhost:3000/professor').then((res) => {
            setProfileList(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
    };
  
    return (
        <div className='flex flex-col relative w-full h-screen bg-[#E1F7FF]'>
            <div className="flex flex-col justify-center items-center">
                {user && <>
                    <span>You Logged In</span>
                    <h1 style={{fontSize:"30px"}} className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>{user.username}</h1>
                    <button onClick={logout}>Log Out</button>
                </>}
                {!user && <>
                    <h1>Welcome to SabaiDee Bó</h1>
                    <a href="login"><button>Login</button></a>
                </>}
            </div>
        </div>
    );
}

export default Profile