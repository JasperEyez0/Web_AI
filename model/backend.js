const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3002; // กำหนดพอร์ต
//const { checkChanges } = require('Send-SV.js'); // ไฟล์ Send-SV.js

const corsOptions = {
  origin: 'http://localhost:3000', // หรือที่ตั้ง React app ของคุณ
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json()); // Middleware for parsing JSON body

// กำหนดเส้นทางที่รูปภาพจะถูกเก็บไว้
const imageFolderPath = 'imgFromServer';

// สร้าง API endpoint สำหรับรับรูปภาพที่เป็น base64
app.post('/sendimg-model', (req, res) => {
  console.log("req: ",req.body)
  const { base64Image, studentId } = req.body;

  // แปลง base64 เป็น buffer
  const imageBuffer = Buffer.from(base64Image, 'base64');

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


// รันเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  // เมื่อเซิร์ฟเวอร์เริ่มต้นขึ้น ให้เรียกใช้ฟังก์ชัน checkChanges()
  //checkChanges();
});
