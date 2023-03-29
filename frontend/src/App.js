import './App.css';
import React,{useState,useEffect}  from 'react';
import axios from 'axios';
import { Box } from '@mui/material';
import Login from "./components/login/login"
import Signup from "./components/signup/signup"
import Homepage from './components/homepage/homepage';
import Forgot from './components/forgot/forgot';
import Reset from './components/reset/reset';
import Feed from './components/Feed';
import UploadVideoPage from './components/views/UploadVideoPage';
import UploadForm from './components/upload/uploadform';
import Uploadlist from './components/upload/uploadlist';
import DetailVideoPage from './components/views/DetailVideoPage';
//const bg=new URL("./images/login.jpg",import.meta.url)
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";

function App(){
  
  // const[user,setLoginUser]=useState({})
  const [user, setLoginUser] = useState(() => {
    const loggedInUser = localStorage.getItem('loginUser');
    if (loggedInUser && loggedInUser.trim() !== "") {
      try {
        return JSON.parse(loggedInUser);
      } catch (error) {
        console.error("Error parsing user data", error);
      }
    }
    return {};
  });

  // const [medias,setMedias]=useState([]);
  //   useEffect(()=>{
  //       getAllMedias();
  //   },[])

  //   const getAllMedias=()=>{
  //       axios
  //       .get(`http://localhost:9002/api/v1/media/all`)
  //       .then((result)=>{
  //           setMedias(result.data)
  //       })
  //       .catch((error)=>{
  //           setMedias([]);
  //           console.log(error);
  //          // alert("Error happened!");
  //       })
  //   }

  return (
    <>
    
    {/* <div className="back"> */}
    
    {/* <img src={bg}/> */}
    <Router>
      <Box >
      <Routes>
        <Route exact path="/" element={user&&user._id?<Homepage setLoginUser={setLoginUser}/>:<Login setLoginUser={setLoginUser}/>}></Route>
        <Route exact path="/" element={<Homepage/>}></Route>
        <Route exact path="/login"element={<Login setLoginUser={setLoginUser}/>} ></Route>
        <Route path="/signup"element={<Signup/>}></Route>
        <Route path="/forgot"element={<Forgot/>}></Route>
        <Route path="/reset"element={<Reset/>}></Route>
        <Route path="/feed"element={<Feed/>}></Route>
        {/* <Route exact path="/upload" element={user&&user._id?<UploadVideoPage setLoginUser={setLoginUser}/>:(<>{alert("Please login to upload videos")}<Login setLoginUser={setLoginUser} /></>)}></Route> */}
        <Route path="/upload"element={<UploadVideoPage/>}></Route>
        <Route exact path="/upload/:videoId" element={user&&user._id?<DetailVideoPage setLoginUser={setLoginUser}/>:<Login setLoginUser={setLoginUser}/>}></Route>
        {/* <Route path="/upload/:videoId"element={<DetailVideoPage/>}></Route> */}
        {/* <Route path="/api/v1/media"element={<UploadForm getAllMedias={getAllMedias}/>}></Route>
        <Route path="/api/v1/videos"element={<Uploadlist medias={medias}/>}></Route> */}
      </Routes>
      </Box>
    </Router>
    {/* <Homepage/> */}
    {/* </div> */}
    <div>
    <Router>
      <Routes>
      </Routes>
    </Router>
    </div>
    </>
    
  );
}

export default App;
