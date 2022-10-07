import axios from 'axios'
import { useEffect, useState } from 'react'
import Footer from '../../components/Footer/Footer'
import Header from '../../components/Header/Header'
import NewPost from '../../components/NewPost/NewPost'
import Post from '../../components/Post/Post'
import './Home.css'
import { useNavigate } from 'react-router-dom'

function Home() {
   const navigate = useNavigate()
   const [newPost, setNewPost] = useState(false)
   const [activeToken, setActiveToken] = useState(
      sessionStorage.getItem('groupomaniaActiveUser')
         ? JSON.parse(sessionStorage.getItem('groupomaniaActiveUser')).token
         : ''
   )
   const [activeUser, setActiveUser] = useState({})
   const [allPosts, setAllPosts] = useState([])
   const [update, setUpdate] = useState({})
   const [likesArray, setLikesArray] = useState([])

   axios.defaults.headers.common = { Authorization: `Bearer ${activeToken}` }
   axios.defaults.baseURL = 'http://localhost:3001/api'

   useEffect(() => {
      // ------------CHECK---------------
      axios
         .get('/auth/check')
         .then((res, error) => {
            if (error || res.data == null) {
               sessionStorage.removeItem('groupomaniaActiveUser')
               setActiveToken('')
               navigate('/')
            } else {
               setActiveUser(res.data)
            }
         })
         .catch(() => {
            sessionStorage.removeItem('groupomaniaActiveUser')
            setActiveToken('')
            navigate('/')
         })
   }, [])

   useEffect(() => {
      // ----------------ALLPOSTS----------------
      axios
         .get('/posts')
         .then((res) => {
            console.log(res.data.posts)
            setAllPosts(res.data.posts.slice(0).reverse())
            setLikesArray(res.data.likesArray)
         })
         .catch((error) => console.log(error))
   }, [])

   useEffect(() => {
      // ---------------UPDATE----------------
      if (update.delete) {
         let currentAllPosts = allPosts
         currentAllPosts.splice(update.i, 1)
         setAllPosts(currentAllPosts)
         setUpdate({})
      } else if (update.edit) {
         let currentAllPosts = allPosts
         let postToEdit = update.updatedPost
         postToEdit.user = currentAllPosts[update.i].user
         currentAllPosts[update.i] = postToEdit
         setAllPosts(currentAllPosts)
         setUpdate({})
      } else if (update.new) {
         let currentAllPosts = allPosts
         let postToAdd = update.postToAdd
         currentAllPosts.unshift(postToAdd)
         setAllPosts(currentAllPosts)
         setUpdate({})
      }
   }, [update])

   return (
      <div className="page">
         <Header
            newPost={newPost}
            setNewPost={setNewPost}
            activeUser={activeUser}
            home={true}
         />

         <ul className="posts-container">
            {newPost && (
               <NewPost
                  newPost={newPost}
                  setNewPost={setNewPost}
                  activeToken={activeToken}
                  activeUser={activeUser}
                  setUpdate={setUpdate}
               />
            )}
            {allPosts.map(
               ({ description, imageUrl, userId, likes, id, user }, i) => (
                  <li key={id} className="post">
                     <Post
                        id={id}
                        description={description}
                        imageUrl={imageUrl}
                        userId={userId}
                        likes={likes}
                        user={user}
                        activeUser={activeUser}
                        activeToken={activeToken}
                        setUpdate={setUpdate}
                        i={i}
                        likesArray={likesArray}
                     />
                  </li>
               )
            )}
         </ul>

         <Footer />
      </div>
   )
}

export default Home
