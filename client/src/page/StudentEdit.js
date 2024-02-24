import React from 'react';
import '../page/StudentEdit.css'; 

import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

import Axios from 'axios'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';

const StudentEdit = () => {

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const studentId = queryParams.get('studentId');
  console.log(studentId)
  const [sList, setsList] = useState({
    firstName: "",
    lastName: "",
    studentId: "",
    birthDate: "",
    gender: "",
    pic: ""
  });

  /*จะเรียกใช้เมื่อมีค่าจริงๆ ไม่ใช่ null หรือ undifined*/
  useEffect(() => {
    if (studentId) {
      fetchStudentById(studentId);
    }
  }, [studentId]);

  const fetchStudentById = (id) => {
    console.log("Fetching data for studentId:", id);
  
    Axios.get(`http://localhost:3001/studentedit?studentId=${id}`)
      .then((res) => {
        setsList(res.data);
        console.log("Data received:", res.data);
        console.log(sList.s_id)
      })
      .catch((err) => {
        console.log("Error fetching data:", err);
      });
  };

  useEffect(() => {
    console.log("check sList:", sList);
  }, [sList]);

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
        return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none',
      }}
      type="button"
    >
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };
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
          <input
            type="text"
            placeholder="ชื่อ"
            className='min-w-[100px] max-w-[150px] px-2.5 py-[2px] rounded-lg'
            value={sList.s_name}
            onChange={(e) => setsList({ ...sList, s_name: e.target.value })}
          />

            <input
              type="text"
              placeholder="สกุล"
              className='min-w-[100px] max-w-[150px] px-2.5 py-[2px] rounded-lg'
              value={sList.s_sname}
              onChange={(e) => setsList({ ...sList, s_sname: e.target.value })}
            />

            <input
              type="number"
              min={0}
              onKeyPress={(e) => {
                if (e.target.value.length === 13) {
                  e.preventDefault();
                }
              }}
              placeholder="รหัสนศ."
              id='idnum'
              className='min-w-[100px] max-w-[150px] px-2.5 py-[2px] rounded-lg'
              value={sList.s_id}
              onChange={(e) => setsList({ ...sList, s_id: e.target.value })}
            />

            <input
              type="date"
              placeholder="วันเกิด"
              className='min-w-[100px] max-w-[150px] px-2.5 py-[2px] rounded-lg'
              value={sList.dateofbirth}
              onChange={(e) => setsList({ ...sList, dateofbirth: e.target.value })}
            />

            <input
              type="text"
              placeholder="เพศ"
              className='min-w-[100px] max-w-[150px] px-2.5 py-[2px] rounded-lg'
              value={sList.gender}
              onChange={(e) => setsList({ ...sList, gender: e.target.value })}
            />
          </div>
          <div className="text-center justify-center pt-10">
            <Upload 
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
              beforeUpload={beforeUpload}
              onChange={handleChange}
              id='Upload-box'
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="avatar"
                  style={{width: '100%',}}/>)
                : (uploadButton)}
            </Upload>
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