import React from 'react';
import { NavLink } from 'react-router-dom'
import {useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { IoIosSearch } from "react-icons/io";
import { TiUserAdd } from "react-icons/ti";
import { FaUserEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import '../page/StudentAdd.css'; 

import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

import Axios from 'axios'
import { useState, useEffect } from 'react'

const StudentAdd = () => {

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
                <p className='min-w-[150px] px-2.5 py-[2px]'>เพศ</p>
            </div>
            <form action="" className='felx flex-col m-6 items-center justify-center '>
              <div className="flex flex-row w-full justify-around">
                  <input type="text" placeholder="ชื่อ" className='min-w-[100px] max-w-[150px] px-2.5 py-[2px] rounded-lg'/>
                  <input type="text" placeholder="สกุล" className='min-w-[100px] max-w-[150px] px-2.5 py-[2px] rounded-lg'/>
                  <input type="text" placeholder="รหัสนศ." className='min-w-[100px] max-w-[150px] px-2.5 py-[2px] rounded-lg'/>
                  <input type="text" placeholder="วันเกิด" className='min-w-[100px] max-w-[150px] px-2.5 py-[2px] rounded-lg'/>
                  <input type="text" placeholder="เพศ" className='min-w-[100px] max-w-[150px] px-2.5 py-[2px] rounded-lg'/>
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
              <button className='px-5 bg-sky-800 text-[#fff] rounded-lg text-[20px]'>Add</button>
            </div>
          </div>
        </div>
    );
}

export default StudentAdd