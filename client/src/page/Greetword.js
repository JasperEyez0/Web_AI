import React from 'react'

import Axios from 'axios'
import { useState, useEffect, useCallback } from 'react';
import { RiDeleteBin5Fill } from "react-icons/ri";

function Greetword () {

  //const token = localStorage.getItem('token');
  //console.log(token)

  const [greetData, setGreetData] = useState([]);
  const [newGreet, setNewGreet] = useState({ greeting: '', g_category: ''});

  // ประกาศ fetchData โดยใช้ useCallback เพื่อป้องกันการสร้างฟังก์ชันใหม่ในทุก render
  const fetchData = useCallback(async () => {
    try {
      // ดึงข้อมูลจาก API endpoint
      const response = await Axios.get('http://localhost:3001/greetword');
      setGreetData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    // เรียกใช้ fetchData เมื่อ component ถูกโหลด
    fetchData();
  }, [fetchData]);

  const handleAddGreet = async () => {
    try {
      // ส่ง request ไปยัง API endpoint เพื่อเพิ่มข้อมูล
      await Axios.post('http://localhost:3001/greetword', {
        greeting: newGreet.greeting,
        g_category: newGreet.g_category
      });
  
      // หลังจากเพิ่มข้อมูลเสร็จ, เรียกใช้ fetchData เพื่อดึงข้อมูลทั้งหมดใหม่
      fetchData();
  
      // ล้างข้อมูลใน input fields
      setNewGreet({ greeting: '', g_category:'' });
    } catch (error) {
      console.error('Error adding data:', error);
  
      // เพิ่ม console log เพื่อดู response ที่ได้มาจาก server
      if (error.response) {
        console.error('Server response:', error.response.data);
      }
    }
  };

  const handleDeleteGreet = (greetGreeting) => {
    // ส่ง request ไปยัง API endpoint เพื่อลบข้อมูล
    Axios.delete(`http://localhost:3001/greetword/${greetGreeting}`)
      .then((res) => {
        console.log('Data deleted successfully:', res.data);
        // หลังจากลบข้อมูลเสร็จ, เรียกใช้ fetchData เพื่อดึงข้อมูลทั้งหมดใหม่
        fetchData();
      })
      .catch((err) => {
        console.error('Error deleting data:', err);
      });
  };

  const getCategoryText = (value) => {
    switch (value) {
      case 0:
        return 'neutral';
      case 1:
        return 'happy';
      case 2:
        return 'surprise';
      case 3:
        return 'fear';
      case 4:
        return 'sad';
      case 5:
        return 'disgust';
      case 6:
        return 'angry';
      default:
        return ''; // หากไม่ตรงกับค่าใดๆ
    }
  };

  return (
    <div className="flex flex-col w-auto h-screen bg-[#E1F7FF]">
      <div className="flex flex-col w-full">
        <div className='flex flex-row w-full h-fit mt-10 mb-2 px-24 justify-evenly items-center'>
          <p className='w-[600px] px-2.5 py-[2px]'>คำทักทาย</p>
          <p className='w-[200px] px-2.5 py-[2px]'>หมวดหมู่</p>
          <p className='w-[60px]'></p>
        </div>
        <form
          className="flex flex-row w-full h-fit px-24 justify-evenly items-center"
          onSubmit={(e) => {
            e.preventDefault();
            handleAddGreet();
          }}
        >
          <input
            type="text"
            placeholder="คำทักทาย"
            className="w-[600px] px-2.5 py-[2px] rounded"
            value={newGreet.greeting}
            onChange={(e) => setNewGreet({ ...newGreet, greeting: e.target.value })}
          />
          <select
            className="w-[200px] px-2.5 py-[2px] rounded"
            name="g_category"
            value={newGreet.g_category}
            onChange={(e) => setNewGreet({ ...newGreet, g_category: e.target.value })}
          >
            <option value="0">neutral</option>
            <option value="1">happy</option>
            <option value="2">surprise</option>
            <option value="3">fear</option>
            <option value="4">sad</option>
            <option value="5">disgust</option>
            <option value="6">angry</option>
          </select>
          <button type="submit" className="w-[60px] py-[2px] rounded bg-sky-800 text-white">
            Add
          </button>
        </form>
      </div>
      <div className="flex flex-row w-full h-fit px-24 justify-evenly">
        <table className="min-w-[1200px] table-auto text-left">
          <thead>
            <tr>
              <th className="py-4">คำทักทาย</th>
              <th className="py-4">ความรู้สึก</th>
              <th className="py-4"> </th>
            </tr>
          </thead>
          <tbody>
            {greetData.map((item) => (
              <tr key={item.id}  className='border-collapse border border-slate-300 h-[32px] bg-white'>
                <td className="pl-[10px]">{item.greeting}</td>
                <td>{getCategoryText(item.g_category)}</td>
                <td className='flex justify-center'>
                  <button
                    onClick={() => handleDeleteGreet(item.greeting)}
                    className='p-2 bg-red-400 text-[#000] rounded-xl text-[18px]'
                  >
                    <RiDeleteBin5Fill />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Greetword