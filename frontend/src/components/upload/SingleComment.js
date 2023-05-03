import React, { useState } from 'react'
import { Comment, Avatar, Button, Input } from 'antd';
import axios from 'axios';
const { TextArea } = Input;

function SingleComment({comment,videoId,refreshFunction}) {
    const [OpenReply, setOpenReply] = useState(false)
    const [CommentValue, setCommentValue] = useState("")

    const loggedInUser = localStorage.getItem("loginUser");
    const user=JSON.parse(loggedInUser);
    const handleChange = (e) =>{
        setCommentValue(e.currentTarget.value)
    }
    const openReply = () => {
        setOpenReply(!OpenReply)
    }

    const onSubmit=(e)=>{
        e.preventDefault();

        const variables = {
            writer: user._id,
            postId: videoId,
            responseTo: comment._id,
            content: CommentValue
        }

        axios.post('http://localhost:9002/api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    setCommentValue("")
                    setOpenReply(!OpenReply)
                    refreshFunction(response.data.result)
                } else {
                    alert('Failed to save Comment')
                }
         })
    }

    const actions = [
        <span onClick={openReply} key="comment-basic-reply-to" style={{ cursor: 'pointer'}}>Reply to {comment.writer.name}</span>
    ]
  return (
    <div>
        <div>
            <div style={{marginBottom:'10px',marginLeft:'20px'}}>
            <span style={{fontFamily: 'Arial', fontWeight: 'bold'}}><img src={comment.writer.image} width='30px' height='30px' style={{borderRadius:'50%'}}></img> {comment.writer.name} :-</span>
            <span > "{comment.content}" </span></div>
            <Comment
                actions={actions}
                
            ></Comment>

        {OpenReply &&
                <form style={{ display: 'flex' ,marginLeft:'20px',marginRight:'20px'}} onSubmit={onSubmit} >
                    <TextArea
                        style={{ width: '80%', borderRadius: '5px' }}
                        onChange={handleChange}
                        value={CommentValue}
                        placeholder="write a reply"
                    />
                    <br />
                    <button className="btn btn-outline-success" type="submit" onClick={onSubmit}>Submit</button>
                </form>
        }

        </div>
    </div>
  )
}

export default SingleComment
