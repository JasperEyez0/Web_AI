import React from 'react';
import '../page/StudentEdit.css'; 

import Axios from 'axios'
import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment-timezone';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const StudentEdit = () => {

  //const token = localStorage.getItem('token');
  //console.log(token)

  const { studentId } = useParams();
  const [file, setFile] = useState(null);
  const [src, setSrc] = useState(null);
  const [crop, setCrop] = useState();
  const [image, setImage] = useState(null);
  const [output, setOutput] = useState(null);
  const navigate = useNavigate();

  const [student, setStudent] = useState({
    s_name: '',
    s_sname: '',
    s_id: studentId,
    dateofbirth: '',
    gender: '',
  });
  
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
        alert('Edit Success');
        navigate('/student');
      })
      .catch((err) => {
        console.log('Error updating student:', err);
      });
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

  const handleAddImg = () => {
    const formData = new FormData();

    if (output) {
        const blob = base64ToBlob(output);
        formData.append('file', blob, 'cropped_image_edit.jpeg');
    } else {
        formData.append('file', file);
    }

    Axios.post(`http://localhost:3001/studentadd/${studentId}`, formData)
        .then((res) => {
            console.log('Image added successfully:', res.data);
        })
        .catch((err) => {
            console.log('Error adding image:', err);
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
          <div className="flex m-6 items-center justify-center">
            <button className='px-5 bg-sky-800 text-[#fff] rounded-lg text-[20px]'  onClick={handleUpdate}>Edit</button>
          </div>
        </form>
        <div className="flex justify-center pt-10">
          <form>
            <input
              type="file"
              name="file"
              onChange={handleFileChange}
              className='flex items-center justify-center'
            />
            {/* Crop section */}
            {src && (
              <div className='flex flex-col justify-center items-center'>
                <ReactCrop
                  src={src}
                  onImageLoaded={onImageLoaded}
                  crop={crop}
                  onChange={handleCropChange}
                />
              </div>
            )}
            <button className='px-5 bg-sky-800 text-[#fff] rounded-lg text-[20px]' onClick={handleAddImg}>Add Image</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StudentEdit