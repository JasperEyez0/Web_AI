import React from 'react'
import { NavLink } from 'react-router-dom'
import logo from "../assests/img/logo.svg"

import Axios from 'axios'
import { useState, useEffect, useCallback } from 'react'
import {useSelector} from "react-redux"


function Home () {

  //const token = localStorage.getItem('token');
  //console.log(token)
  //localStorage.removeItem('token')

  const [pList, setPList] = useState([]);
  const { user } = useSelector((state)=> ({...state}))
  const username = localStorage.getItem('username')

  const fetchP = useCallback(() => {
    Axios.get(`http://localhost:3001/professor?username=${username}`)
      .then((res) => {
        const foundProfessor = res.data.find((professor) => professor.username === username);
        if (foundProfessor) {
          setPList(foundProfessor);
          console.log(foundProfessor);
        } else {
          console.log(`No data found for username: ${username}`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if(username !== null) {
      fetchP();
    }
  }, [username, fetchP]);

return (
  <>
    {/* Handcrafted Curations */}
    <div className='bg-white h-screen'>
      <div className='bg-[#E1F7FF] w-auto h-[60%] flex flex-row justify-around'>
        <div className="text-8xl font-bold flex flex-col justify-evenly">
          {!username && <>
            <p>Welcome to</p>
            <p>SabaiDee</p>
            <p>Bó</p>
          </>}
          {username && <>
            <p>Welcome {pList.p_id}</p>
            <p>SabaiDee</p>
            <p>Bó</p>
          </>}
        </div>
      <div className="flex justify-center items-center">
        <NavLink to={""}><img src={logo} alt="" className="w-[500px]"/></NavLink>
      </div>
      </div>
    </div>
</>
)
}

export default Home