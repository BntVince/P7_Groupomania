import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from '../../http-common'
import Header from '../../components/Header/Header'
import ProfilHeader from '../../components/ProfilHeader/ProfilHeader'
import Footer from '../../components/Footer/Footer'
import Post from '../../components/Post/Post'
import './Profil.css'
import EditProfil from '../../components/EditProfil/EditProfil'
import DeleteAlert from '../../components/DeleteAlert/DeleteAlert'

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
   const [deleteAlert, setDeleteAlert] = useState(false)
   const { profilId } = useParams()

   axios.defaults.headers.common = { Authorization: `Bearer ${activeToken}` }

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
         <Header activeUser={activeUser} />
         <div className="profil-container">
            <ProfilHeader
               activeUser={activeUser}
               profilUser={profilUser}
               editProfil={editProfil}
               setEditProfil={setEditProfil}
            />

            {editProfil ? (
               <EditProfil
                  profilUser={profilUser}
                  setActiveUser={setActiveUser}
                  activeUser={activeUser}
                  setProfilUser={setProfilUser}
                  setEditProfil={setEditProfil}
                  deleteAlert={deleteAlert}
                  setDeleteAlert={setDeleteAlert}
               />
            ) : (
               <ul className="posts-container">
                  <span className="posts-container-header">
                     {allPosts.length} Postes
                  </span>
                  {allPosts.map(
                     (
                        { description, imageUrl, userId, likes, id, user },
                        i
                     ) => (
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
            )}
            {activeUser.isAdmin && (
               <button
                  className="btn delete-btn"
                  onClick={() => setDeleteAlert(true)}
               >
                  Supprimer le compte
               </button>
            )}
            {deleteAlert && (
               <DeleteAlert
                  setDeleteAlert={setDeleteAlert}
                  profilUser={profilUser}
               />
            )}
         </div>
         <Footer />
      </div>
   )
}

export default Profil
