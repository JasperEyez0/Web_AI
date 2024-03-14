import cv2
from flask import Flask, Response, render_template
import numpy as np
from deepface import DeepFace
import glob
import json
import datetime
from connecter import update_database_from_json

app = Flask(__name__)
camera = cv2.VideoCapture(0)

camera.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

detectvision = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

count = 0
previous_face_image = None
current_time = datetime.datetime.now()

def detect_face():
    global count
    global previous_face_image
    ret, frame = camera.read()

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = detectvision.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=10, minSize=(30, 30), flags=cv2.CASCADE_SCALE_IMAGE)

    face_image_resized = None

    if len(faces) > 0:
        for i, (x, y, w, h) in enumerate(faces):
            face_image = frame[y:y+h, x:x+w]
            face_image_resized = cv2.resize(face_image, (100, 100))

            if count > 0 and previous_face_image is not None:
                error = mse(previous_face_image, face_image_resized)
                print(f'Mean Squared Error: {error}')
                if error > 110:
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
    result_list = []
    models = ["VGG-Face", "Facenet", "Facenet512", "OpenFace", "DeepFace", "DeepID", "ArcFace", "Dlib", "SFace"]

    face_filename = f'./model/database/face/face_{count}.jpeg'
    cv2.imwrite(face_filename, face_image_resized)

    full_filename = f'./model/database/full/full_{count}.jpeg'
    cv2.imwrite(full_filename, frame)

    # ใช้ glob.glob เพื่อดึงไฟล์ทั้งหมดที่มีนามสกุล .jpeg ในโฟลเดอร์
    imgdb_path = glob.glob("../server/student_folders/*/*.jpeg")

    img_folder_path = "./model/database/face/*.jpeg"
    img_paths = glob.glob(img_folder_path)

    for img_path in img_paths:
        val_ver = []

        for db_img in imgdb_path:
            result = DeepFace.verify(db_img, img_path, model_name=models[0], enforce_detection=False)
            val_ver.append(result["verified"])

        if any(val_ver):
            # Predict emotion
            anaimg = DeepFace.analyze(img_path, enforce_detection=False, actions=("emotion"))
            res = {
                "s_id": db_img,
                "pic_r": img_path,
                "pic_cam": full_filename,
                "date": current_time.strftime("%d/%m/%Y %H:%M:%S"),
                "mood": anaimg[0]["dominant_emotion"]
            }
            # ตรวจสอบว่าข้อมูลซ้ำซ้อนหรือไม่ก่อนที่จะเพิ่มเข้า result_list
            if (f"face_{count}.jpeg", res) not in result_list:
                result_list.append((f"face_{count}.jpeg", res))

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
                result_list.append((img_path, res))

    with open('./model/my_list.json', 'w') as f:
        json.dump(result_list, f, indent=4)
    update_database_from_json()


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

@app.route('/')
def index():
    return render_template("kiosk.html")

@app.route('/Video')
def Video():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
