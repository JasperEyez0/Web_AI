import React from 'react';
import { NavLink } from 'react-router-dom'
import {useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import '../page/StudentEdit.css'; 

import Axios from 'axios'
import { useState, useEffect } from 'react'

const StudentEdit = () => {

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
          <div className="flex flex-col w-full h-fit my-10 px-24 justify-start">
            <div className="flex flex-row w-full justify-around">
                <p className='min-w-[150px] px-2.5 py-[2px]'>ชื่อ</p>
                <p className='min-w-[150px] px-2.5 py-[2px]'>สกุล</p>
                <p className='min-w-[150px] px-2.5 py-[2px]'>รหัสนศ.</p>
                <p className='min-w-[150px] px-2.5 py-[2px]'>วันเกิด</p>
                <p className='min-w-[150px] px-2.5 py-[2px]'>เพศ (หญิง/ชาย)</p>
            </div>
            <form action="">
              <div className="flex flex-row w-full justify-around">
                  <input type="text" placeholder="ชื่อ" className='min-w-[100px] max-w-[150px] px-2.5 py-[2px] rounded-lg'/>
                  <input type="text" placeholder="สกุล" className='min-w-[100px] max-w-[150px] px-2.5 py-[2px] rounded-lg'/>
                  <input type="number" min={0} onKeyPress={(e) => {if (e.target.value.length === 13) {e.preventDefault();}}} placeholder="รหัสนศ." id='idnum' className='min-w-[100px] max-w-[150px] px-2.5 py-[2px] rounded-lg'/>
                  <input type="date" placeholder="วันเกิด" className='min-w-[100px] max-w-[150px] px-2.5 py-[2px] rounded-lg'/>
                  <input type="text" placeholder="เพศ" className='min-w-[100px] max-w-[150px] px-2.5 py-[2px] rounded-lg'/>
              </div>
              <div className="flex my-12 justify-center">
              <label for="images" className="relative flex gap-2.5 flex-col justify-center items-center h-48 w-1/4 p-5 border-2 border-dashed border-[#555] rounded-lg text-[#444] cursor-pointer transition-all duration-200 ease-in-out bg-transparent hover:bg-[#D0E6EE]">
                <span class="drop-title">Drop files here</span> or
                <input type="file" accept="image/*" required/>
              </label>
              </div>
            </form>
            <div className="flex m-6 items-center justify-center">
              <button className='px-5 bg-sky-800 text-[#fff] rounded-lg text-[20px]'>Edit</button>
            </div>
          </div>
        </div>
    );
}

export default StudentEdit