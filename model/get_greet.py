import os
import json
import mysql.connector
import random

# เริ่มต้นค่า previous_modification_time เป็น None
previous_modification_time = None

def get_greet():
    global previous_modification_time  # เรียกใช้ตัวแปร global

    setsay = None
    
    # เชื่อมต่อกับฐานข้อมูล MySQL
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="ai_project"
    )
    mycursor = mydb.cursor()

    # อ่านข้อมูลจากไฟล์ JSON
    with open('./model/my_list.json') as f:
        data = json.load(f)

    # ตรวจสอบการเปลี่ยนแปลงในไฟล์ JSON
    current_modification_time = os.path.getmtime('./model/my_list.json')
    if previous_modification_time is not None and current_modification_time > previous_modification_time:
        for entry in data[-1]:
            if isinstance(entry, list) and len(entry) > 1:  # ตรวจสอบว่า entry เป็น list และมีจำนวนรายการมากกว่า 1
                face_filename = entry[0]
                details = entry[1]

                if len(details['s_id']) == 13:
                    sql_get_name = "SELECT s_name FROM student WHERE s_id = %s"
                    val_get_name = (details['s_id'],)
                    mycursor.execute(sql_get_name, val_get_name)
                    setname_tuple = mycursor.fetchone()
                    setname = setname_tuple[0]

                    sql_get_greet = "SELECT greeting FROM greetword WHERE g_category = %s"
                    mood_to_category = {'neutral': 1, 'happy': 2, 'surprise': 3, 'fear': 4, 'sad': 5, 'disgust': 6, 'angry': 7}
                    # print(details['mood'])
                    g_cate = mood_to_category.get(details['mood'], 1)
                    val_get_greet = (g_cate,)
                    # print(val_get_greet)
                    mycursor.execute(sql_get_greet, val_get_greet)
                    setgreet_tuple = mycursor.fetchall()
                    # print(setgreet_tuple)
                    setgreet = random.choice(setgreet_tuple) if setgreet_tuple else None

                    if setgreet is not None:
                        setsay = setgreet[0] + setname
                    else:
                        setsay = "สวัสดีครับ" + setname
                    return setsay
                
                else:
                    setsay = "สวัสดีครับ"
                    return setsay

    # อัพเดตเวลาการแก้ไขไฟล์ JSON
    previous_modification_time = current_modification_time

    mycursor.close()
    mydb.close()