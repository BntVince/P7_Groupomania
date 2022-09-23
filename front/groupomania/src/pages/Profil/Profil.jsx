import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Header from '../../components/Header/Header'
import ProfilHeader from '../../components/ProfilHeader/ProfilHeader'
import Footer from '../../components/Footer/Footer'
import Post from '../../components/Post/Post'
import './Profil.css'
import EditProfil from '../../components/EditProfil/EditProfil'

function Profil() {
   const navigate = useNavigate()
   const [activeToken, setActiveToken] = useState(
      sessionStorage.getItem('groupomaniaActiveUser')
         ? JSON.parse(sessionStorage.getItem('groupomaniaActiveUser')).token
         : ''
   )

   const [activeUser, setActiveUser] = useState({})
   const [allPosts, setAllPosts] = useState([])
   const [likesArray, setLikesArray] = useState([])
   const [profilUser, setProfilUser] = useState({})
   const [update, setUpdate] = useState({})
   const [editProfil, setEditProfil] = useState(false)
   const { profilId } = useParams()

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
      // ----------------ProfilId----------------
      console.log(profilId)
      axios.get(`/auth/profil/${profilId}`).then((res) => {
         setProfilUser(res.data)
      })
   }, [])

   useEffect(() => {
      // ----------------ALLPOSTS----------------
      axios
         .get('/posts')
         .then((res) => {
            let allProfilPosts = []

            for (let post of res.data.posts.slice(0).reverse()) {
               if (post.userId === profilUser.id) {
                  allProfilPosts.push(post)
               }
            }

            setAllPosts(allProfilPosts)
            setLikesArray(res.data.likesArray)
         })
         .catch((error) => console.log(error))
   }, [profilUser])

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
         <Header activeUser={activeUser} />
         <div className="profil-container">
            <ProfilHeader
               activeUser={activeUser}
               profilUser={profilUser}
               editProfil={editProfil}
               setEditProfil={setEditProfil}
            />

            {editProfil ? (
               <EditProfil profilUser={profilUser} />
            ) : (
               <ul className="posts-container">
                  <span className="posts-container-header">
                     {allPosts.length} Postes
                  </span>
                  {allPosts.map(
                     (
                        {
                           description,
                           imageUrl,
                           userId,
                           likes,
                           id,
                           publisherName,
                           publisherImg,
                        },
                        i
                     ) => (
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
                              i={i}
                              likesArray={likesArray}
                           />
                        </li>
                     )
                  )}
               </ul>
            )}
         </div>
         <Footer />
      </div>
   )
}

export default Profil
