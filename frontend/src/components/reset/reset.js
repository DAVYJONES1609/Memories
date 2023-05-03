import React,{useState} from "react";
import axios from "axios";
import "./reset.css"
import {useNavigate} from "react-router-dom"
const Reset = () => {
    const history=useNavigate()
    const[user,setUser]=useState({
        password:"",
        resetPassword:""
    })
    const handleChange=e=>{
        const{name,value}=e.target
        setUser({
            ...user,
            [name]:value
        })
    }
    const reset=()=>{
        axios.post("http://localhost:9002/reset",user)
        .then(res=>{alert(res.data.status)})
        //     if(res.data.message==='An reset link is sent to your email.')
        //     history("/login")
        //     else{
        //         history("/signup")
        //     }
        // })
    }
    return (
        <div className="forgot">
        <h1>Reset Password</h1>
        <input type="text"name="password"value={user.password} placeholder="Enter new password"onChange={handleChange}></input>
        <input type="text"name="resetPassword"value={user.resetPassword} placeholder="Confirm password"onChange={handleChange}></input>
        <div className="button"onClick={reset}>Submit</div>
        </div>
    )}
export default Reset
