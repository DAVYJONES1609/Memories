import React, { useEffect, useState } from 'react'
import SingleComment from './SingleComment.js';

function ReplyComment({CommentLists,parentCommentId,videoId,refreshFunction}) {
  const [OpenReplyComments, setOpenReplyComments] = useState(false)
  const [ChildCommentNumber, setChildCommentNumber] = useState(0)

  useEffect(() => {
    let commentNumber = 0;
    CommentLists.map((comment) => {

        if (comment.responseTo === parentCommentId) {
            commentNumber++
        }
    })
    setChildCommentNumber(commentNumber)
}, [CommentLists, parentCommentId])

  let renderReplyComment = (parentCommentId) =>
        CommentLists.map((comment, index) => (
            <React.Fragment>
                {comment.responseTo === parentCommentId &&
                    <div style={{ width: '80%', marginLeft: '40px' }}>
                        <SingleComment comment={comment} videoId={videoId} refreshFunction={refreshFunction} />
                        <ReplyComment CommentLists={CommentLists} parentCommentId={comment._id} videoId={videoId} refreshFunction={refreshFunction} />
                    </div>
                }
            </React.Fragment>
        ))

  const handleChange = () => {
    setOpenReplyComments(!OpenReplyComments)
}
  return (
    <div>
      {ChildCommentNumber > 0 &&
                <p style={{ fontSize: '14px', margin: 0, color: 'gray',cursor:'pointer',marginBottom:'5px' }}
                    onClick={handleChange} >
                    View {ChildCommentNumber} more comment(s)
             </p>
        }

      {OpenReplyComments &&
              renderReplyComment(parentCommentId)
       }

    </div>
  )
}

export default ReplyComment
