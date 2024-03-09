import cv2
from flask import Flask, Response, render_template
import numpy as np

app = Flask(__name__)
camera = cv2.VideoCapture(0)

camera.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

detectvision = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

valid = 0
previous_face_image = None

def detect_face():
    global valid
    global previous_face_image
    ret, frame = camera.read()
    cv2.imwrite('./database/Guests.jpeg', frame)

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)  # เพิ่มบรรทัดนี้เพื่อแปลงเป็นภาพระดับสีเทา
    faces = detectvision.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=5, minSize=(30, 30), flags=cv2.CASCADE_SCALE_IMAGE)

    # Initialize face_image
    face_image_resized = None

    if len(faces) > 0:
        # Save each face as a separate JPEG file
        for i, (x, y, w, h) in enumerate(faces):
            face_image = frame[y:y+h, x:x+w]
            # Resize face_image to a fixed size for comparison
            face_image_resized = cv2.resize(face_image, (100, 100))

            if valid > 0 and previous_face_image is not None:
                # Compare resized face_{valid}.jpeg with resized face_{valid-1}.jpeg
                error = mse(previous_face_image, face_image_resized)
                print(f'Mean Squared Error: {error}')
                if error > 110:
                    face_filename = f'./database/face_{valid}.jpeg'
                    cv2.imwrite(face_filename, face_image_resized)
            print(valid)

    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y-20), (x+w, y+h+40), (255, 0, 255), 2)

    valid += 1
    previous_face_image = face_image_resized
    return cv2.imencode('.jpeg', frame)[1].tobytes()

def mse(image1, image2):
    if image1 is None or image2 is None:
        return 0  # or handle the case when one of the images is None

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