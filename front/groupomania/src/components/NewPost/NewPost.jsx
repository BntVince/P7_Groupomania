import axios from 'axios'
import { useState, useEffect } from 'react'
import './NewPost.css'
import imageNewpost from '../../assets/ajout-image-post.png'
import cancelNewPost from '../../assets/cancel-new-post.png'
import postNewPost from '../../assets/post-new-post.png'
import defaultProfilImg from '../../assets/default.png'

function NewPost({
   setNewPost,
   activeUser,
   newPost,
   editPost,
   setEditPost,
   id,
   description,
   imageUrl,
   setUpdate,
   user,
   i,
}) {
   const [scHeight, setScHeight] = useState(52)
   const textarea = document.querySelector('textarea')
   const handleHeight = (e) => {
      setScHeight(e.target.scrollHeight)
      textarea.style.height = `${scHeight}px`
   }

   //---------post height----------//

   const [descriptionToSend, setDescription] = useState(
      newPost ? '' : description
   )
   const [file, setFile] = useState(null)
   const [preview, setPreview] = useState('')
   const [cancelImgToSend, setCancelImg] = useState(false)

   useEffect(() => {
      if (!file && !editPost) {
         setPreview('')
         return
      } else if (!file && editPost) {
         setPreview(imageUrl)
         return
      }
      const fileURL = URL.createObjectURL(file)
      setPreview(fileURL)
      setCancelImg(false)
   }, [file])

   function cancelImg() {
      setFile(null)
      setPreview('')
      setCancelImg(true)
   }

   function handleSubmit(e) {
      e.preventDefault()
      if (descriptionToSend === '') {
         alert('Vous ne pouvez pas envoyer un post vide')
      } else if (
         descriptionToSend === description &&
         cancelImgToSend === false &&
         file === null
      ) {
         alert("Vous n'avez apporter aucune modifiaction à votre post")
      } else {
         const newPostData = new FormData()
         newPostData.append('description', descriptionToSend)
         newPostData.append('userName', activeUser.userName)
         newPostData.append('profilImg', activeUser.profilImg)

         if (newPost) {
            if (file) {
               newPostData.append('image', file, file.name)

               axios.post('/posts', newPostData).then((res) => {
                  let postToAdd = res.data.postToAdd
                  setNewPost(false)
                  setUpdate({
                     new: true,
                     postToAdd: postToAdd,
                  })
               })
            } else {
               axios.post('/posts', newPostData).then((res) => {
                  let postToAdd = res.data.postToAdd
                  setNewPost(false)
                  setUpdate({
                     new: true,
                     postToAdd: postToAdd,
                  })
               })
            }
         } else {
            if (file) {
               newPostData.append('image', file, file.name)

               axios.put(`/posts/${id}`, newPostData).then((res) => {
                  let updatedPost = res.data.updatedPost
                  console.log(res.data.updatedPost)
                  setEditPost(false)
                  setUpdate({
                     edit: true,
                     i: i,
                     updatedPost: updatedPost,
                  })
               })
            } else {
               newPostData.append('cancelImg', cancelImgToSend)
               axios.put(`/posts/${id}`, newPostData).then((res) => {
                  let updatedPost = res.data.updatedPost
                  setEditPost(false)
                  setUpdate({
                     edit: true,
                     i: i,
                     updatedPost: updatedPost,
                  })
               })
            }
         }
      }
   }

   return (
      <div className="post-container post-container--new">
         <form className="post__body new-post-body" onSubmit={handleSubmit}>
            <div className="post__body__header new-post-body-header">
               <div className="post__body__header__left">
                  {activeUser.profilImg ? (
                     <img
                        src={activeUser.profilImg}
                        alt=""
                        className="image-profil"
                     />
                  ) : (
                     <img
                        src={defaultProfilImg}
                        alt=""
                        className="image-profil"
                     />
                  )}
                  <span> {newPost ? activeUser.userName : user.userName} </span>
               </div>
               <button
                  className="new-post-btn"
                  onClick={() =>
                     newPost ? setNewPost(false) : setEditPost(false)
                  }
               >
                  <img src={cancelNewPost} alt="" />
               </button>
            </div>
            <div className="post__body__descr">
               <textarea
                  style={{ height: `${scHeight}px` }}
                  onKeyUp={handleHeight}
                  className="new-post-descr"
                  name="description"
                  id="description"
                  cols="30"
                  rows="10"
                  placeholder="Un p’tit truc à partager ?"
                  value={descriptionToSend}
                  onChange={(e) => setDescription(e.target.value)}
               ></textarea>

               <input
                  type="file"
                  name="file"
                  id="file"
                  accept="image/png, image/jpeg"
                  className="new-post-img-input"
                  onChange={(e) => {
                     setFile(e.target.files[0])
                     console.log(e.target.files[0])
                  }}
               />
               <img src={preview} alt="" />
               {preview && (
                  <img
                     src={cancelNewPost}
                     alt=""
                     className=" new-post-btn--cancel-img"
                     onClick={cancelImg}
                  />
               )}
            </div>
            <div className="new-post-bot">
               <label htmlFor="file" className="new-post-img-label">
                  <img src={imageNewpost} alt="" />
               </label>
               <button className="new-post-btn" type="submit">
                  <img src={postNewPost} alt="" />
               </button>
            </div>
         </form>
      </div>
   )
}

export default NewPost
