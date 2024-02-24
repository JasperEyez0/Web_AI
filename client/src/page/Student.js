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

const Student = () => {

    const {user} = useSelector((state)=> ({...state}))

    const [sList,setsList] = useState([]);

    useEffect(() => {
        fetchS();
    }, []);

    const fetchS = () => {
      Axios.get(`http://localhost:3001/student`).then((res) => {
        setsList(res.data)
      })
      .catch((err) => {
        console.log(err);
      });
    };

    const handleDelete = () => {}
    
    return (
        <div className="flex flex-col w-auto h-screen bg-[#E1F7FF]">
          <div className="flex flex-row w-full h-fit my-10 px-24 justify-start">
            <form action="">
              <div className="flex flex-row w-full">
                  <input type="text" placeholder="Serach" className='w-[450px] px-2.5 py-[2px] rounded-l-lg rounded-r-none'/>
                  <button className='px-1 bg-sky-800 text-[#fff] rounded-r-lg rounded-l-none text-[20px]'><IoIosSearch /></button>
              </div>
            </form>
            <div className="flex ml-6 items-center">
              <NavLink  to={"/studentadd"} className="p-2 bg-sky-800 text-[#fff] rounded text-[20px]"><TiUserAdd /></NavLink>
            </div>
          </div>
          <div className="flex flex-row w-full h-fit px-24">
            <table className='w-full table-auto text-left'>
              <thead>
                <tr>
                  <th className='py-4 pl-[10px]'>ชื่อ-สกุล</th>
                  <th className='py-4'>รหัสนศ.</th>
                  <th className='py-4'>วันเกิด</th>
                  <th className='py-4'>เพศ</th>
                  <th className='py-4'>รูป</th>
                </tr>
              </thead>
              <tbody>
                {sList.map((student, index) => (
                  <tr key={index} className='border-collapse border border-slate-300 h-[32px] bg-white'>
                    <th className='pl-[10px]'>{student.s_name} {student.s_sname}</th>
                    <th>{student.s_id}</th>
                    <th>{student.dateofbirth}</th>
                    <th>{student.gender}</th>
                    <th>{student.pic}</th>
                    <th>
                      <div className="flex items-center justify-around">
                        <NavLink to={`/studentedit`} className="p-2 bg-sky-800 text-[#fff] rounded-xl text-[18px]"><FaUserEdit /></NavLink>
                        <button onClick={() => handleDelete(student.s_id)} className='p-2 bg-red-400 text-[#000] rounded-xl text-[18px]'><RiDeleteBin5Fill /></button>
                      </div>
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    );
}

export default Student