import axios from 'axios'
import { useState } from 'react'
import profile from '../../assets/profile.png'
import users from '../../datas/users'
import './NewPost.css'
import imageNewpost from '../../assets/ajout-image-post.png'
import cancelNewPost from '../../assets/cancel-new-post.png'
import postNewPost from '../../assets/post-new-post.png'

function NewPost({ NewPost, setNewPost, activeToken }) {
   axios.defaults.headers.common = { Authorization: `Bearer ${activeToken}` }

   const [scHeight, setScHeight] = useState(52)
   const textarea = document.querySelector('textarea')
   const handleHeight = (e) => {
      setScHeight(e.target.scrollHeight)
      textarea.style.height = `${scHeight}px`
   }

   const [description, setDescription] = useState('')
   const [imageUrl, setImageUrl] = useState('')

   function handleSubmit(e) {
      e.preventDefault()

      console.log(description)

      const newPostData = {
         description: description,
         imageUrl: imageUrl,
      }
      if (description === '') {
         alert('Vous ne pouvez pas envoyer un post vide')
      } else {
         axios({
            method: 'post',
            url: 'http://localhost:3001/api/posts',
            data: newPostData,
         })
      }
   }

   return (
      <div className="post-container post-container--new">
         <form className="post__body new-post-body" onSubmit={handleSubmit}>
            <div className="post__body__header new-post-body-header">
               <div className="flex-header">
                  <img src={profile} alt="" className="image-profile" />
                  <span> {users[1].userName} </span>
               </div>
               <button
                  className="new-post-btn"
                  onClick={() => setNewPost(false)}
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
                  name="imageUrl"
                  id="imageUrl"
                  className="new-post-img-input"
                  onChange={(e) => setImageUrl(e.target.value)}
               />
            </div>
            <div className="new-post-bot">
               <label htmlFor="imageUrl" className="new-post-img-label">
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
