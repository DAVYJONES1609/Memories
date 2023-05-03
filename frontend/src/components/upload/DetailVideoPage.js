import React, { useEffect,useState } from 'react'
import {useNavigate, useParams} from "react-router-dom"
import {Avatar, List,Typography} from 'antd';
import axios from 'axios';
import moment from 'moment';
import Comments from './Comments.js';
import Rating from './Rating.js';

const DetailVideoPage=({ setLoginUser })=> {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  
  const [openDescription, setDescription] = useState(false)
  const [openrate, setopenrate] = useState(false)
  const [user, setUser] = useState(null);
  const [componentMounted, setComponentMounted] = useState(false);
  const [CommentLists, setCommentLists] = useState([])

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loginUser");
    if (loggedInUser && componentMounted) {
      setUser(JSON.parse(loggedInUser));
    }
  }, [setLoginUser, componentMounted]);

  useEffect(() => {
    setComponentMounted(true);
  }, []);

  const handleDescriptionToggle = () => {
    setDescription(!openDescription)
}
const handlerateToggle = () => {
  setopenrate(!openrate)
}

  const updateComment = (newComment) => {
    setCommentLists(CommentLists.concat(newComment))
}


    const history=useNavigate()
    const {videoId}=useParams();
    const [Video,setvideo]=useState({ writer: {} })


    useEffect(()=>{
        axios.post(`http://localhost:9002/api/video/getVideo`,{videoId})
        .then(response=>{
            if(response.data.success){
                console.log(response.data.videos)
                setvideo(response.data.videos)
            }
            else{
                alert('Failed to get video info');
            }
        })

        axios.post(`http://localhost:9002/api/comment/getComments`,{videoId})
            .then(response => {
                if (response.data.success) {
                    console.log('response.data.comments',response.data.comments)
                    setCommentLists(response.data.comments)
                } else {
                    alert('Failed to get video Info')
                }
          })
    },[videoId])

    const handleRatingChange = (e) => {
      setRating(e.target.value);
    };

    const handleRatingSubmit = async (e) => {
      e.preventDefault();
      try {
        await axios.post(`http://localhost:9002/api/video/rate/${user._id}/${videoId}`, { rating });
        setMessage('Rating added successfully');
        window.location.reload();
      } catch (error) {
        console.error(error);
        setMessage('Something went wrong');
      }
    };

  return (
    <>
    <div>
    <nav className="navbar navbar-expand-lg bg-light">
  <div className="container-fluid">
    <a className="navbar-brand" href="/">Gaming Realm</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <a className="nav-link active" aria-current="page" href="/">Videos</a>
        </li>
        <li className="nav-item">
          <a className="nav-link active" href="/api/v1/media">Upload Videos</a>
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
        <button className="btn btn-outline-success" style={{marginRight:'20px'}} type="submit" onClick={() => {setLoginUser({});localStorage.removeItem('loginUser');}}>Logout</button>     
    </div>
  </div>
</nav>
    <div className='postPage' style={{width:'100%',padding:'3rem 4rem'}}>
        <video style={{width:'100%'}} src={`http://localhost:9002/${Video.filePath}`} controls></video>

            
            <span style={{fontStyle:'italic',fontWeight:'bold',fontSize:'25px'}}>{Video.title}</span><br/>
            {!openDescription ? (
            <span onClick={handleDescriptionToggle} style={{ cursor: 'pointer',fontStyle:'oblique' }}>
              Show Description
                  </span>
                ) : (
              <>
              <span onClick={handleDescriptionToggle} style={{ cursor: 'pointer' }}>
                Hide Description
              </span>
              <p>{Video.description}</p>
              </>
            )}<br/>
            
            <span style={{ marginRight: "2rem", display: "inline-block" }}>
                    <img src={Video.writer.image} width='40px' height='40px' style={{borderRadius:'50%'}}></img>  {Video.writer.name}
                  </span><br/>
            <span>Published: {moment(Video.createdAt).format("MMM Do YY")}</span><br/>
        {/* Rating */}
        {!openrate ?(
            <span onClick={handlerateToggle} style={{ cursor: 'pointer',fontStyle:'oblique' }}>
              Rate this Video
                  </span>
                ):(<>
         <form onSubmit={handleRatingSubmit}>
        <label style={{marginRight:'10px'}}>
          Rating:</label>
          <select value={rating} onChange={handleRatingChange} style={{marginRight:'15px'}}>
            <option value="0">Select rating</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
              </select>
            
            <button className="btn btn-outline-success" style={{width:'70px',height:'30px',padding:'0'}}type="submit">Submit</button>
          </form>
          {message && <p>{message}</p>}<br/>
          <span onClick={handlerateToggle} style={{ cursor: 'pointer' }}>
                Rate later
              </span>
          </>         
                )}
          <Rating videoId={videoId}/>

        <Comments CommentLists={CommentLists} user={user} videoId={videoId} refreshFunction={updateComment} />
    </div>
    </div>
    </>
  )
}

export default DetailVideoPage
