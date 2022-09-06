import React from 'react'
import users from '../../datas/users'
import profile from '../../assets/profile.png'
import './Post.css'

function Post({ description, imageUrl, userId, likes }) {
   const user = users.filter((user) => user.userId === userId)[0]
   return (
      <div className="post-container">
         <div className="post__body">
            <div className="post__body__header">
               <img src={profile} alt="" className="image-profile" />
               <span> {user.userName} </span>
            </div>
            <div className="post__body__descr">
               <span>{description}</span>
               <img src={imageUrl.tortue} alt="" />
            </div>
         </div>

         <div className="post__interact">
            <button className="like">Like</button>
            <span className="likeNumber"> {likes} </span>
         </div>
      </div>
   )
}
export default Post
