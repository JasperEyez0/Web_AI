import React from 'react';
import { NavLink } from 'react-router-dom'
import { IoIosSearch } from "react-icons/io";
import { IoImage } from "react-icons/io5";
import { FaUserEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { GoTriangleLeft, GoTriangleRight } from "react-icons/go";
import { BiSolidFileExport } from "react-icons/bi";

import Axios from 'axios'
import { useState, useEffect, useCallback } from 'react'
import 'react-image-crop/dist/ReactCrop.css';

const Report = () => {

  //const token = localStorage.getItem('token');
  //console.log(token)

  const [sList,setsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [triangleIcon, setTriangleIcon] = useState(<GoTriangleLeft />);
  const [selectedCount, setSelectedCount] = useState(0);

  const [selectedCategories, setSelectedCategories] = useState({
    all: false,
    studentId: false,
    name: false,
    age: false,
    mood: false,
    datetime: false,
    gender: false,
    img: false,
    fimg: false
  });

  const handleCategoryClick = () => {
    setShowCategoryPopup(!showCategoryPopup);
    if (!showCategoryPopup) {
      // รีเซ็ตสถานะ checkbox เมื่อปิด category-popup
      setSelectedCategories({
        all: false,
        studentId: false,
        name: false,
        age: false,
        mood: false,
        datetime: false,
        gender: false,
        img: false,
        fimg: false
      });
    }
    setTriangleIcon(showCategoryPopup ? <GoTriangleLeft /> : <GoTriangleRight />);
  };

  const handleSelect = (category) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  
    // นับจำนวน checkbox ที่ถูกเลือก (ยกเว้น all)
    const selectedCount = Object.values(selectedCategories).filter((value, key) => key !== 'all' && value).length;
    setSelectedCount(selectedCount);
  };

  const handleSelectAll = () => {
    const allChecked = !selectedCategories.all;
  
    // ให้ทุก checkbox เปลี่ยนสถานะตามค่า allChecked
    setSelectedCategories((prev) => ({
      ...prev,
      all: allChecked,
      studentId: allChecked,
      name: allChecked,
      age: allChecked,
      mood: allChecked,
      datetime: allChecked,
      gender: allChecked,
      img: allChecked,
      fimg: allChecked,
    }));
  };

  useEffect(() => {
    // นับจำนวน checkbox ที่ถูกเลือก (ยกเว้น all)
    if(selectedCategories.all === true){
      const selectedCount = Object.values(selectedCategories).filter((value) => value === true).length-1;
      setSelectedCount(selectedCount);
    }else{
      const selectedCount = Object.values(selectedCategories).filter((value) => value === true).length;
      setSelectedCount(selectedCount);
    }
    
  }, [selectedCategories]);

  const fetchS = useCallback(() => {
    Axios.get(`http://localhost:3001/student`, {
      params: { search: searchQuery } // ส่งคำค้นหาไปยังเซิร์ฟเวอร์
    })
      .then((res) => {
        setsList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [searchQuery]);

  useEffect(() => {
    fetchS();
  }, [fetchS]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchS();
  };

  const handleDelete = (studentId) => {
    if (window.confirm('คุณต้องการลบข้อมูลนักศึกษานี้หรือไม่?')) {
      Axios.delete(`http://localhost:3001/student/${studentId}`)
        .then((res) => {
          console.log('Student deleted successfully:', res.data);
          // ทำการ redirect หรือทำอย่างอื่นตามต้องการ
          fetchS();  // เพื่อรีเฟรชข้อมูลหลังจากลบ
        })
        .catch((err) => {
          console.log('Error deleting student:', err);
        });
    }
  }
  
  return (
    <div className="flex flex-col w-auto h-screen bg-[#E1F7FF]">

      {/* Body Header */}
      <div className="flex flex-row w-full h-fit my-10 px-24 justify-start">

        {/* Searchbar */}
        <form action="">
          <div className="flex flex-row w-full">
            <input
              type="text"
              placeholder="Search"
              className="w-[450px] h-[36px] px-2.5 py-[2px] rounded-l-lg rounded-r-none"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button onClick={handleSearch} className='px-1 bg-sky-800 text-[#fff] rounded-r-lg rounded-l-none text-[20px]'><IoIosSearch /></button>
          </div>
        </form>

        {/* Button next to searchbar */}
        <div className="flex ml-6 w-fit items-center justify-evenly relative">
          <NavLink  to={"/reportimgs"} className="p-2 bg-sky-800 text-[#fff] rounded text-[20px] mr-6"><IoImage /></NavLink>
          <button onClick={handleCategoryClick} className="flex h-[36px] px-2 bg-sky-800 text-[#fff] rounded items-center mr-6">Category {triangleIcon}</button>
          <button className="flex h-[36px] px-2 bg-sky-800 text-[#fff] rounded items-center">Exprot <BiSolidFileExport /></button>

          {/* Popup */}
          {showCategoryPopup && (
            <div className="category-popup bg-white border rounded p-4 absolute left-40 top-0 shadow-lg min-w-[250px]">
              <ul>
                <li className="flex justify-start py-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.all}
                    onChange={() => handleSelectAll()}
                    className="m-[5.5px] mr-4 h-fit items-center"
                  />
                  <p className='font-bold'>ทั้งหมด</p>
                  <p className='ml-8 text-[12px] font-bold'>{selectedCount} of 8 Selected</p>
                </li>
                <li className="flex justify-start py-2 ml-6">
                  <input
                    type="checkbox"
                    checked={selectedCategories.studentId}
                    onChange={() => handleSelect('studentId')}
                    className="mr-2"
                  />
                  <p>รหัสนศ.</p>
                </li>
                <li className="flex justify-start py-2 ml-6">
                  <input
                    type="checkbox"
                    checked={selectedCategories.name}
                    onChange={() => handleSelect('name')}
                    className="mr-2"
                  />
                  <p>ชื่อ-สกุล</p>
                </li>
                <li className="flex justify-start py-2 ml-6">
                  <input
                    type="checkbox"
                    checked={selectedCategories.age}
                    onChange={() => handleSelect('age')}
                    className="mr-2"
                  />
                  <p>อายุ</p>
                </li>
                <li className="flex justify-start py-2 ml-6">
                  <input
                    type="checkbox"
                    checked={selectedCategories.mood}
                    onChange={() => handleSelect('mood')}
                    className="mr-2"
                  />
                  <p>อารมณ์</p>
                </li>
                <li className="flex justify-start py-2 ml-6">
                  <input
                    type="checkbox"
                    checked={selectedCategories.datetime}
                    onChange={() => handleSelect('datetime')}
                    className="mr-2"
                  />
                  <p>วัน/เวลา</p>
                </li>
                <li className="flex justify-start py-2 ml-6">
                  <input
                    type="checkbox"
                    checked={selectedCategories.gender}
                    onChange={() => handleSelect('gender')}
                    className="mr-2"
                  />
                  <p>เพศ</p>
                </li>
                <li className="flex justify-start py-2 ml-6">
                  <input
                    type="checkbox"
                    checked={selectedCategories.img}
                    onChange={() => handleSelect('img')}
                    className="mr-2"
                  />
                  <p>รูป</p>
                </li>
                <li className="flex justify-start py-2 ml-6">
                  <input
                    type="checkbox"
                    checked={selectedCategories.fimg}
                    onChange={() => handleSelect('fimg')}
                    className="mr-2"
                  />
                  <p>รูปใหญ่</p>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Body Center (Show data) */}
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
          {sList.map((student, index) => {
            // Check if the student's name, surname, or id contains the search query
            const nameMatches = student.s_name.toLowerCase().includes(searchQuery.toLowerCase());
            const surnameMatches = student.s_sname.toLowerCase().includes(searchQuery.toLowerCase());
            const idMatches = student.s_id.toString().toLowerCase().includes(searchQuery.toLowerCase());

            // Display the row only if name, surname, or id matches the search query
            if (nameMatches || surnameMatches || idMatches) {
              return (
                <tr key={index} className='border-collapse border border-slate-300 h-[32px] bg-white'>
                  <th className='pl-[10px]'>{student.s_name} {student.s_sname}</th>
                  <th>{student.s_id}</th>
                  <th>{student.dateofbirth ? new Date(student.dateofbirth).toLocaleDateString() : ""}</th>
                  <th>{student.gender}</th>
                  <th>{student.pic}</th>
                  <th>
                    <div className="flex items-center justify-around">
                      <NavLink to={`/studentedit/${student.s_id}`} className="p-2 bg-sky-800 text-[#fff] rounded-xl text-[18px]"><FaUserEdit /></NavLink>
                      <button onClick={() => handleDelete(student.s_id)} className='p-2 bg-red-400 text-[#000] rounded-xl text-[18px]'><RiDeleteBin5Fill /></button>
                    </div>
                  </th>
                </tr>
              );
            }
            return null; // If no match, return null (no table row)
          })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Report;
