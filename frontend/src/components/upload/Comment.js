import React, { useState } from 'react'
import { Button, Input } from 'antd';
import axios from 'axios';
import SingleComment from './SingleComment.js';
import ReplyComment from './ReplyComment.js';
const { TextArea } = Input;


function Comments({ CommentLists,user,videoId,refreshFunction}) {

  const [Comment, setComment] = useState("")

    const handleChange = (e) => {
        setComment(e.currentTarget.value)
    }

    const onSubmit = (e) => {
      e.preventDefault();

      const variables = {
          content: Comment,
          writer: user._id,
          postId: videoId
      }

      axios.post('http://localhost:9002/api/comment/saveComment', variables)
          .then(response => {
              if (response.data.success){
                  setComment("")
                  refreshFunction(response.data.result)
              } else {
                  alert('Failed to save Comment')
              }
          })
  }

  return (
    <div>
            {console.log(CommentLists)}
            <h4>Comments</h4><hr></hr>

            {CommentLists && CommentLists.map((comment,index)=>(
                (!comment.responseTo&&
                    <React.Fragment>
                    <SingleComment comment={comment} videoId={videoId} refreshFunction={refreshFunction} />
                    <ReplyComment CommentLists={CommentLists} parentCommentId={comment._id} videoId={videoId} refreshFunction={refreshFunction}/>
                </React.Fragment>)
            ))}
            <p>Post a new comment</p>
            <form style={{ display: 'flex' ,marginLeft:'20px'}} onSubmit={onSubmit}>
                <TextArea
                    style={{ width: '80%', borderRadius: '5px' ,marginRight:'20px',height:'50px'}}
                    onChange={handleChange}
                    value={Comment}
                    placeholder="write some comments"
                />
                <br />
                <button className="btn btn-outline-success" type="submit" onClick={onSubmit}>Submit</button>
                {/* <Button style={{ width: '20%', height: '52px',backgroundColor:'blue' }} onClick={onSubmit}>Submit</Button> */}
            </form>

    </div>
  )
}

export default Comments
