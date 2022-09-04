import Footer from '../../components/Footer/Footer'
import Header from '../../components/Header/Header'
import Post from '../../components/Post/Post'
import posts from '../../datas/posts'
import './Home.css'

function Home() {
   return (
      <div>
         <Header />

         <ul className="posts-container">
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
