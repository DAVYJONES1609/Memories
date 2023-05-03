import React,{useState} from "react";
import axios from "axios";
import "./forgot.css"
import {useNavigate} from "react-router-dom"
const Forgot = () => {
    const history=useNavigate()
    const[user,setUser]=useState({
        email:""
    })
    const handleChange=e=>{
        const{name,value}=e.target
        setUser({
            ...user,
            [name]:value
        })
    }
    const forgot=()=>{
        axios.post("http://localhost:9002/forgot",user)
        .then(res=>{alert(res.data.message)
            if(res.data.message==='An reset link is sent to your email.')
            history("/")
            else{
                history("/signup")
            }
        })
    }
    return (
        <div className="al">
        <div className="forgot">
        <h1>Forgot Password</h1>
        <input type="text"name="email"value={user.email} placeholder="Enter your Email"onChange={handleChange}></input>
        <div className="button"onClick={forgot}>Submit</div>
        </div>
        </div>
    )}
export default Forgot