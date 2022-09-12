import axios from 'axios'
import { useEffect, useState } from 'react'
import Footer from '../../components/Footer/Footer'
import Header from '../../components/Header/Header'
import NewPost from '../../components/NewPost/NewPost'
import Post from '../../components/Post/Post'
import './Home.css'

function Home() {
   if (!JSON.parse(sessionStorage.getItem('groupomaniaActiveUser'))) {
      window.location.href = './'
   }
   const [newPost, setNewPost] = useState(false)
   const [activeToken, setActiveToken] = useState(
      JSON.parse(sessionStorage.groupomaniaActiveUser).token
   )
   const [activeUser, setActiveUser] = useState({})
   const [allPosts, setAllPosts] = useState([])

   axios.defaults.headers.common = { Authorization: `Bearer ${activeToken}` }
   axios.defaults.baseURL = 'http://localhost:3001/api'
   useEffect(() => {
      axios
         .get('/auth/check')
         .then((res, error) => {
            if (error || res.data == null) {
               sessionStorage.removeItem('groupomaniaActiveUser')
               setActiveToken('')
               window.location.href = './'
            } else {
               setActiveUser(res.data)
            }
         })
         .catch(() => {
            sessionStorage.removeItem('groupomaniaActiveUser')
            setActiveToken('')
            window.location.href = './'
         })
   }, [])

   useEffect(() => {
      axios
         .get('/posts')
         .then((posts) => setAllPosts(posts.data))
         .catch((error) => console.log(error))
   }, [newPost])

   return (
      <div className="page">
         <Header
            newPost={newPost}
            setNewPost={setNewPost}
            activeUser={activeUser}
         />

         <ul className="posts-container">
            {newPost && (
               <NewPost
                  newPost={newPost}
                  setNewPost={setNewPost}
                  activeToken={activeToken}
                  activeUser={activeUser}
               />
            )}
            {allPosts.map(
               ({
                  description,
                  imageUrl,
                  userId,
                  likes,
                  id,
                  publisherName,
                  publisherImg,
               }) => (
                  <li key={id} className="post">
                     <Post
                        id={id}
                        description={description}
                        imageUrl={imageUrl}
                        userId={userId}
                        likes={likes}
                        publisherName={publisherName}
                        publisherImg={publisherImg}
                        activeUser={activeUser}
                        activeToken={activeToken}
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
