import React,{useState} from "react";
import axios from "axios"//Helps to connect with backend with promise API
import "./signup.css";
import {useNavigate} from "react-router-dom"
import Dropzone from 'react-dropzone';
import { PlusOutlined } from '@ant-design/icons';

const Signup = () => {
    const history=useNavigate()
    const[email,setemail]=useState("")
    const[name,setname]=useState("")
    const[password,setpassword]=useState("")
    const[reEnterPassword,setreEnterPassword]=useState("")
    const [image, setimage] = useState("");
    
    const handleemail=e=>{
      setemail(e.currentTarget.value);
    }
    const handlename=e=>{
      setname(e.currentTarget.value);
    }
    const handlepassword=e=>{
      setpassword(e.currentTarget.value);
    }
    const handlerepassword=e=>{
      setreEnterPassword(e.currentTarget.value);
    }

    const onDrop = async (acceptedFiles) => {
      const formData = new FormData();
      formData.append("file", acceptedFiles[0]);
      formData.append("upload_preset", "disCuter"); // Replace with your own upload preset name
      formData.append("cloud_name", "dfdplrpon"); // Replace with your own cloud name
  
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dfdplrpon/image/upload",
        formData
      );
        console.log(response.data.url)
      setimage(response.data.url);
    };

    const register=()=>{
        const user={name,email,password,reEnterPassword,image}
        if(name&&email&&password&&(password===reEnterPassword)&&image){
            axios.post("http://localhost:9002/signup",user)
            .then(res=>{alert(res.data.message)
                history("/login")
            })
        }
        else{
            alert("invalid input")
        }
    }
    return (
        <>
        <nav className="navbar navbar-expand-lg bg-light">
  <div className="container-fluid">
    <a className="navbar-brand" href="#">Gaming Realm</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <a className="nav-link active" aria-current="page" href="/">Home</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Link</a>
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
        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
        <button className="btn btn-outline-success" type="submit">Search</button>
      </form>
    </div>
  </div>
</nav>
        <div className="al">
        <div className="signup">
        
        <h1>Signup</h1>
            <input type="text"name="name"value={name} placeholder="Your Name" onChange={handlename}></input>
            <input type="text"name="email"value={email} placeholder="Your Email" onChange={handleemail}></input>
            <input type="password"name="password"value={password} placeholder="Your Password" onChange={handlepassword}></input>
            <input type="password"name="reEnterPassword"value={reEnterPassword} placeholder="Re-enter Password"onChange={handlerepassword}></input>
            <Dropzone onDrop={onDrop}>
              {({ getRootProps, getInputProps }) => (
                <div style={{backgroundColor:'white',border: '1px solid lightgray',marginTop:'5px',width:'100px',marginLeft:'115px'}} {...getRootProps()}>
                  <input {...getInputProps()} />
                  <PlusOutlined style={{ fontSize: '2rem',color:'purple' }}/>                                   
                    <p style={{cursor:'pointer'}}>Add a picture</p>                 
                </div>
              )}
            </Dropzone>
            <div className="button" onClick={register}>Signup</div>
        </div>
        </div>
        </>
    )}
export default Signup
