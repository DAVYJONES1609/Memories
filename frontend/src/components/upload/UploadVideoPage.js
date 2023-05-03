import React, { useState, useEffect} from 'react'
import { Typography, Button, Form, message, Input} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import "./take.css";
import axios from 'axios';
//import {useSelector} from "react-redux";
import Dropzone from 'react-dropzone';
import {useNavigate} from "react-router-dom"
import { blueGrey } from '@mui/material/colors';
const { Title } = Typography;
const { TextArea } = Input;

const Private = [
    { value: 0, label:'Private'},
    { value: 1, label:'Public'}
]

const Catogory = [
    { value: 0, label: "Film & Animation" },
    { value: 0, label: "Autos & Vehicles" },
    { value: 0, label: "Music" },
    { value: 0, label: "Pets & Animals" },
    { value: 0, label: "Sports" },
]

const UploadVideoPage=({ setLoginUser })=> {
    const [user, setUser] = useState(null);
  const [componentMounted, setComponentMounted] = useState(false);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loginUser");
    if (loggedInUser && componentMounted) {
      setUser(JSON.parse(loggedInUser));
    }
  }, [setLoginUser, componentMounted]);

  useEffect(() => {
    setComponentMounted(true);
  }, []);
    //const user=useSelector(state=>state.user);
    const history=useNavigate()
    const [title, setTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [privacy, setPrivacy] = useState(0)
    const [Categories, setCategories] = useState("Film & Animation")
    const [FilePath,setFilePath]=useState("");
    const [Duration, setDuration]=useState("");
    const [Thumbnail,setThumbnail]=useState("");

    const handleChangeTitle = ( event ) => {
        setTitle(event.currentTarget.value)
    }

    const handleChangeDecsription = (event) => {
        console.log(event.currentTarget.value)

        setDescription(event.currentTarget.value)
    }

    const handleChangeOne = (event) => {
        setPrivacy(event.currentTarget.value)
    }

    const handleChangeTwo = (event) => {
        setCategories(event.currentTarget.value)
    }

    const onSubmit = (event) => {
        event.preventDefault();

        if(title===""||Description===""||Thumbnail===""||Categories===""){
            return alert('Please fill the fields first');
        }

        const variables={
            writer:user._id,
            title:title,
            description:Description,
            privacy:privacy,
            filePath:FilePath,
            category:Categories,
            duration:Duration,
            thumbnail:Thumbnail,
        }

        axios.post(`http://localhost:9002/api/video/uploadVideo`,variables)
        .then(response=>{
            if(response.data.success){
                alert('video uploaded successfully')
                history("/")
            }
            else{
                alert('Failed to upload video')
            }
        })
    }
    const onDrop=(files)=>{
        let formData=new FormData();
        const config={
            header:{'content-type':'multipart/form-data'}
        }
        console.log(files)
        formData.append("file",files[0])

        axios.post(`http://localhost:9002/api/video/uploadfiles`,formData,config)
        .then(response=>{
            if(response.data.success){
                
                let variable={
                    filePath:response.data.filePath,
                    fileName:response.data.fileName
                }
                setFilePath(response.data.filePath)

                //generate thumbnail with filepath

                axios.post(`http://localhost:9002/api/video/thumbnail`,variable)
                .then(response=>{
                    if(response.data.success){
                        setDuration(response.data.fileDuration)
                        console.log(response.data.thumbsFilePath)
                        setThumbnail(response.data.thumbsFilePath)
                    }
                    else{
                        alert('Failed to make the thumbnails');
                    }
                })

            }else{
                alert("some error occured")
            }
        })
    }
    return (
        <>
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
      <form className="d-flex" role="search">
        <div className="sp">
        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
        <button className="btn btn-outline-success" type="submit" onClick={()=>history("/feed")}>Search</button>
        </div>
        <button className="btn btn-outline-success" type="submit" onClick={() => {setLoginUser({});localStorage.removeItem('loginUser');}}>Logout</button>
      </form>
    </div>
  </div>
</nav>


        <div style={{ backgroundColor:'rgb(11, 10, 64)',color:"white"}} >
        <div style={{ textAlign: 'center', marginBottom: '2rem'}}>
            <Title level={2} ><b>Upload Video</b></Title>
        </div>
        <div style={{ maxWidth: '700px', marginLeft: '12rem',paddingBottom:'2rem' }}>
        <Form onSubmit={onSubmit}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Dropzone 
                    onDrop={onDrop}
                    multiple={false}
                    maxSize={800000000}>
                    {({ getRootProps, getInputProps }) => (
                        <div style={{ backgroundColor:'white',width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            {...getRootProps()}
                        >
                            <input {...getInputProps()} />
                             {/* <Icon type="plus" style={{ fontSize: '3rem' }} />  */}
                            <PlusOutlined style={{ fontSize: '3rem',color:'black' }}/>
                        </div>
                    )}
                </Dropzone>
                        
                {Thumbnail !== "" &&
                    <div>
                        <img src={`http://localhost:9002/${Thumbnail}`} alt="haha" />
                    </div>
                }
            </div>

            <br /><br />
            <label style={{color:'white',marginBottom:10}}><b>Title</b></label><br />
            <Input
                 onChange={handleChangeTitle}
                 value={title}
            />
            <br /><br />
            <label style={{color:'white',marginBottom:10}}><b>Description</b></label><br />
            <TextArea style = {{width:'70%',backgroundColor:'white'}}
                 onChange={handleChangeDecsription}
                 value={Description}
            />
            <br /><br />

            <select onChange={handleChangeOne}>
                {Private.map((item, index) => (
                    <option key={index} value={item.value}>{item.label}</option>
                ))}
            </select>
            <br /><br />

            <select onChange={handleChangeTwo}>
                {Catogory.map((item, index) => (
                    <option key={index} value={item.label}>{item.label}</option>
                ))}
            </select>
            <br /><br />

            <Button className="btn btn-primary" type="primary" size="large  " onClick={onSubmit}>
                Submit
            </Button>

        </Form></div>
    </div>
    </>
    )
}

export default UploadVideoPage
