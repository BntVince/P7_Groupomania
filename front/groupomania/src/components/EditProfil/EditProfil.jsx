import React from 'react'
import { useState, useEffect } from 'react'
import './EditProfil.css'
import cancelNewPost from '../../assets/cancel-new-post.png'
import axios from 'axios'
import DeleteAlert from '../DeleteAlert/DeleteAlert'
import defaultProfilImg from '../../assets/default.png'

function EditProfil({
   profilUser,
   activeUser,
   setActiveUser,
   setProfilUser,
   setEditProfil,
   deleteAlert,
   setDeleteAlert,
}) {
   const [softEditProfil, setSoftEditProfil] = useState(true)
   const [file, setFile] = useState(null)
   const [preview, setPreview] = useState(profilUser.profilImg)
   const [userName, setUserName] = useState('')
   const [email, setEmail] = useState('')
   const [newPassword, setNewPassword] = useState('')
   const [currentPassword, setCurrentPassword] = useState('')

   function cancelImg() {
      setFile(null)
      setPreview(profilUser.profilImg)
   }

   useEffect(() => {
      if (!file) {
         setPreview(profilUser.profilImg)
         return
      }
      const fileURL = URL.createObjectURL(file)
      setPreview(fileURL)
   }, [file])

   const submitProfilChange = (e) => {
      e.preventDefault()
      if (softEditProfil) {
         if (!file && (userName === '' || userName === profilUser.userName)) {
            alert("Vous n'avez saisie aucune modification à envoyer")
         } else {
            const userData = new FormData()
            userName === ''
               ? userData.append('userName', profilUser.userName)
               : userData.append('userName', userName)
            if (file) {
               userData.append('image', file, file.name)
            }
            axios.put(`/auth/${profilUser.id}/soft`, userData).then((res) => {
               setActiveUser({
                  ...activeUser,
                  userName: res.data.updatedProfil.userName,
                  profilImg: res.data.updatedProfil.profilImg,
               })
               setProfilUser({
                  ...profilUser,
                  userName: res.data.updatedProfil.userName,
                  profilImg: res.data.updatedProfil.profilImg,
               })
               setEditProfil(false)
            })
         }
      } else {
         if (email === '' && newPassword === '') {
            alert("Vous n'avez saisie aucune modification à envoyer")
         } else if (currentPassword === '') {
            alert(
               'Nous avons besoin de votre ancien mot de passe pour procéder à ces changement'
            )
         } else {
            const userData = {}
            userData.email = email
            userData.newPassword = newPassword
            userData.currentPassword = currentPassword
            axios.put(`/auth/${profilUser.id}/hard`, userData)
         }
      }
   }

   return (
      <div className="flex-cl form-container">
         {softEditProfil ? (
            <form className="form-profil flex-cl" onSubmit={submitProfilChange}>
               <div className="form-profil-img flex">
                  <input
                     type="file"
                     name="file"
                     id="file"
                     accept="image/png, image/jpeg"
                     className="new-post-img-input"
                     onChange={(e) => {
                        setFile(e.target.files[0])
                        console.log(e.target.files[0])
                     }}
                  />
                  {preview ? (
                     <img
                        src={preview}
                        alt=""
                        className="form-profil-img-preview"
                     />
                  ) : (
                     <img
                        src={defaultProfilImg}
                        alt=""
                        className="form-profil-img-preview"
                     />
                  )}

                  <label htmlFor="file" className="form-profil-img-label btn">
                     Changer la photo
                  </label>
                  {preview !== profilUser.profilImg && (
                     <img
                        src={cancelNewPost}
                        alt=""
                        className="form-profil-img--cancel-img"
                        onClick={cancelImg}
                     />
                  )}
               </div>
               <input
                  type="text"
                  name="userName"
                  id="userName"
                  className="form-profil-username"
                  placeholder="Nom d'utilisateur"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
               />

               <button type="submit" className="form-profil-submit btn">
                  Enregistrer les informations
               </button>
            </form>
         ) : (
            <form className="form-profil flex-cl" onSubmit={submitProfilChange}>
               <input
                  type="email"
                  name="email"
                  id="email"
                  className="form-profil-username"
                  placeholder="Nouvelle adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
               />
               <input
                  type="password"
                  name="password"
                  id="old-password"
                  className="form-profil-username"
                  placeholder="Nouveau mot de passe"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
               />
               <input
                  type="password"
                  name="password"
                  id="current-password"
                  className="form-profil-username"
                  placeholder="Ancien mot de passe"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
               />
               <span>
                  Les modifications des identifiants de connexion requièrent
                  votre mot de passe pour être validées
               </span>
               <button type="submit" className="form-profil-submit btn">
                  Enregistrer les informations
               </button>
            </form>
         )}

         <div className="form-container-footer">
            {softEditProfil ? (
               <button
                  className="btn switch-form"
                  onClick={() => setSoftEditProfil(false)}
               >
                  Modifier les identifants de connexion
               </button>
            ) : (
               <button
                  className="btn switch-form"
                  onClick={() => setSoftEditProfil(true)}
               >
                  Modifier le profil
               </button>
            )}
            {deleteAlert && (
               <DeleteAlert
                  setDeleteAlert={setDeleteAlert}
                  profilUser={profilUser}
               />
            )}
            <button
               className="btn delete-btn"
               onClick={() => setDeleteAlert(true)}
            >
               Supprimer le compte
            </button>
         </div>
      </div>
   )
}

export default EditProfil
