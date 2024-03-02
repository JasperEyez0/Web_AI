import React from 'react';
import { useNavigate } from 'react-router-dom'
import Validation from '../function/addValidation'

import axios from 'axios'
import { useState } from 'react'

const StudentAdd = () => {

  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    studentId: "",
    birthDate: "",
    gender: "",
    pic: ""
  });

  const [file, setFile] = useState(null);

  const navigate = useNavigate();

  const handleInput = (event) => {        
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = Validation(values);

    if (validationErrors.firstName === "" && validationErrors.lastName === "" && validationErrors.studentId === "" && validationErrors.birthDate === "" && validationErrors.gender === "") {
      // Validation passed, proceed with form submission
      const formData = new FormData();
      formData.append('file', file);
      formData.append('firstName', values.firstName);
      formData.append('lastName', values.lastName);
      formData.append('studentId', values.studentId);
      formData.append('birthDate', values.birthDate);
      formData.append('gender', values.gender);

      axios
        .post('http://localhost:3001/studentadd', formData)
        .then((res) => {
          alert('Add Success');
          navigate('/student');
        })
        .catch((err) => {
          console.error(err);
          alert(err.response.data);
        });
    } else {
      // Validation failed, handle errors (e.g., display error messages)
      console.log("Validation failed:", validationErrors);
      // You can handle the errors as needed, e.g., display error messages to the user
    }
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
        <form onSubmit={handleSubmit} className='felx flex-col m-6 items-center justify-center'>
          <div className="flex flex-row w-full justify-around">
              <input type="text" name='firstName' placeholder="ชื่อ" onChange={handleInput} className='min-w-[100px] max-w-[150px] px-2.5 py-[2px] rounded-lg'/>
              <input type="text" name='lastName' placeholder="สกุล" onChange={handleInput} className='min-w-[100px] max-w-[150px] px-2.5 py-[2px] rounded-lg'/>
              <input type="number" min={0} onKeyPress={(e) => {if (e.target.value.length === 13) {e.preventDefault();}}} name='studentId' placeholder="รหัสนศ." onChange={handleInput} className='min-w-[100px] max-w-[150px] px-2.5 py-[2px] rounded-lg'/>
              <input type="date" name='birthDate' placeholder="วันเกิด" onChange={handleInput} className='min-w-[100px] max-w-[150px] px-2.5 py-[2px] rounded-lg'/>
              <input type="text" name='gender' placeholder="เพศ" onChange={handleInput} className='min-w-[100px] max-w-[150px] px-2.5 py-[2px] rounded-lg'/>
          </div>
          <div className="flex justify-center pt-10">
            <input type="file" name="file" onChange={handleFileChange} className='flex items-center justify-center'/>
          </div>
          <div className="flex m-6 items-center justify-center">
            <button className='px-5 bg-sky-800 text-[#fff] rounded-lg text-[20px]' type="button" onClick={handleSubmit}>Add</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentAdd