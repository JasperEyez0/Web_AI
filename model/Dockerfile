# เลือกภาพที่มี Python เป็นฐาน
FROM python:latest

# ระบุไดเร็กทอรีที่เก็บโค้ดของ model
WORKDIR /usr/src/app

# คัดลอกไฟล์ requirements.txt และติดตั้ง dependencies
RUN pip install --no-cache-dir --upgrade setuptools
RUN pip install --no-cache-dir numpy==1.26.4
RUN apt-get update && apt-get install -y libgl1-mesa-glx libgl1 libglu1-mesa
RUN pip install Flask
RUN pip install deepface
RUN pip install mysql-connector-python
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# คัดลอกโค้ดของ model ไปยัง Docker image
COPY . .

# กำหนดคำสั่งที่จะใช้เมื่อเริ่มต้น container
CMD ["python", "camera.py", "connecter.py"]
