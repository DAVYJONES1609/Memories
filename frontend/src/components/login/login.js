import React,{useState} from "react";
import axios from "axios";
import "./login.css";
import {useNavigate} from "react-router-dom"
const Login = ({setLoginUser}) => {
    const history=useNavigate()
    const[user,setUser]=useState({
        email:"",
        password:""
    })
    const handleChange=e=>{
        const{name,value}=e.target
        setUser({
            ...user,
            [name]:value
        })
    }

    const login=()=>{
        axios.post("http://localhost:9002/login",user)
        .then(res=>{alert(res.data.message)
        setLoginUser(res.data.user)
        localStorage.setItem('loginUser', JSON.stringify(res.data.user)); 
        history("/")
        })
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
        <div className="login">
        <h1>Login</h1>
            <input type="text"name="email"value={user.email}placeholder="Enter your Email"onChange={handleChange}></input>
            <input type="password"name="password"value={user.password} placeholder="Enter your Password"onChange={handleChange} ></input>
            <p className="notf"onClick={()=>history("/forgot")}>Forgot Password?</p>
            <div className="button" onClick={login}>Login</div>
            <p className="not">not registered?</p>
            <div className="button" onClick={()=>history("/signup")} >Signup</div>
        </div>
        </div>
        </>
    )}
export default Login
