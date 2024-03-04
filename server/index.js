const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

const jwt = require('jsonwebtoken')
const secret = 'AI-Project'

const corsOptions = {
    origin: 'http://localhost:3000', // หรือที่ตั้ง React app ของคุณ
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};
  
app.use(cors(corsOptions));
app.use(express.json());

const c = require('lodash')

//create folder
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // กำหนดโฟลเดอร์ที่ไฟล์จะถูกบันทึกไว้

//middleware
const { auth } = require('./middleware/auth')

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "",
    database: "ai_project"
})

app.get('/professor', (req, res) => {
    db.query("SELECT * FROM professor", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.post('/login', (req, res) => {
    db.execute('SELECT * FROM professor WHERE username=?', [req.body.username],
        function(err, professor, fields) {
            if (err) {
                res.json({ status: 'error', message: err })
                return
            }
            if (professor.length == 0) {
                res.json({ status: 'error', message: 'no user found' })
                returna
            }

            console.log(professor[0].password)
            console.log(req.body.password)

            if (!c.isEqual(professor[0].password, req.body.password)) {
                return res.status(400).send("Password Incorrect")
            }

            if (professor.length > 0) {
                const payload = {
                    professor: {
                        username: professor[0].username,
                        password: professor[0].password
                    },
                };
                const token = jwt.sign(payload, secret, { expiresIn: '10h' }, (err, token) => {
                        if (err) throw err;
                        res.json({ token, payload })
                    })
                    //res.json({ status: 'ok', message: 'login success', token })
                return
            } else {
                res.json({ status: 'error', message: 'login failed' })
                return
            }

        })
})

app.post("/current-user", auth, function(req, res, next) {
    try {
        db.execute('SELECT * FROM professor WHERE username=?', [req.professor.username],
            function(err, professor, fields) {
                if (err) {
                    return
                } else {
                    const userInfo = {
                        ID: professor[0].p_id,
                        Name: professor[0].p_name + professor[0].p_sname,
                        Username: professor[0].username,
                        Password: professor[0].password
                    }
                    return res.send(userInfo)
                }
            })
    } catch (err) {
        console.log(err)
        res.status(500).send("Server Error")
    }
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const studentId = req.body.studentId; // รหัสนักศึกษาที่ส่งมาจาก client
        const folderPath = path.join(__dirname, 'student_folders', studentId);
        cb(null, folderPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

app.post('/studentadd', upload.single('file'), jsonParser, function(req, res, next) {
    db.execute('SELECT * FROM student WHERE s_id=?', [req.body.studentId], function(err, student, fields) {
        if (student.length === 0) {
            const { studentId, firstName, lastName, birthDate, gender } = req.body;

            const folderPath = path.join(__dirname, 'student_folders', studentId);

            fs.mkdir(folderPath, { recursive: true }, (err) => {
                if (err) {
                    return res.status(500).json({ status: 'error', message: 'Failed to create student folder.' });
                }

                const updatedPicPath = path.join('student_folders', studentId);
                db.execute('INSERT INTO student (s_id, s_name, s_sname, dateofbirth, gender, pic) VALUES (?, ?, ?, ?, ?, ?)', [studentId, firstName, lastName, birthDate, gender, updatedPicPath], function(err, results, fields) {
                    if (err) {
                        return res.status(500).json({ status: 'error', message: 'Failed to update database.' });
                    }
                    res.json({ status: 'ok' });
                });
            });

            return;
        }

        if (err) {
            return res.status(500).json({ status: 'error', message: 'Database error.' });
        }

        if (c.isEqual(student[0].s_id, req.body.studentId)) {
            return res.status(400).send("Student ID is already existed");
        }
    });
});

app.get('/student', (req, res) => {
    const searchQuery = req.query.search || ''; // ดึงคำค้นหาจาก query parameters

    let query = "SELECT * FROM student";
    if (searchQuery) {
        query += ` WHERE s_name LIKE '%${searchQuery}%' OR s_sname LIKE '%${searchQuery}%' OR s_id LIKE '%${searchQuery}%'`;
    }

    db.query(query, (err, result) => {
        if (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
        } else {
        res.send(result);
        }
    });
});

app.get('/student/:studentId', (req, res) => {
    const studentId = req.params.studentId;
    //console.log('Received studentId:', studentId); // Log or print the studentId to the console

    if (!studentId) {
        // If studentId is not provided, return an error response
        return res.status(400).json({ error: 'Student ID is required.' });
    }

    db.query("SELECT * FROM student WHERE s_id = ?", [studentId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        } else {
            //console.log(result)
            if (result.length === 0) {
                // If no student is found with the provided ID, return a not found response
                return res.status(404).json({ error: 'Student not found.' });
            }

            // If student is found, return the result
            res.json(result[0]);
        }
    });
});

app.put('/student/:studentId', (req, res) => {
    const studentId = req.params.studentId;
    const updatedStudent = req.body;
  
    db.query(
      'UPDATE student SET ? WHERE s_id = ?',
      [updatedStudent, studentId],
      (err, result) => {
        if (err) {
          console.log('Error updating student:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          console.log('Student updated successfully');
          res.status(200).json({ success: true });
        }
      }
    );
});

app.delete('/student/:studentId', (req, res) => {
    const studentId = req.params.studentId;

    db.query("DELETE FROM student WHERE s_id = ?", [studentId], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: 'An error occurred deleting data.' });
        } else {
            if (result.affectedRows > 0) {
                res.json({ message: 'Student information has been deleted.' });
            } else {
                res.status(404).json({ message: 'The student you want to delete was not found.' });
            }
        }
    });
});

app.get('/greetword', (req, res) => {
    db.query("SELECT * FROM greetword", (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            res.send(result);
        }
    });
});

app.post('/greetword', (req, res) => {
    const { feeling, greeting } = req.body;

    db.query("INSERT INTO greetword (feel, greeting) VALUES (?, ?)", [feeling, greeting], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            res.json({ message: 'Greetword added successfully.' });
        }
    });
});

app.delete('/greetword/:greeting', (req, res) => {
    const greetingToDelete = req.params.greeting;

    db.query("DELETE FROM greetword WHERE greeting = ?", [greetingToDelete], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            if (result.affectedRows > 0) {
                res.json({ message: 'Greetword has been deleted.' });
            } else {
                res.status(404).json({ message: 'The greetword you want to delete was not found.' });
            }
        }
    });
});

app.listen('3001', () => {
    console.log('Server is running on port 3001');
});