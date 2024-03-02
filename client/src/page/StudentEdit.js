import React from 'react';
import '../page/StudentEdit.css'; 

import Axios from 'axios'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom';
import moment from 'moment-timezone';

const StudentEdit = () => {

  const { studentId } = useParams();

  const [student, setStudent] = useState({
    s_name: '',
    s_sname: '',
    s_id: studentId,
    dateofbirth: '',
    gender: '',
    pic: '',
  });

  const fetchSData = useCallback(() => {
    if (studentId) {
      Axios.get(`http://localhost:3001/student/${studentId}`)
        .then((res) => {
          setStudent((prevStudent) => ({
            ...prevStudent,
            ...res.data,
          }));
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [studentId]);

  useEffect(() => {
    fetchSData();
  }, [fetchSData, studentId]);

  const handleUpdate = () => {
    Axios.put(`http://localhost:3001/student/${studentId}`, student)
      .then((res) => {
        console.log('Student updated successfully:', res.data);
        // You may want to redirect the user or perform other actions upon successful update
      })
      .catch((err) => {
        console.log('Error updating student:', err);
      });
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
            value={student.s_name || ""}
            onChange={(e) => setStudent({ ...student, s_name: e.target.value })}
          />

            <input
              type="text"
              placeholder="สกุล"
              className='min-w-[100px] max-w-[150px] px-2.5 py-[2px] rounded-lg'
              value={student.s_sname || ""}
              onChange={(e) => setStudent({ ...student, s_sname: e.target.value })}
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
              value={student.s_id || ""}
              onChange={(e) => setStudent({ ...student, s_id: e.target.value })}
            />

            <input
              type="date"
              placeholder="วันเกิด"
              className='min-w-[100px] max-w-[150px] px-2.5 py-[2px] rounded-lg'
              value={moment(student.dateofbirth).format('YYYY-MM-DD') || ""}
              onChange={(e) => setStudent({ ...student, dateofbirth: e.target.value })}
            />

            <input
              type="text"
              placeholder="เพศ"
              className='min-w-[100px] max-w-[150px] px-2.5 py-[2px] rounded-lg'
              value={student.gender || ""}
              onChange={(e) => setStudent({ ...student, gender: e.target.value })}
            />
          </div>
          <div className="flex justify-center pt-10">
            <input type="file" name="file" className='flex items-center justify-center'/>
          </div>
        </form>
        <div className="flex m-6 items-center justify-center">
          <button className='px-5 bg-sky-800 text-[#fff] rounded-lg text-[20px]'  onClick={handleUpdate}>Edit</button>
        </div>
      </div>
    </div>
  );
}

export default StudentEdit