import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from "../assests/img/logo.svg"

import Axios from 'axios'
import { useState, useEffect } from 'react'
import {useSelector} from "react-redux"
import '../page/Greetword.css'; 
import { RiDeleteBin5Fill } from "react-icons/ri";

function Greetword () {

  const [pList, setPList] = useState([]);
  const {user} = useSelector((state)=> ({...state}))

  useEffect(() => {
    if(user !== null) {
      fetchP();
    }
  }, []);

  const fetchP = () => {
    Axios.get(`http://localhost:3001/professor?username=${user.username}`).then((res) => {
      if (res.data.length > 0) {
        setPList(res.data[0]);
        console.log(res.data[0]);
      } else {
        console.log(`No data found for username: ${user.username}`);
      }
    })
    .catch((err) => {
      console.log(err);
    });
  };

return (
  <>
  <body>
    <div class = "all">
  <div class="container">
    <div class ="box">
        <h1 class="greeting">คำทักทาย</h1>
        <h1 class="feeling">เเสดงความรู้สึก</h1>
    </div>
    <div class="feeling-section">
        <input type='text'id="text-feel" placeholder='คำทักทาย' /> 
        <input type='text2'id="text-feel2" placeholder='เเสดงความรู้สึก' /> 
    <button id="Add-btn">เพิ่ม</button>
    </div>
  </div>
  <div class = "big-box">
        <h1 class="greeting2">คำทักทาย</h1>
        <h1 class="feeling2">เเสดงความรู้สึก</h1>
  </div>
  <div class = "box-colluem">
        <h1 class="h">สวัสดีทุกท่านที่มาร่วมรับชม</h1>
        <h1 class="f">Happy</h1>
    <button id="Add-btn"><RiDeleteBin5Fill/></button>
  </div>
</div>
  </body>
</>
)
}

export default Greetword