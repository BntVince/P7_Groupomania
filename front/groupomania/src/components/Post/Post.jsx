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
   i,
   likesArray,
}) {
   const [editPost, setEditPost] = useState(false)
   const [yourLike, setYourLike] = useState(false)
   const [zoomImg, setZoomImg] = useState(false)
   const [currentLike, setCurrentLike] = useState(likes)

   useEffect(() => {
      if (likesArray.some((e) => e.postId === id)) {
         setYourLike(true)
      }
   }, [])

   function handleDelete() {
      axios.delete(`/posts/${id}`).then(setUpdate({ delete: true, i: i }))
   }

   function handleLike() {
      axios.post(`/posts/${id}/like`).then(() => {
         let likes = currentLike
         if (yourLike) {
            likes--
            setCurrentLike(likes)
            setYourLike(false)
         } else {
            likes++
            setCurrentLike(likes)
            setYourLike(true)
         }
      })
   }

   function handleZoom() {
      zoomImg ? setZoomImg(false) : setZoomImg(true)
   }

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
               i={i}
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
                     <img src={imageUrl} alt="" onClick={handleZoom} />
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
                  <span className="likeNumber"> {currentLike} </span>
               </div>
            </div>
         )}
      </div>
   )
}
export default Post
