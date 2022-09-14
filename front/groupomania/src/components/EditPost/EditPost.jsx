import axios from 'axios'
import { useState } from 'react'
import imageNewpost from '../../assets/ajout-image-post.png'
import cancelNewPost from '../../assets/cancel-new-post.png'
import postNewPost from '../../assets/post-new-post.png'

function EditPost({ setEditPost, activeUser, id, imageUrl }) {
   const [scHeight, setScHeight] = useState(52)
   const textarea = document.querySelector('textarea')
   const handleHeight = (e) => {
      setScHeight(e.target.scrollHeight)
      textarea.style.height = `${scHeight}px`
   }

   //--------newpost height----------//

   const [description, setDescription] = useState('')
   const [file, setFile] = useState()

   function handleSubmit(e) {
      e.preventDefault()
      if (description === '') {
         alert('Vous ne pouvez pas envoyer un post vide')
      } else {
         const newPostData = new FormData()
         newPostData.append('description', description)
         newPostData.append('userName', activeUser.userName)
         newPostData.append('profilImg', activeUser.profilImg)

         if (file) {
            console.log(file)

            newPostData.append('image', file, file.name)
            console.log(newPostData)

            axios.post('/posts', newPostData).then((res) => console.log(res))
            setEditPost(false)
         } else {
            axios.post('/posts', newPostData)
            setEditPost(false)
         }
      }
   }

   return (
      <div className="post-container post-container--new">
         <form className="post__body new-post-body" onSubmit={handleSubmit}>
            <div className="post__body__header new-post-body-header">
               <div className="flex-header">
                  <img
                     src={activeUser.profilImg}
                     alt=""
                     className="image-profile"
                  />
                  <span> {activeUser.userName} </span>
               </div>
               <button
                  className="new-post-btn"
                  onClick={() => setEditPost(false)}
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
                  onChange={(e) => setDescription(e.target.value)}
               ></textarea>

               <input
                  type="file"
                  name="file"
                  id="file"
                  accept="image/png, image/jpeg"
                  className="new-post-img-input"
                  onChange={(e) => setFile(e.target.files[0])}
               />
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

export default EditPost
