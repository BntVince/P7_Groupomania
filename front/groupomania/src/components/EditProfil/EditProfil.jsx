import React from 'react'
import { useState, useEffect } from 'react'
import './EditProfil.css'
import cancelNewPost from '../../assets/cancel-new-post.png'
import axios from 'axios'

function EditProfil({
   profilUser,
   activeUser,
   setActiveUser,
   setProfilUser,
   setEditProfil,
}) {
   const [softEditProfil, setSoftEditProfil] = useState(true)
   const [file, setFile] = useState(null)
   const [preview, setPreview] = useState(profilUser.profilImg)
   const [userName, setUserName] = useState(profilUser.userName)
   const [email, setEmail] = useState('')
   const [newPassword, setNewPassword] = useState('')
   const [oldPassword, setOldPassword] = useState('')

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

   const submitSoftChange = (e) => {
      e.preventDefault()
      if (!file && (userName === '' || userName === profilUser.userName)) {
         alert("Vous n'avez saisie aucune modification à envoyer")
      } else if (softEditProfil) {
         const userData = new FormData()
         userName === '' && setUserName(profilUser.userName)
         userData.append('userName', userName)
         if (file) {
            userData.append('image', file, file.name)
         }
         axios.put(`/auth/${profilUser.id}/soft`, userData).then((res) => {
            console.log(res)
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
   }

   return (
      <div className="flex-cl form-container">
         {softEditProfil ? (
            <form className="form-profil flex-cl" onSubmit={submitSoftChange}>
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
                  <img
                     src={preview}
                     alt=""
                     className="form-profil-img-preview"
                  />

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
                  onChange={(e) => setUserName(e.target.value)}
               />

               <button type="submit" className="form-profil-submit btn">
                  Enregistrer les informations
               </button>
            </form>
         ) : (
            <form className="form-profil flex-cl">
               <input
                  type="email"
                  name="email"
                  id="email"
                  className="form-profil-username"
                  placeholder="Nouvelle adresse email"
                  onChange={(e) => setEmail(e.target.value)}
               />
               <input
                  type="password"
                  name="password"
                  id="password"
                  className="form-profil-username"
                  placeholder="Nouveau mot de passe"
                  onChange={(e) => setNewPassword(e.target.value)}
               />
               <input
                  type="password"
                  name="password"
                  id="password"
                  className="form-profil-username"
                  placeholder="Ancien mot de passe"
                  onChange={(e) => setOldPassword(e.target.value)}
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
            <button className="btn delete-btn">Supprimer le compte</button>
         </div>
      </div>
   )
}

export default EditProfil
