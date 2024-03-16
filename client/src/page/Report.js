import React from 'react';
import { NavLink } from 'react-router-dom'
import { IoIosSearch } from "react-icons/io";
import { IoImage } from "react-icons/io5";
import { GoTriangleLeft, GoTriangleRight } from "react-icons/go";
import { BiSolidFileExport } from "react-icons/bi";

import Axios from 'axios'
import axios from 'axios';
import { useState, useEffect, useCallback } from 'react'
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import xmlbuilder from 'xmlbuilder';

const Report = () => {

  //const token = localStorage.getItem('token');
  //console.log(token)

  const [report, setReport] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [triangleIcon, setTriangleIcon] = useState(<GoTriangleLeft />);
  const [selectedCount, setSelectedCount] = useState(0);

  const [hidden, setHidden] = useState(true); // สร้าง state เพื่อเก็บสถานะ hidden

  const [file, setFile] = useState(null);
  const [src, setSrc] = useState(null);
  const [crop, setCrop] = useState({
    width: 200,
    height: 200,
  });
  const [image, setImage] = useState(null);
  const [output, setOutput] = useState(null);

  const [selectedCategories, setSelectedCategories] = useState({
    all: true,
    studentId: true,
    name: true,
    age: true,
    mood: true,
    datetime: true,
    gender: true,
    img: true,
    fimg: true
  });

  const handleCategoryClick = () => {
    setShowCategoryPopup(!showCategoryPopup);

    // ถ้าปิด Category Popup และ selectedCategories ยังไม่ถูกเลือกทั้งหมด
    if (!showCategoryPopup && !isAllCategoriesSelected()) {
      // ไม่ทำการ reset ค่า selectedCategories
      setTriangleIcon(showCategoryPopup ? <GoTriangleLeft /> : <GoTriangleRight />);
      return;
    }

    // ถ้าปิด Category Popup และ selectedCategories ถูกเลือกทั้งหมด
    if (!showCategoryPopup && isAllCategoriesSelected()) {
      // ไม่ทำการ reset ค่า selectedCategories
      setTriangleIcon(showCategoryPopup ? <GoTriangleLeft /> : <GoTriangleRight />);
      return;
    }

    setTriangleIcon(showCategoryPopup ? <GoTriangleLeft /> : <GoTriangleRight />);
  };

  const isAllCategoriesSelected = () => {
    return Object.values(selectedCategories).every((value) => value === true);
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

  useEffect(() => {
    fetchReport();
    console.log(report); // ตรวจสอบค่าทั้งหมดที่ได้จากการ fetch
  }, [searchQuery]);

  const fetchReport = async () => {
    //console.log(searchQuery)
    try {
  
      // ส่งค่าไปยังเซิร์ฟเวอร์
      const res = await Axios.get('http://localhost:3001/report', {
        params: { search: searchQuery } // ส่งคำค้นหาไปยังเซิร์ฟเวอร์
      });
  
      setReport(res.data);
    } catch (error) {
      console.error('Error fetching report:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchReport();
  };

  function calculateAge(dateOfBirth) {
    if (dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
  
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
  
      return age;
    }
  
    return null; // หรือค่าที่ต้องการสำหรับข้อมูลที่ไม่สามารถคำนวณอายุได้
  }

  const cropImageNow = () => {
    if (image) {  // Ensure image is not null before proceeding
      const canvas = document.createElement('canvas');
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext('2d');

      const pixelRatio = window.devicePixelRatio;
      canvas.width = crop.width * pixelRatio;
      canvas.height = crop.height * pixelRatio;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      // Converting to base64
      const base64Image = canvas.toDataURL('image/jpeg');
      setOutput(base64Image);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    selectImage(selectedFile);
  };

  const selectImage = (file) => {
    setSrc(URL.createObjectURL(file));
  };

  const onImageLoaded = useCallback((img) => {
    setImage(img);
    setCrop({ aspect: 1 / 1, unit: 'px', width: 100, height: 100 });
  }, []);

  const handleCropChange = (newCrop) => {
    setCrop(newCrop); // เรียก setCrop เพื่ออัปเดตค่า crop
    cropImageNow();    // เรียก cropImageNow เพื่อทำการ crop ภาพ
  };

  const handleButtonShowCrop = () => {
    setHidden(!hidden); // เมื่อกดปุ่มจะสลับสถานะ hidden จาก true เป็น false หรือจาก false เป็น true
  };

  const handleSearchImg = async (e) => {
    e.preventDefault(); // ป้องกันการรีเฟรชหน้าเว็บ
    try {
      cropImageNow(); // ทำการ crop ภาพก่อนจะทำการส่งไปที่ backend
      const formData = new FormData();
      formData.append('file', file); // เพิ่มไฟล์ที่ถูก crop เข้าใน FormData
  
      // ทำการส่งไฟล์ที่ถูก crop ไปยัง backend
      const response = await axios.post('/verify', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

  
      // นำเอาผลลัพธ์ที่ได้รับจาก backend มาใช้งานต่อได้ตามต้องการ
      setReport(response.data.true_results);
      console.log(response.data.true_results);
      // console.log(report);
    } catch (error) {
      console.error('Error verifying image:', error);
    }
  };

  const generateXML = () => {
    const root = xmlbuilder.create('data');
    const timestamp = new Date().getTime();
    const fileName = `data_${timestamp}.xml`;

    report.forEach((data, index) => {
      const row = root.ele('row', { key: index });
      if (selectedCategories.studentId) row.ele('studentId', data.s_id || "null");
      if (selectedCategories.name) row.ele('name', `${data.s_name} ${data.s_sname || "Stranger"}`);
      if (selectedCategories.age) row.ele('age', calculateAge(data.dateofbirth) || data.age);
      if (selectedCategories.mood) row.ele('mood', data.mood);
      if (selectedCategories.datetime) row.ele('datetime', data.date);
      if (selectedCategories.gender) row.ele('gender', data.gender || "null");
      if (selectedCategories.img) row.ele('img', data.pic_r);
      if (selectedCategories.fimg) row.ele('fimg', data.pic_cam);
    });

    const xmlString = root.end({ pretty: true });
    console.log(xmlString); // เพื่อตรวจสอบ XML ที่สร้าง

    // สร้างไฟล์ XML
    const blob = new Blob([xmlString], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
          <button onClick={handleButtonShowCrop} className="p-2 bg-sky-800 text-[#fff] rounded text-[20px] mr-6"><IoImage /></button>
          <button onClick={handleCategoryClick} className="flex h-[36px] px-2 bg-sky-800 text-[#fff] rounded items-center mr-6">Category {triangleIcon}</button>
          <button onClick={generateXML} className="flex h-[36px] px-2 bg-sky-800 text-[#fff] rounded items-center">Export <BiSolidFileExport /></button>

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
      
      {/* Crop box */}
      <div className={`flex flex-col w-full h-fit my-10 px-24 justify-start ${hidden ? 'hidden' : ''}`}>
        <div className="flex pt-10">
            <div className='flex flex-col w-full justify-center items-center'>
              <input
                type="file"
                name="file"
                onChange={handleFileChange}
                className='flex items-center justify-center pb-10'
              />
              {/* Crop section */}
              {src && (
                <div className='flex flex-col justify-center items-center pb-10'>
                  <ReactCrop
                    src={src}
                    onImageLoaded={onImageLoaded}
                    crop={crop}
                    onChange={handleCropChange}
                  />
                </div>
              )}
              <button className='px-5 bg-sky-800 text-[#fff] rounded-lg text-[20px]' onClick={handleSearchImg}>Search Image</button>
            </div>
          </div>
      </div>

      {/* Body Center (Show data) */}
      <div className="flex flex-row w-full h-fit px-24">
        <table className='w-full table-auto text-left'>
          <thead>
            <tr>
              <th className='py-4'>
                {selectedCategories.studentId && <span>รหัสนศ.</span>}
              </th>
              <th className='py-4 pl-[10px]'>
                {selectedCategories.name && <span>ชื่อ-สกุล</span>}
              </th>
              <th className='py-4'>
                {selectedCategories.age && <span>อายุ</span>}
              </th>
              <th className='py-4'>
                {selectedCategories.mood && <span>อารมณ์</span>}
              </th>
              <th className='py-4'>
                {selectedCategories.datetime && <span>วันเวลา</span>}
              </th>
              <th className='py-4'>
                {selectedCategories.gender && <span>เพศ</span>}
              </th>
              <th className='py-4'>
                {selectedCategories.img && <span>รูป</span>}
              </th>
              <th className='py-4'>
                {selectedCategories.fimg && <span>รูปใหญ่</span>}
              </th>
            </tr>
          </thead>
          <tbody>
            {report.map((data, index) => (
              <tr key={index} className='border-collapse border border-slate-300 h-[32px] bg-white'>
                <td>
                  {selectedCategories.studentId && <span>{data.s_id || "null"}</span>}
                </td>
                <td>
                  {selectedCategories.name && <span>{data.s_name} {data.s_sname || "Stranger"}</span>}
                </td>
                <td>
                  {selectedCategories.age && <span>{calculateAge(data.dateofbirth) || data.age}</span>}
                </td>
                <td>
                  {selectedCategories.mood && <span>{data.mood}</span>}
                </td>
                <td>
                  {selectedCategories.datetime && <span>{data.date}</span>}
                </td>
                <td>
                  {selectedCategories.gender && <span>{data.gender || data.gender}</span>}
                </td>
                <td>
                  {selectedCategories.img && <span>{data.pic_r}</span>}
                </td>
                <td>
                  {selectedCategories.fimg && <span>{data.pic_cam}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Report;
