import axios from 'axios'
import React from 'react'
import './Post.css'

function Post({
   id,
   description,
   imageUrl,
   userId,
   likes,
   publisherName,
   publisherImg,
   activeUser,
   activeToken,
}) {
   axios.defaults.headers.common = { Authorization: `Bearer ${activeToken}` }
   axios.defaults.baseURL = 'http://localhost:3001/api'

   function handleDelete() {
      axios.delete(`/posts/${id}`)
   }

   return (
      <div className="post-container">
         <div className="post__body">
            <div className="post__body__header">
               <div className="post__body__header__left">
                  <img src={publisherImg} alt="" className="image-profile" />
                  <span> {publisherName} </span>
               </div>
               {parseInt(userId) === activeUser.id && (
                  <div className="fa-solid fa-ellipsis-vertical edit">
                     <ul className="edit-menu">
                        <li className="edit-menu__choice">Editer</li>
                        <li
                           className="edit-menu__choice"
                           onClick={handleDelete}
                        >
                           Supprimer
                        </li>
                     </ul>
                  </div>
               )}
            </div>
            <div className="post__body__descr">
               <span>{description}</span>
               <img src={imageUrl} alt="" />
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
