import React from 'react'
import './Post.css'

function Post({
   description,
   imageUrl,
   userId,
   likes,
   publisherName,
   publisherImg,
}) {
   return (
      <div className="post-container">
         <div className="post__body">
            <div className="post__body__header">
               <img src={publisherImg} alt="" className="image-profile" />
               <span> {publisherName} </span>
            </div>
            <div className="post__body__descr">
               <span>{description}</span>
               <img src={imageUrl.tortue} alt="" />
            </div>
         </div>

         <div className="post__interact">
            <button className="btn--like btn">
               <i className="fa-solid fa-heart"></i>
            </button>
            <span className="likeNumber"> {likes} </span>
         </div>
      </div>
   )
}
export default Post
