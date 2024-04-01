import cv2
from flask import Flask, render_template, Response
import numpy as np
from deepface import DeepFace
import glob
import json
import datetime
import os
import pyttsx3
import requests

app = Flask(__name__)
camera = cv2.VideoCapture(0)

camera.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

detectvision = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

count = 0
previous_face_image = None
getsay = None
with open('./model/my_list.json', 'w') as f:
    f.write('')

def detect_face():
    global count
    global previous_face_image
    ret, frame = camera.read()

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = detectvision.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=10, minSize=(200, 200), flags=cv2.CASCADE_SCALE_IMAGE)

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
                    count += 1
            else:
                predict_and_save(face_image_resized, frame)
                count += 1
            print(count)

    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y-20), (x+w, y+h+40), (255, 0, 255), 2)

    previous_face_image = face_image_resized
    return cv2.imencode('.jpeg', frame)[1].tobytes()


def predict_and_save(face_image_resized, frame):
    global previous_face_image
    global getsay
    result_list = []
    models = ["VGG-Face", "Facenet", "Facenet512", "OpenFace", "DeepFace", "DeepID", "ArcFace", "Dlib", "SFace"]
    current_time = datetime.datetime.now()
    
    face_filename = f'./model/static/picdata/face/face_{count}.jpeg'
    cv2.imwrite(face_filename, face_image_resized)

    full_filename = f'./model/static/picdata/full/full_{count}.jpeg'
    cv2.imwrite(full_filename, frame)

    # ใช้ glob.glob เพื่อดึงไฟล์ทั้งหมดที่มีนามสกุล .jpeg ในโฟลเดอร์
    imgdb_path = glob.glob("./model/imgFromServer/**/*.jpeg", recursive=True)
    
    img_folder_path = "./model/static/picdata/face/*.jpeg"
    img_paths = glob.glob(img_folder_path)
    sortedimg_paths = sorted(img_paths, key=lambda x: int(x.split('_')[-1].split('.')[0]))
    print(sortedimg_paths)
    
    if sortedimg_paths:
        img_path = sortedimg_paths[-1]  # เลือกภาพสุดท้ายจากลิสต์ของภาพ
        val_ver = 0
        print(img_path)
        for db_img in imgdb_path:
            s_id = os.path.basename(os.path.dirname(db_img))
            result = DeepFace.verify(db_img, img_path, model_name=models[0], enforce_detection=False)
            if result["verified"]:
                val_ver = 1
                break

        if (val_ver > 0):
            # Predict emotion
            anaimg = DeepFace.analyze(img_path, enforce_detection=False, actions=("emotion", "age", "gender"))
            res = {
                "s_id": s_id,
                "pic_r": img_path,
                "pic_cam": full_filename,
                "date": current_time.strftime("%d/%m/%Y %H:%M:%S"),
                "mood": anaimg[0]["dominant_emotion"],
                "age": anaimg[0]["age"],
                "gender": anaimg[0]["dominant_gender"]
            }
            # ตรวจสอบว่าข้อมูลซ้ำซ้อนหรือไม่ก่อนที่จะเพิ่มเข้า result_list
            if (f"face_{count}.jpeg", res) not in result_list:
                result_list.append((f"face_{count}.jpeg", res))
                send_result_list(result_list)
                
        else:
            # Predict emotion, age, and gender
            anaimg = DeepFace.analyze(img_path, enforce_detection=False, actions=("emotion", "age", "gender"))
            res = {
                "s_id": "stranger",
                "pic_r": img_path,
                "pic_cam": full_filename,
                "date": current_time.strftime("%d/%m/%Y %H:%M:%S"),
                "mood": anaimg[0]["dominant_emotion"],
                "age": anaimg[0]["age"],
                "gender": anaimg[0]["dominant_gender"]
            }
            # ตรวจสอบว่าข้อมูลซ้ำซ้อนหรือไม่ก่อนที่จะเพิ่มเข้า result_list
            if (f"face_{count}.jpeg", res) not in result_list:
                result_list.append((f"face_{count}.jpeg", res))
                send_result_list(result_list)
        
    # เรียกใช้ฟังก์ชันเพื่อรับค่า setname และ setgreet
    getsay = get_greet()
    print("getsay HERE!!", getsay)
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
    url = 'http://localhost:3001/get-report-fromdb'  # URL ของเซิร์ฟเวอร์ Express.js
    headers = {'Content-Type': 'application/json'}
    response = requests.get(url, headers=headers)
    print(response.text)
    return response.text


# ฟังก์ชันสำหรับเชื่อมต่อฐานข้อมูลและดึงข้อมูล
def get_greet():
    url = 'http://localhost:3002/get-greet'  # URL ของเซิร์ฟเวอร์ Express.js
    headers = {'Content-Type': 'application/json'}
    response = requests.get(url, headers=headers)
    print(response.text)
    return response.text


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

def send_result_list(result_list):
    url = 'http://localhost:3002/send-result-list'  # URL ของเซิร์ฟเวอร์ Express.js
    headers = {'Content-Type': 'application/json'}
    data = json.dumps({'result_list': result_list})
    
    response = requests.post(url, data=data, headers=headers)
    
    if response.status_code == 200:
        print('Result list sent successfully')
    else:
        print('Failed to send result list')

@app.route('/')
def index():
    # ดึงข้อมูลจากฐานข้อมูล
    data_string = get_data_from_database()
    # แปลงสตริง JSON เป็นโครงสร้างข้อมูล Python
    data = json.loads(data_string)
    print("data : ",data)
    # ส่งข้อมูลไปยัง HTML template
    return render_template("kiosk.html", data=data)

@app.route('/Video')
def Video():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)