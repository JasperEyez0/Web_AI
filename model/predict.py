from deepface import DeepFace
import glob

# ตัวแปรเก็บรายการรูปภาพที่เคยถูกประมวลผล
processed_images = set()

def loopimg():
    models = ["VGG-Face", "Facenet", "Facenet512", "OpenFace", "DeepFace", "DeepID", "ArcFace", "Dlib", "SFace"]

    # ใช้ glob.glob เพื่อดึงไฟล์ทั้งหมดที่มีนามสกุล .jpeg ในโฟลเดอร์ ./database/Self (database)
    imgdb_path = glob.glob("./database/Self/*.jpeg")

    # ใช้ glob.glob เพื่อดึงภาพทั้งหมดที่ได้จากกล้อง
    img_folder_path = "./database/*.jpeg"
    img_paths = glob.glob(img_folder_path)

    result_list = []
    for img_path in img_paths:
        # ถ้ารูปภาพนี้ถูกประมวลผลแล้วในครั้งที่ก่อน, ข้ามไปทำรูปภาพถัดไป
        if img_path in processed_images:
            continue

        val_ver = []

        # วนลูปผ่านทุกรูปภาพใน database
        for db_image in imgdb_path:
            result = DeepFace.verify(db_image, img_path, model_name=models[0], enforce_detection=False)
            val_ver.append(result["verified"])
            

        # any ใน list มี True 1ตัว ให้เป็น True
        if any(val_ver):
            anaimg = DeepFace.analyze(img_path, enforce_detection=False, actions=("emotion"))
            res = [anaimg[0]["dominant_emotion"]]
            result_list.append((img_path, res))
            processed_images.add(img_path)  # เพิ่มรูปภาพนี้เข้าไปใน set ที่เคยถูกประมวลผล
            
            
        else:
            anaimg = DeepFace.analyze(img_path, enforce_detection=False, actions=("emotion", "age", "gender"))
            ser = [anaimg[0]["dominant_emotion"], anaimg[0]["age"], anaimg[0]["dominant_gender"]]
            result_list.append((img_path, ser))
            processed_images.add(img_path)
            
    print(result_list)  # เพิ่มรูปภาพนี้เข้าไปใน set ที่เคยถูกประมวลผล
    return result_list

# เรียกใช้งานฟังก์ชัน loopimg() เพื่อประมวลผลทุกรูปในโฟลเดอร์
loopimg()