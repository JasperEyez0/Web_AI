import React from 'react';
import { NavLink } from 'react-router-dom'
import {useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'

import Axios from 'axios'
import { useState, useEffect } from 'react'

const Report = () => {

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
  
    return (
        <div className="flex w-auto h-screen">

        </div>
    );
}

export default Report