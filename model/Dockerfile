# เลือกภาพที่มี Python เป็นฐาน
FROM python:3.10.11

# ระบุไดเร็กทอรีที่เก็บโค้ดของ model
WORKDIR /usr/src/app

# คัดลอกไฟล์ requirements.txt และติดตั้ง dependencies


RUN pip install --no-cache-dir --upgrade setuptools
RUN pip install --no-cache-dir numpy==1.26.4
RUN pip install --no-cache-dir tensorflow==2.16.1
RUN pip install Deepface
RUN pip install Flask
RUN pip install mysql-connector-python
RUN pip install pyttsx3
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN apt-get update && apt-get install --fix-missing -y libgl1-mesa-glx
# คัดลอกโค้ดของ model ไปยัง Docker image
COPY . .

EXPOSE 4000

# กำหนดคำสั่งที่จะใช้เมื่อเริ่มต้น container
CMD ["python", "camera.py"]
