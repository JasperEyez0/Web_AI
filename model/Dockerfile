# เลือกภาพที่มี Python เป็นฐาน
FROM python:latest

# ระบุไดเร็กทอรีที่เก็บโค้ดของ model
WORKDIR /app

# คัดลอกไฟล์ requirements.txt เพื่อติดตั้ง dependencies
COPY requirements.txt ./

# ติดตั้ง dependencies โดยใช้ pip
COPY . .

# คัดลอกโค้ดของ model ไปยัง Docker image
COPY . .

# กำหนดคำสั่งที่จะใช้เมื่อเริ่มต้น container
CMD ["python", "your_model_script.py"]
