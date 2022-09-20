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
   const [update, setUpdate] = useState(false)

   axios.defaults.headers.common = { Authorization: `Bearer ${activeToken}` }
   axios.defaults.baseURL = 'http://localhost:3001/api'
   useEffect(() => {
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
   }, [navigate])

   useEffect(() => {
      axios
         .get('/posts')
         .then((posts) => {
            setAllPosts(posts.data)
            setUpdate(false)
         })
         .catch((error) => console.log(error))
      setTimeout(() => {
         axios
            .get('/posts')
            .then((posts) => {
               setAllPosts(posts.data)
               setUpdate(false)
            })
            .catch((error) => console.log(error))
      }, 2000)
   }, [update])

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
                  setUpdate={setUpdate}
               />
            )}
            {allPosts
               .slice(0)
               .reverse()
               .map(
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
                           setUpdate={setUpdate}
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
