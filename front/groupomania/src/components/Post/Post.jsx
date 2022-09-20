import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import NewPost from '../NewPost/NewPost'
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
   setUpdate,
}) {
   const [editPost, setEditPost] = useState(false)
   const [yourLike, setYourLike] = useState(false)

   function handleDelete() {
      axios.delete(`/posts/${id}`).then(setUpdate(true))
   }

   function handleLike() {
      axios.post(`/posts/${id}/like`).then(() => setUpdate(true))
   }

   useEffect(() => {
      axios
         .get(`/posts/${id}/checklike`)
         .then((res) => {
            res.data.yourLike ? setYourLike(true) : setYourLike(false)
         })
         .catch(() => setYourLike(false))
   }, [likes])

   return (
      <div>
         {editPost ? (
            <NewPost
               activeUser={activeUser}
               editPost={editPost}
               setEditPost={setEditPost}
               id={id}
               description={description}
               imageUrl={imageUrl}
               setUpdate={setUpdate}
            />
         ) : (
            <div className="post-container">
               <div className="post__body">
                  <div className="post__body__header">
                     <div className="post__body__header__left">
                        <img
                           src={publisherImg}
                           alt=""
                           className="image-profile"
                        />
                        <span> {publisherName} </span>
                     </div>
                     {parseInt(userId) === activeUser.id && (
                        <div className="fa-solid fa-ellipsis-vertical edit">
                           <ul className="edit-menu">
                              <li
                                 className="edit-menu__choice"
                                 onClick={() => setEditPost(true)}
                              >
                                 Editer
                              </li>
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
                     <i
                        className={
                           yourLike
                              ? 'fa-solid fa-heart'
                              : 'fa-solid fa-heart reverse'
                        }
                        onClick={handleLike}
                     ></i>
                  </button>
                  <span className="likeNumber"> {likes} </span>
               </div>
            </div>
         )}
      </div>
   )
}
export default Post
