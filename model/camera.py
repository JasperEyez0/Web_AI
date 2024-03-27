import cv2
from flask import Flask, render_template, Response
import numpy as np
from deepface import DeepFace
import glob
import json
import datetime
from connecter import update_database_from_json
from get_greet import get_greet
import os
import mysql.connector
import pyttsx3

app = Flask(__name__)
camera = cv2.VideoCapture(0)

camera.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

detectvision = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

count = 0
previous_face_image = None

conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="ai_project"
    )
getsay = None
with open('./model/my_list.json', 'w') as f:
    f.write('')

def detect_face():
    global count
    global previous_face_image
    ret, frame = camera.read()

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = detectvision.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=10, minSize=(300, 300), flags=cv2.CASCADE_SCALE_IMAGE)

    face_image_resized = None

    if len(faces) > 0:
        for i, (x, y, w, h) in enumerate(faces):
            face_image = frame[y:y+h, x:x+w]
            face_image_resized = cv2.resize(face_image, (100, 100))

            if count > 0 and previous_face_image is not None:
                error = mse(previous_face_image, face_image_resized)
                print(f'Mean Squared Error: {error}')
                if error > 120:
                    predict_and_save(face_image_resized, frame)
            else:
                predict_and_save(face_image_resized, frame)
            print(count)

    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y-20), (x+w, y+h+40), (255, 0, 255), 2)

    count += 1
    previous_face_image = face_image_resized
    return cv2.imencode('.jpeg', frame)[1].tobytes()


def predict_and_save(face_image_resized, frame):
    global count
    global previous_face_image
    global getsay
    result_list = []
    models = ["VGG-Face", "Facenet", "Facenet512", "OpenFace", "DeepFace", "DeepID", "ArcFace", "Dlib", "SFace"]

    current_time = datetime.datetime.now()

    face_filename = f'./model/database/face/face_{count}.jpeg'
    cv2.imwrite(face_filename, face_image_resized)

    full_filename = f'./model/database/full/full_{count}.jpeg'
    cv2.imwrite(full_filename, frame)

    # ใช้ glob.glob เพื่อดึงไฟล์ทั้งหมดที่มีนามสกุล .jpeg ในโฟลเดอร์
    imgdb_path = glob.glob("./server/student_folders/**/*.jpeg", recursive=True)

    img_folder_path = "./model/database/face/*.jpeg"
    img_paths = glob.glob(img_folder_path)
    sorted_img_paths = sorted(img_paths, key=lambda x: int(x.split('_')[-1].split('.')[0])) #เรียงเลขจากชื่อไฟล์
    #print(img_paths)
    print(sorted_img_paths)
    if sorted_img_paths:
        img_path = sorted_img_paths[-1]  # เลือกภาพสุดท้ายจากลิสต์ของภาพ
        print(img_path)
        val_ver = []

        for db_img in imgdb_path:
            result = DeepFace.verify(db_img, img_path, model_name=models[0], enforce_detection=False)
            val_ver.append(result["verified"])
            print(val_ver)

        if any(val_ver):

            s_id = os.path.basename(os.path.dirname(db_img))

            # Predict emotion
            anaimg = DeepFace.analyze(img_path, enforce_detection=False, actions=("emotion", "age", "gender"))
            res = {
                "s_id": s_id,
                "pic_r": face_filename,
                "pic_cam": full_filename,
                "date": current_time.strftime("%d/%m/%Y %H:%M:%S"),
                "mood": anaimg[0]["dominant_emotion"],
                "age": anaimg[0]["age"],
                "gender": anaimg[0]["dominant_gender"]
            }
            # ตรวจสอบว่าข้อมูลซ้ำซ้อนหรือไม่ก่อนที่จะเพิ่มเข้า result_list
            if (f"face_{count}.jpeg", res) not in result_list:
                result_list.append((face_filename, res))

        else:
            # Predict emotion, age, and gender
            anaimg = DeepFace.analyze(img_path, enforce_detection=False, actions=("emotion", "age", "gender"))
            res = {
                "s_id": "stranger",
                "pic_r": face_filename,
                "pic_cam": full_filename,
                "date": current_time.strftime("%d/%m/%Y %H:%M:%S"),
                "mood": anaimg[0]["dominant_emotion"],
                "age": anaimg[0]["age"],
                "gender": anaimg[0]["dominant_gender"]
            }
            # ตรวจสอบว่าข้อมูลซ้ำซ้อนหรือไม่ก่อนที่จะเพิ่มเข้า result_list
            if (f"face_{count}.jpeg", res) not in result_list:
                result_list.append((img_path, res))

    # ตรวจสอบขนาดของไฟล์ JSON
    file_size = os.path.getsize('./model/my_list.json')
    
    # ตรวจสอบว่าไฟล์ว่างเปล่าหรือไม่
    if file_size == 0:
        with open('./model/my_list.json', 'w') as f:
            json.dump(result_list, f, indent=4)
    else:
        # อ่านข้อมูล JSON ที่มีอยู่ในไฟล์
        with open('./model/my_list.json') as file:
            existing_data = json.load(file)

        # เพิ่มข้อมูลใหม่ลงในลิสต์ของ JSON
        existing_data.append(result_list)

        # เขียนข้อมูล JSON ทั้งหมดลงในไฟล์
        with open('./model/my_list.json', 'w') as file:
            json.dump(existing_data, file, indent=4)
        
    # เรียกใช้ฟังก์ชันเพื่อรับค่า setname และ setgreet
    update_database_from_json()
    getsay = get_greet()
    sayhi()

def mse(image1, image2):
    if image1 is None or image2 is None:
        return 0  

    diff = cv2.subtract(image1, image2)
    err = np.sum(diff**2)
    mse = err / (float(100 * 100))
    return mse

def generate_frames():
    while True:
        frame_bytes = detect_face()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n\r\n')
        

# ฟังก์ชันสำหรับเชื่อมต่อฐานข้อมูลและดึงข้อมูล
def get_data_from_database():
    select_users = "SELECT s_id, pic_r, mood, age, gender FROM report"
    cursor = conn.cursor()
    cursor.execute(select_users)
    result = cursor.fetchall()

    filtered_result = [row for row in result if row[2]]  # กรองข้อมูลเฉพาะที่ val_ver เป็น True

    return filtered_result

def sayhi():
    engine = pyttsx3.init()
    TH_voice_id = "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Speech\Voices\Tokens\TTS_THAI"
    engine.setProperty('volume', 0.9)  # Volume 0-1
    engine.setProperty('rate', 120)  #148
    engine.setProperty('voice', TH_voice_id)

    if getsay is not None:
        engine.say(getsay)
        engine.runAndWait()
    else:
        #print("setname is None")
        pass

@app.route('/')
def index():
    # ดึงข้อมูลจากฐานข้อมูล
    data = get_data_from_database()
    # ส่งข้อมูลไปยัง HTML template
    return render_template("kiosk.html", data=data)

@app.route('/Video')
def Video():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
    