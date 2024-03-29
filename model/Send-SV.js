const fs = require('fs');
const axios = require('axios');

// กำหนดเส้นทางไฟล์หรือโฟลเดอร์ที่ต้องการตรวจสอบ
const folderPath = 'picdata';

// ฟังก์ชันสำหรับตรวจสอบการเปลี่ยนแปลงในโฟลเดอร์
function checkChanges() {
    fs.watch(folderPath, { recursive: true }, (eventType, filename) => {
        console.log(`File ${filename} has been ${eventType}`);

        // ตรวจสอบว่าเป็นการสร้างไฟล์ใหม่หรือไม่
        if (eventType === 'rename') {
            // อ่านเนื้อหาของไฟล์ที่เปลี่ยนแปลง
            fs.readFile(filename, (err, data) => {
                if (err) {
                    console.error('Error reading file:', err);
                    return;
                }

                // ส่งไฟล์ไปยังเซิร์ฟเวอร์
                sendApiRequest(data);
            });
        }
    });
}

// ฟังก์ชันสำหรับส่ง API ไปยังเซิร์ฟเวอร์พร้อมส่งข้อมูลรูปภาพ
function sendApiRequest(imageData) {
    // ส่ง API ไปยังเซิร์ฟเวอร์พร้อมกับข้อมูลรูปภาพ
    axios.post('http://localhost:3001/sendimg-server', { imageData })
        .then((response) => {
            console.log('API request sent successfully:', response.data);
        })
        .catch((error) => {
            console.error('Error sending API request:', error);
        });
}