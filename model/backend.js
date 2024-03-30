const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 3002; // กำหนดพอร์ต

const corsOptions = {
  origin: 'http://localhost:3000', // หรือที่ตั้ง React app ของคุณ
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json()); // Middleware for parsing JSON body

// กำหนดเส้นทางที่รูปภาพจะถูกเก็บไว้
const imageFolderPath = 'imgFromServer';

// สร้าง API endpoint สำหรับรับรูปภาพที่เป็น base64
app.post('/sendimg-model', (req, res) => {
  //console.log("req: ",req.body.base64Image)
  const { base64Image, studentId } = req.body;

  // แปลง base64 เป็น buffer
  let imageBuffer;
  try {
    // แยกส่วนของข้อมูล header และ data
    const base64Data = base64Image.split(',')[1];
    // แปลง base64 เป็น buffer
    imageBuffer = Buffer.from(base64Data, 'base64');
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Invalid base64 string' });
  }
  
  // สร้างชื่อไฟล์สำหรับรูปภาพโดยใช้ studentId พร้อมกับ date
  const imageName = `${studentId}_${Date.now()}.jpeg`;

  // กำหนด path สำหรับบันทึกไฟล์
  const studentFolderPath = path.join(imageFolderPath, studentId);
  const filePath = path.join(studentFolderPath, imageName);

  // เช็คว่าโฟลเดอร์ชื่อ studentId มีอยู่หรือไม่
  if (!fs.existsSync(studentFolderPath)) {
    // ถ้าไม่มี ให้สร้างโฟลเดอร์ชื่อ studentId
    fs.mkdirSync(studentFolderPath, { recursive: true });
  }

  // เขียน buffer เป็นไฟล์รูปภาพ
  fs.writeFile(filePath, imageBuffer, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to save image' });
    }

    // ส่ง response กลับไปพร้อมกับ path ของไฟล์ที่บันทึก
    return res.status(200).json({ message: 'Image uploaded successfully', filePath });
  });

});


const faceImagePath = 'picdata/face'; // กำหนด path ของโฟลเดอร์ face
const fullImagePath = 'picdata/full'; // กำหนด path ของโฟลเดอร์ full

// ส่ง API ไปยังเซิร์ฟเวอร์พร้อมกับข้อมูลรูปภาพ
function sendImageData(imageData, imageType, filename) {
  // ส่ง API request ไปยังเซิร์ฟเวอร์อีกตัว
  axios.post('http://localhost:3001/sendimg-server', { imageData, imageType, filename })
    .then((response) => {
      console.log('API request sent successfully:', response.data);
    })
    .catch((error) => {
      console.error('Error sending API request:', error);
    });
}

// ฟังก์ชันสำหรับตรวจสอบการเปลี่ยนแปลงในโฟลเดอร์ face
function watchFaceFolder() {
  fs.watch(faceImagePath, { recursive: true }, (eventType, filename) => {
    console.log(`File ${filename} in face folder has been ${eventType}`);

    // ตรวจสอบว่าเป็นการสร้างไฟล์ใหม่หรือไม่
    if (eventType === 'rename') {
      const filePath = path.join(faceImagePath, filename);
      const imageData = fs.readFileSync(filePath, { encoding: 'base64' });
      sendImageData(imageData, 'face', filename);
    }
  });
}

// ฟังก์ชันสำหรับตรวจสอบการเปลี่ยนแปลงในโฟลเดอร์ full
function watchFullFolder() {
  fs.watch(fullImagePath, { recursive: true }, (eventType, filename) => {
    console.log(`File ${filename} in full folder has been ${eventType}`);

    // ตรวจสอบว่าเป็นการสร้างไฟล์ใหม่หรือไม่
    if (eventType === 'rename') {
      const filePath = path.join(fullImagePath, filename);
      const imageData = fs.readFileSync(filePath, { encoding: 'base64' });
      sendImageData(imageData, 'full', filename);
    }
  });
}

// รันฟังก์ชันสำหรับตรวจสอบการเปลี่ยนแปลงในโฟลเดอร์ face และ full
function startWatchingFolders() {
  watchFaceFolder();
  watchFullFolder();
}

// รันเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  startWatchingFolders();
});