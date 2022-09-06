import { useState } from 'react'
import Footer from '../../components/Footer/Footer'
import Header from '../../components/Header/Header'
import NewPost from '../../components/NewPost/NewPost'
import Post from '../../components/Post/Post'
import posts from '../../datas/posts'
import './Home.css'

function Home() {
   const [newPost, setNewPost] = useState(false)

   return (
      <div className="page">
         <Header newPost={newPost} setNewPost={setNewPost} />

         <ul className="posts-container">
            {newPost && <NewPost newPost={newPost} setNewPost={setNewPost} />}
            {posts.map(({ description, imageUrl, userId, likes, _id }) => (
               <li key={_id} className="post">
                  <Post
                     description={description}
                     imageUrl={imageUrl}
                     userId={userId}
                     likes={likes}
                  />
               </li>
            ))}
         </ul>

         <Footer />
      </div>
   )
}

export default Home
