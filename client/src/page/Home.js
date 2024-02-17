import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from "../assests/img/logo.svg"

import Axios from 'axios'
import { useState, useEffect } from 'react'
import {useSelector} from "react-redux"


function Home () {

  const [pList, setPList] = useState([]);
  const {user} = useSelector((state)=> ({...state}))

  useEffect(() => {
    if(user !== null) {
      fetchP();
    }
  }, []);

  const fetchP = () => {
    Axios.get(`http://localhost:3001/professor?username=${user.username}`).then((res) => {
      if (res.data.length > 0) {
        setPList(res.data[0]);
        console.log(res.data[0]);
      } else {
        console.log(`No data found for username: ${user.username}`);
      }
    })
    .catch((err) => {
      console.log(err);
    });
  };

return (
  <>
    {/* Handcrafted Curations */}
    <div className='bg-white h-screen'>
      <div className='bg-[#E1F7FF] w-auto h-[60%] flex flex-row justify-around'>
        <div className="text-8xl font-bold flex flex-col justify-evenly">
          {!user && <>
            <p>Welcome to</p>
            <p>SabaiDee</p>
            <p>Bó</p>
          </>}
          {user && <>
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