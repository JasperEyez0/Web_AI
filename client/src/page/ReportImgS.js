import React from 'react';
import { NavLink } from 'react-router-dom'
import { IoIosSearch } from "react-icons/io";
import { IoImage } from "react-icons/io5";
import { GoTriangleLeft, GoTriangleRight } from "react-icons/go";
import { BiSolidFileExport } from "react-icons/bi";

import Axios from 'axios'
import { useState, useEffect, useCallback } from 'react'
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const ReportImgS = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [triangleIcon, setTriangleIcon] = useState(<GoTriangleLeft />);
  const [selectedCount, setSelectedCount] = useState(0);

  const [file, setFile] = useState(null);
  const [src, setSrc] = useState(null);
  const [crop, setCrop] = useState({
    width: 200,
    height: 200,
  });
  const [image, setImage] = useState(null);
  const [output, setOutput] = useState(null);

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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

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

  function base64ToBlob(base64String) {
    const byteCharacters = atob(base64String.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
  
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
  
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'image/jpeg' });
  }

  const handleCropChange = (newCrop) => {
    setCrop(newCrop); // เรียก setCrop เพื่ออัปเดตค่า crop
    cropImageNow();    // เรียก cropImageNow เพื่อทำการ crop ภาพ
  };
  
  return (
    <div className="flex flex-col w-auto h-fit min-h-screen bg-[#E1F7FF]">

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

        {/* Button next to searchbar & Popup*/}
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
      <div className="flex flex-col w-full h-fit my-10 px-24 justify-start">
        <div className="flex pt-10">
            <form className='flex flex-col w-full justify-center items-center'>
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
              <button className='px-5 bg-sky-800 text-[#fff] rounded-lg text-[20px]'>Search Image</button>
            </form>
          </div>
      </div>
    </div>
  );
};

export default ReportImgS;
