import React, {useState, useEffect } from "react";
import "./homepage.css"
import {useNavigate} from "react-router-dom"
import axios from "axios";
import moment from 'moment';

import {Card,Avatar,Col,Typography,Row} from "antd";
const {Title}=Typography;
const {Meta}=Card;
// import { Title } from "@mui/icons-material";
const Homepage = ({setLoginUser}) => {
  
// const Homepage = () => {
  // const [user, setUser] = useState(null);
  // const [componentMounted, setComponentMounted] = useState(false);

  // useEffect(() => {
  //   const loggedInUser = localStorage.getItem("loginUser");
  //   if (loggedInUser && componentMounted) {
  //     setUser(JSON.parse(loggedInUser));
  //   }
  // }, [setLoginUser, componentMounted]);

  // useEffect(() => {
  //   setComponentMounted(true);
  // }, []);

    const [Videos,setVideos]=useState([])
    const [searchInput, setSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    useEffect(()=>{
      axios.get(`http://localhost:9002/api/video/getVideos`)
      .then(response=>{
        if(response.data.success){
          console.log(response.data.videos);
          setVideos(response.data.videos)
        }
        else{
          alert('Failed to get videos');
        }
      })
    },[])

    const handleSearch = (e) => {
      e.preventDefault();
      const results = Videos.filter((video) =>
        video.title.toLowerCase().includes(searchInput.toLowerCase())
      );
      setSearchResults(results);
      if (results.length === 0) {
        alert("No results found");
      }
    };

    const history=useNavigate()

    const increaseViews = (video) => {
      axios.post(`http://localhost:9002/api/video/views/${video._id}`,)
      .then((response) => {
        // Find the video in the Videos array and update its views count
        alert(response.data.message);
        const updatedVideos = Videos.map((video) => {
          if (video._id === video._id) {
            return { ...video, views: response.data.views };
          }
          return video;
        });
        setVideos(updatedVideos);
        
      })
      .catch((error) => {
        console.error(error);
        // Handle the error here
      });
    };

              const renderCards=(searchResults.length > 0 ? searchResults : Videos).map((video,index)=>{

                var minutes=Math.floor(video.duration/60);
            var seconds=Math.floor(video.duration -minutes*60);

                return <div style={{display:'inline-flex',flexDirection:'column',marginLeft:'2rem',marginBottom:'1rem',fontFamily:'cursive',fontSize:'medium',fontWeight:'bold'}}>
                <div style={{position:'relative'}}>
                  <a href={`/upload/${video._id}`} onClick={() => increaseViews(video)}>
                  <img  src={`http://localhost:9002/${video.thumbnail}`} /></a>
                  <div className=" duration">
                      <span>Duration: {minutes} min: {seconds} sec</span>
                  </div>
                  
                  <span>{video.title}</span><br/>
                
                  <span style={{ marginRight: "2rem", display: "inline-block" }}>
                  <img src={video.writer.image} width='40px' height='40px' style={{borderRadius:'50%'}}></img> {video.writer.name}
                  </span>
                  <span style={{ display: "inline-block" }}>
                    Views - {video.views} 
                  </span>
                  <br />
                <span>Published: {moment(video.createdAt).format("MMM Do YY")}</span>
                </div>
              </div>
              })

              
    return (
        <>
        <nav className="navbar navbar-expand-lg bg-light">
  <div className="container-fluid">
    <a className="navbar-brand" href="">Gaming Realm</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <a className="nav-link active" aria-current="page" href="/">Home</a>
        </li>
        <li className="nav-item">
          <a className="nav-link active" href="/upload">Upload Videos</a>
        </li>
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Dropdown
          </a>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="#">Action</a></li>
            <li><a className="dropdown-item" href="#">Another action</a></li>
            
            <li><a className="dropdown-item" href="#">Something else here</a></li>
          </ul>
        </li>
      </ul>
      <form className="d-flex" role="search" onSubmit={handleSearch}>
        <div className="sp">
        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}/>
        <button className="btn btn-outline-success" type="submit" >Search</button>
        </div>
      </form>
      <button className="btn btn-outline-success" type="submit" onClick={() => {setLoginUser({});localStorage.removeItem('loginUser');}}>Logout</button>
    </div>
  </div>
</nav>
        {/* <div className="al">
        <div className="home">
        <h1><b>Welcome To GAMING REALM</b></h1>
        <div className="button" onClick={()=>history("/upload")} >Enter the gaming community</div> */}
        {/* <div className="button" onClick={()=>setLoginUser({})} >Logout</div> */}
        {/* </div>
        </div> */}
    
        <div style={{width:'85%',margin:'3rem auto'}}>
              <Title level={2}>Latest Videos</Title>
              <hr></hr>

        {renderCards}
        
        </div>
     
        </>
    )}
export default Homepage
