import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Validation from '../function/addValidation';
import axios from 'axios';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const StudentAdd = () => {

  //const token = localStorage.getItem('token');
  //console.log(token)

  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    studentId: '',
    birthDate: '',
    gender: '',
    pic: '',
  });

  const [file, setFile] = useState(null);
  const [src, setSrc] = useState(null);
  const [crop, setCrop] = useState({
    width: 200,
    height: 200,
  });
  const [image, setImage] = useState(null);
  const [output, setOutput] = useState(null);

  const navigate = useNavigate();

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
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
    setCrop({ aspect: 16 / 9, width: 100, height: 100 });
  }, []);

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

  const handleSubmit = (event) => {
    event.preventDefault();
  
    const validationErrors = Validation(values);
  
    if (
      validationErrors.firstName === '' &&
      validationErrors.lastName === '' &&
      validationErrors.studentId === '' &&
      validationErrors.birthDate === '' &&
      validationErrors.gender === ''
    ) {
      // Validation passed, proceed with form submission
      const formData = new FormData();
  
      // If there is an output (cropped image), use it instead of the original file
      if (output) {
        const blob = base64ToBlob(output);
        formData.append('file', blob, 'cropped_image.jpeg');
      } else {
        formData.append('file', file);
      }
  
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
          if (err.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error(err.response.data);
            console.error(err.response.status);
            console.error(err.response.headers);
          } else if (err.request) {
            // The request was made but no response was received
            console.error(err.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error', err.message);
          }
          alert('Add Failed. Check console for details.');
        });
    } else {
      // Validation failed, handle errors (e.g., display error messages)
      console.log('Validation failed:', validationErrors);
      // You can handle the errors as needed, e.g., display error messages to the user
    }
  };

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
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="flex items-center justify-center pb-10"
            />
          </div>
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
          <div className="flex m-6 items-center justify-center">
            <button className='px-5 bg-sky-800 text-[#fff] rounded-lg text-[20px]' type="button" onClick={handleSubmit}>Add</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentAdd