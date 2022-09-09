import { useState } from 'react'
import Footer from '../../components/Footer/Footer'
import Header from '../../components/Header/Header'
import NewPost from '../../components/NewPost/NewPost'
import Post from '../../components/Post/Post'
import posts from '../../datas/posts'
import './Home.css'

function Home() {
   if (!JSON.parse(localStorage.getItem('groupomaniaActiveUser'))) {
      window.location.href = './'
   }
   const [newPost, setNewPost] = useState(false)
   const [activeToken, setActiveToken] = useState(
      JSON.parse(localStorage.groupomaniaActiveUser).token
   )

   return (
      <div className="page">
         <Header newPost={newPost} setNewPost={setNewPost} />

         <ul className="posts-container">
            {newPost && (
               <NewPost
                  newPost={newPost}
                  setNewPost={setNewPost}
                  activeToken={activeToken}
               />
            )}
            {posts.map(({ description, imageUrl, userId, likes, _id }) => (
               <li key={_id} className="post">
                  <Post
                     description={description}
                     imageUrl={imageUrl}
                     userId={userId}
                     likes={likes}
                     activeToken={activeToken}
                  />
               </li>
            ))}
         </ul>

         <Footer />
      </div>
   )
}

export default Home
