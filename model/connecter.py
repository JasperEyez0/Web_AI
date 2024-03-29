import os
import json
import mysql.connector

# เริ่มต้นค่า previous_modification_time เป็น None
previous_modification_time = None

def update_database_from_json():
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
        for entry in data:
            if isinstance(entry, list) and len(entry) > 1:  # ตรวจสอบว่า entry เป็น list และมีจำนวนรายการมากกว่า 1
                details = entry[1]

                # เช็คว่าข้อมูลที่จะเพิ่มเข้าฐานข้อมูล MySQL มีอยู่แล้วหรือไม่
                sql_check_duplicate = "SELECT * FROM report WHERE pic_r = %s"
                val_check_duplicate = (details['pic_r'],)
                mycursor.execute(sql_check_duplicate, val_check_duplicate)
                result = mycursor.fetchone()

                if not result:  # ถ้าไม่มีข้อมูลซ้ำอยู่ในฐานข้อมูล MySQL
                    # เพิ่มโค้ดสำหรับอัพเดตฐานข้อมูล
                    sql = "INSERT INTO report (s_id, pic_r, pic_cam, date, mood, age, gender) VALUES (%s, %s, %s, %s, %s, %s, %s)"
                    val = (details['s_id'], details['pic_r'], details['pic_cam'], details['date'], details['mood'], details['age'], details['gender'])
                    mycursor.execute(sql, val)
                    
            else:
                pass

        mydb.commit()  # ยืนยันการเปลี่ยนแปลงในฐานข้อมูล
        print("ข้อมูลถูกอัพเดตลงในฐานข้อมูล")

    else:
        print("ไม่มีการเปลี่ยนแปลงในไฟล์ JSON")

    # อัพเดตเวลาการแก้ไขไฟล์ JSON
    previous_modification_time = current_modification_time

    mycursor.close()
    mydb.close()